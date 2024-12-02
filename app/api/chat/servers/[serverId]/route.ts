import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server";

export async function DELETE(req:Request, { params }: { params: { serverId: string } }) {
    try {
        const profile = await getCurrentUser();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const server = await prismadb.server.delete({
            where:{
                id: params.serverId,
                profileId: profile.id
            }
        })

        return  NextResponse.json(server)

    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req:Request, { params }: { params: { serverId: string } }) {
    try {
        const profile = await getCurrentUser();
        const {imageUrl, name} = await req.json()

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const server = await prismadb.server.update({
            where:{
                id: params.serverId,
                profileId:profile.id
            },
            data:{
                name,
                imageUrl
            }
        })

        return  NextResponse.json(server)

    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}