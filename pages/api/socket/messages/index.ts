import { NextApiResponeServerIo } from "@/types";
import { NextApiRequest } from "next";
import prismadb from "@/lib/prismadb";
import getCurrentUserPages from "@/actions/getCurrentUserPages";

export default async function handler(
    req: NextApiRequest,
    res:NextApiResponeServerIo
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed"});
    }

    try {
        const profile = await getCurrentUserPages(req, res);
        const { content, fileUrl } = req.body;
        const { serverId, channelId } = req.query;

        if (!profile) {
            return res.status(401).json({ error: "Unauthorized"});
        }
        if (!serverId) {
            return res.status(400).json({ error: "Server Id missing"});
        }
        if (!channelId) {
            return res.status(400).json({ error: "Channel Id missing"});
        }
        if (!content) {
            return res.status(400).json({ error: "Content Id missing"});
        }

        const server = await prismadb.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile.id,
                    }
                }
            },
            include: {
                members: true
            }
        });

        if (!server) {
            return res.status(404).json({ error: "Server not found" });
        }

        const channel = prismadb.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string
            }
        });

        if (!channel) {
            return res.status(404).json({ error: "Channel not found" });
        }

        const member = server.members.find((member) => member.profileId === profile.id);

        if (!member) {
            return res.status(404).json({ error: "Member not found" });
        }

        const message = await prismadb.message.create({
            data: {
                content,
                fileUrl,
                channelId: channelId as string,
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

        const channelKey = `chat_${channelId}_messages`;

        res?.socket?.server?.io?.emit(channelKey, message);
        return res.status(200).json(message);
    } catch (error) {
        console.log("MESSAGES POST" ,error);
        return res.status(500).json({ error: "Internal Error"});
    }
}