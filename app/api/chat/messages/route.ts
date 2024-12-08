import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { Message } from "@prisma/client";

const MESSAGES_BATCH = 10;

export async function GET(req:Request) {
    try {
        const profile = getCurrentUser();
        const { searchParams } = new URL(req.url);

        const cursor = searchParams.get("cursor");
        const channelId = searchParams.get("channelId");

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!channelId) {
            return new NextResponse("Channel ID missing", { status: 400 })
        }

        let messages: Message[] = [];

        if (cursor) {
            messages = await prismadb.message.findMany({
                take: MESSAGES_BATCH,
                skip: 1,
                cursor: {
                    id: cursor
                },
                where: {
                    channelId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdt: "desc"
                }
            });

        } else {
            messages = await prismadb.message.findMany({
                take: MESSAGES_BATCH,
                where: {
                    channelId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdt: "desc"
                }
            })
        }

        let nextCursor = null;

        if (messages.length === MESSAGES_BATCH) {
            nextCursor = messages[MESSAGES_BATCH - 1].id;
        }

        return NextResponse.json({
            items: messages,
            nextCursor
        })

    } catch (error) {
        console.log("[MESSAGES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}