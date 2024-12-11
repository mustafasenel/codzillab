import getCurrentUserPages from "@/actions/getCurrentUserPages";
import { NextApiRequest } from "next";
import prismadb from "@/lib/prismadb";
import { MemnerRole } from "@prisma/client";
import { NextApiResponeServerIo } from "@/types";
import { pusherServer } from "@/lib/pusher";

export default async function handler(req: NextApiRequest, res: NextApiResponeServerIo) {
    if (req.method !== "DELETE" && req.method !== "PATCH") {
        return res.status(405).json({error: "Method not allowed"})
    }

    try {
        const profile = await getCurrentUserPages(req,res);
        const { messageId, serverId, channelId } = req.query;
        const { content } = req.body;
        
        if (!profile) {
            return res.status(401).json({error: "Unauthorized"})
        }

        if (!messageId) {
            return res.status(400).json({error: "MessageId missing"})
        }

        if (!serverId) {
            return res.status(400).json({error: "ServerID missing"})
        }

        if (!channelId) {
            return res.status(400).json({error: "ChannelId missing"})
        }

        const server = await prismadb.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            include: {
                members: true
            }
        });

        if (!server) {
            return res.status(404).json({error: "Server not found"})
        }

        const channel = await prismadb.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: server.id
            }
        });

        if (!channel) {
            return res.status(404).json({error: "Channel not found"})
        }

        const member = server.members.find((member) => member.profileId === profile.id);
        
        if (!member) {
            return res.status(404).json({error: "Member not found"})
        }

        let message = await prismadb.message.findFirst({
            where: {
                id: messageId as string,
                channelId: channel.id
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        if (!message || message.deleted) {
            return res.status(404).json({error: "Message not found"})
        }

        const isMessageOwner = message.memberId === member.id;
        const isAdmin = member.role === MemnerRole.ADMIN;
        const isModerator = member.role === MemnerRole.MODERATOR;
        const canModify = isMessageOwner || isAdmin || isModerator;

        if (!canModify) {
            return res.status(401).json({error: "Unauthorized"})
        }

        if (req.method === "DELETE") {
            message = await prismadb.message.update({
                where: {
                    id: messageId as string
                },
                data: {
                    fileUrl: null,
                    content: "Bu mesaj silindi.",
                    deleted: true
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            });
        }

        if (req.method === "PATCH") {
            if (!isMessageOwner) {
                return res.status(401).json({error: "Unauthorized"})
            }
    
            message = await prismadb.message.update({
                where: {
                    id: messageId as string
                },
                data: {
                    content,
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            });
        }

        const updateKey = `chat_${channelId}_messages_update`;

        const channelKey = `chat_${channelId}`;

        pusherServer.trigger(channelKey, updateKey, message);

        return res.status(200).json(message);
    } catch (error) {
        console.log("[MESSAGE EDIT&DELETE]", error);
        return res.status(500).json({error: "Internal error"})
    }
}