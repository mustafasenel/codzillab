import { NextApiRequest } from "next";
import prismadb from "@/lib/prismadb";
import getCurrentUserPages from "@/actions/getCurrentUserPages";
import { NextApiResponeServerIo } from "@/types";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponeServerIo 
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed"});
    }

    try {
        const profile = await getCurrentUserPages(req, res);
        const { content, fileUrl } = req.body;
        const { conversationId } = req.query;

        if (!profile) {
            return res.status(401).json({ error: "Unauthorized"});
        }

        if (!conversationId) {
            return res.status(400).json({ error: "conversationId missing"});
        }
        if (!content) {
            return res.status(400).json({ error: "content missing"});
        }

        const conversation = await prismadb.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        memberOne: {
                            profileId: profile.id
                        }
                    },
                    {
                        memberTwo: {
                            profileId: profile.id
                        }
                    }
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found"});
        }

        const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo

        if (!member) {
            return res.status(404).json({ error: "Member not found" });
        }

        const message = await prismadb.directMessage.create({
            data: {
                content,
                fileUrl,
                conversationId: conversationId as string,
                memberId: member.id,
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        });


        const addKey = `chat_${conversationId}_messages`;

        res?.socket?.server?.io?.emit(addKey, message);

        return res.status(200).json(message);
    } catch (error) {
        console.log("MESSAGES POST" ,error);
        return res.status(500).json({ error: "Internal Error"});
    }
}