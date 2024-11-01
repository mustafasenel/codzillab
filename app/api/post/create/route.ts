import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { PostType } from "@prisma/client";

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await request.json();
        const { content, attachments, isOrganization, userId_organizationId, location, type, eventName, eventDate } = body;

        let postType;

        if (type != "EVENT") {
            postType = PostType.POST
        } else {
            postType = PostType.EVENT
        }

        // 1. Tag'leri ayır
        const tags: string[] = content.match(/#\w+/g) || []; // # ile başlayan kelimeleri al
        const uniqueTags: string[] = []; // uniqueTags için açık tür tanımı
        const tagSet: { [key: string]: boolean } = {}; // Benzersiz tag'leri kontrol etmek için nesne

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
        let newPostData;

        if (isOrganization) {
            newPostData = {
                content,
                eventName,
                eventDate,
                location,
                type: postType,
                organizationId: userId_organizationId,
            };
        } else {
            newPostData = {
                content,
                eventName,
                eventDate,
                location,
                type: postType,
                userId: currentUser.id,
            };
        }

        // Yeni postu oluştur
        const newPost = await prisma.post.create({
            data: {
                ...newPostData,
                attachments: {
                    create: attachments?.map((attachment: any) => ({
                        type: "IMAGE", 
                        url: attachment.url,
                    })),
                },
            },
        });

        // 4. Post ile tag'leri ilişkilendirme
        await Promise.all(tagRecords.map(async (tagRecord) => {
            await prisma.postTag.create({
                data: {
                    postId: newPost.id,
                    tagId: tagRecord.id,
                },
            });
        }));

        return new NextResponse(JSON.stringify(newPost), { status: 201 });

    } catch (error: any) {
        return new NextResponse(error.message, { status: 500 });
    }
}
