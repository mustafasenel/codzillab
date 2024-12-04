import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prismadb"
import { MemnerRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(req:Request, { params }: { params: { channelId: string } }) {
    try {
        const profile = await getCurrentUser();
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get("serverId")

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        if (!serverId) {
            return new NextResponse("ServerId missing", { status: 400 })
        }

        const server = await prismadb.server.update({
            where:{
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemnerRole.ADMIN, MemnerRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    delete: {
                        id: params.channelId,
                        name: {
                            not: "general"
                        }
                    }
                }
            }
        })

        return  NextResponse.json(server)

    } catch (error) {
        console.log(error);
        return new NextResponse("[CHANNEL ID DELETE] Internal Error:", { status: 500 });
    }
}

export async function PATCH(req:Request, { params }: { params: { channelId: string } }) {
    try {
        const profile = await getCurrentUser();
        const { name, type } = await req.json();
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get("serverId")

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        if (!serverId) {
            return new NextResponse("ServerId missing", { status: 400 })
        }
        if (!params.channelId) {
            return new NextResponse("ChannelId missing", { status: 400 })
        }

        if (name === "general") {
            return new NextResponse("Name cannot be general", { status: 400 })
        }

        const server = await prismadb.server.update({
            where:{
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemnerRole.ADMIN, MemnerRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    update: {
                        where: {
                            id: params.channelId,
                            name: {
                                not: "general"
                            }
                        },
                        data: {
                            name,
                            type
                        }
                    }
                }
            }
        })

        return  NextResponse.json(server)

    } catch (error) {
        console.log(error);
        return new NextResponse("[CHANNEL ID DELETE] Internal Error:", { status: 500 });
    }
}