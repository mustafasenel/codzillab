import { v4 as uuidv4 } from "uuid"
import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb"

export async function PATCH(req:Request, { params }: { params: { serverId: string } }) {
    try {
        const profile = await getCurrentUser();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!params.serverId) {
            return new NextResponse("ServerId Missing", { status: 400 });
        }

        const server = await prismadb.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                inviteCode: uuidv4(),
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("SERVERID: ", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}