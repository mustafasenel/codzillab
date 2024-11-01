import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { NotificationType, PostType } from "@prisma/client";

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const body = await request.json();
        const { userId, type, postId, commentId } = body;

        let notificationType;
        let content;

        if (type === 'LIKE') {
            notificationType = NotificationType.LIKE
            content = `${currentUser.name} ${currentUser.surname} gönderini beğendi`
        } else if (type === 'COMMENT') {
            notificationType = NotificationType.COMMENT
            content = `${currentUser.name} ${currentUser.surname} gönderine yorum yaptı`
        } else {
            notificationType = NotificationType.MENTION
            content = `${currentUser.name} ${currentUser.surname} gönderiye atıfta bulundu`
        }

        const newNotification = await prisma.notification.create({
            data: {
                userId: userId,
                actorId: currentUser.id,
                type: notificationType,
                postId: postId,
                commentId: commentId,
                content
            }
        })

        return new NextResponse(JSON.stringify(newNotification), { status: 201 });

    } catch (error: any) {
        return new NextResponse(error.message, { status: 500 });
    }
}
