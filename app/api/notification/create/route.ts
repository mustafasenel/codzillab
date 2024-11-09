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
        let notificationContent;


        if (type === 'LIKE') {
            notificationType = NotificationType.LIKE
            notificationContent= "liked"
        } else if (type === 'COMMENT') {
            notificationType = NotificationType.COMMENT
            notificationContent = content
        } else {
            notificationType = NotificationType.MENTION
            notificationContent = content
        }

        const newNotification = await prisma.notification.create({
            data: {
                userId: userId,
                actorId: currentUser.id,
                type: notificationType,
                postId: postId,
                commentId: commentId,
                content:notificationContent
            }
        })

        return new NextResponse(JSON.stringify(newNotification), { status: 201 });

    } catch (error: any) {
        return new NextResponse(error.message, { status: 500 });
    }
}
