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
        const { comment, postId } = body;

        if (!comment || !postId) {
            return new NextResponse('Invalid data', { status: 400 });
        }

        const newComment = await prisma.comment.create({
            data: {
                content: comment,
                postId: postId,
                userId: currentUser.id, // Şu anki kullanıcıdan alınan ID
            },
        });

        await prisma.post.update({
            where: { 
                id: postId 
            },
            data: {
                CommentsCount: {
                    increment: 1 
                }
            }
        })

        return new NextResponse(JSON.stringify(newComment), { status: 201 });

    } catch (error: any) {
        // Hata mesajını döndür
        return new NextResponse(error.message, { status: 500 });
    }
}
