import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prismadb"
import { MemnerRole } from "@prisma/client";
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
    try {
        const { name, imageUrl } = await req.json();

        const user = await getCurrentUser();

        if(!user?.id)
        {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const server = await prismadb.server.create({
            data: {
                profileId: user.id,
                name,
                imageUrl,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        {
                            name: "general",
                            profileId: user.id
                        }
                    ]
                },
                members: {
                    create: [
                        {
                            profileId: user.id,
                            role: MemnerRole.ADMIN
                        }
                    ]
                }
            }
        })

        return NextResponse.json(server);

    } catch (error) {
        console.log("ERROR: ", error)
        return new NextResponse("Error", { status: 500 })
    }
}