import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { MediaType, PostType } from "@prisma/client";

export async function PUT(request: Request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser?.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await request.json();
        const { content, attachments, isOrganization, userId_organizationId, location, type, eventName, eventDate, postId } = body;

        // Fetch the existing post, including existing media attachments
        const existingPost = await prisma.post.findUnique({
            where: { id: postId },
            include: { attachments: true }, // Include existing attachments
        });

        // Check if the post exists and belongs to the current user
        if (!existingPost || (existingPost?.userId && existingPost.userId !== currentUser.id)) {
            return new NextResponse('Unauthorized', { status: 403 });
        }

        let postType = type === "EVENT" ? PostType.EVENT : PostType.POST;

        // 1. Tag'leri ayır
        const tags: string[] = content.match(/#\w+/g) || []; // # ile başlayan kelimeleri al
        const uniqueTags: string[] = [];
        const tagSet: { [key: string]: boolean } = {};

        tags.forEach(tag => {
            const tagName = tag.substring(1); // # işaretini kaldır
            if (!tagSet[tagName]) {
                tagSet[tagName] = true; // Tag'leri benzersiz hale getir
                uniqueTags.push(tagName); // Benzersiz tag'i ekle
            }
        });

        // 2. Tag'leri veritabanına kaydet
        const tagRecords = await Promise.all(uniqueTags.map(async tag => {
            return await prisma.tag.upsert({
                where: { name: tag },
                update: {},
                create: { name: tag },
            });
        }));

        // 3. Yeni post verisini oluştur
        const updatedPostData = {
            content,
            eventName,
            eventDate,
            location,
            type: postType,
        };

        // 4. Postu güncelle
        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: updatedPostData,
            include: {
                attachments: true,
                user: true,
                organization: true,
                likes:true
            },
        });

        // 5. Attachments güncelleme
        if (attachments) {
            // 5.1 Mevcut attachments'ları al
            const existingAttachments = existingPost.attachments.map(media => media.url);

            // 5.2 Yeni attachments'ları ekle, mevcut olanları göz ardı et
            const newAttachmentsToAdd = attachments.filter(
                (attachment: any) => !existingAttachments.includes(attachment.url)
            );

            if (newAttachmentsToAdd.length > 0) {
                await prisma.media.createMany({
                    data: newAttachmentsToAdd.map((attachment: any) => ({
                        postId: updatedPost.id,
                        type: MediaType.IMAGE, // Assuming all attachments are images
                        url: attachment.url,
                    })),
                });
            }
        }

        // 6. Post ile tag'leri ilişkilendirme
        await Promise.all(tagRecords.map(async (tagRecord) => {
            // Check if the postTag already exists to avoid duplication
            const existingPostTag = await prisma.postTag.findUnique({
                where: {
                    postId_tagId: {
                        postId: updatedPost.id,
                        tagId: tagRecord.id,
                    },
                },
            });

            // Only create the postTag if it doesn't already exist
            if (!existingPostTag) {
                await prisma.postTag.create({
                    data: {
                        postId: updatedPost.id,
                        tagId: tagRecord.id,
                    },
                });
            }
        }));

        return new NextResponse(JSON.stringify(updatedPost), { status: 200 });

    } catch (error: any) {
        return new NextResponse(error.message, { status: 500 });
    }
}
