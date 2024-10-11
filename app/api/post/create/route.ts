import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await request.json();
        const { content, attachments, isOrganization, userId_organizationId } = body;

        let newPostData;

        if (isOrganization) {
            newPostData = {
                content,
                organizationId: userId_organizationId,
            };
        } else {
            newPostData = {
                content,
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

        return new NextResponse(JSON.stringify(newPost), { status: 201 });

    } catch (error: any) {
        return new NextResponse(error.message, { status: 500 });
    }
}
