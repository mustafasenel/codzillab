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
        const { userId, type, postId, commentId, content } = body;

        let notificationType;

        if (type === 'LIKE') {
            notificationType = NotificationType.LIKE
        } else if (type === 'COMMENT') {
            notificationType = NotificationType.COMMENT
        } else {
            notificationType = NotificationType.MENTION
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
