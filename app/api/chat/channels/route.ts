import getCurrentUser from "@/actions/getCurrentUser"
import { NextResponse } from "next/server"
import prismadb from "@/lib/prismadb"
import { MemnerRole } from "@prisma/client";

export async function POST(req: Request) {
    try {
        const profile = await getCurrentUser();
        const { name, type} = await req.json();
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get("serverId")

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!serverId) {
            return new NextResponse("Server ID missing", { status: 400 })
        }

        if (name === "general") {
            return new NextResponse("Name cannot be general", { status: 400 })
        }

        const server = await prismadb.server.update({
            where: {
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
                    create: {
                        profileId: profile.id,
                        name,
                        type
                    }
                }
            }
        });

        return NextResponse.json(server)

    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Error Channel", { status: 500 })
    }
}