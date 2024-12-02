import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function DELETE(req: Request, { params }: { params: { memberId: string } }) {
    try {
        const profile = await getCurrentUser()
        const { searchParams } = new URL(req.url);
        
        const serverId = searchParams.get("serverId")

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!serverId) {
            return new NextResponse("Missing Server ID", { status: 400 })
        }

        if (!params.memberId) {
            return new NextResponse("Missing Member ID", { status: 400 })
        }

        const server = await prismadb.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    deleteMany: {
                        id: params.memberId,
                        profileId: {
                            not: profile.id
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: { memberId: string } }) {
    try {
        const profile = await getCurrentUser()
        const { searchParams } = new URL(req.url);
        const { role } = await req.json();

        const serverId = searchParams.get("serverId")

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!serverId) {
            return new NextResponse("Missing Server ID", { status: 400 })
        }

        const server = await prismadb.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members:{
                    update: {
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile.id
                            }
                        },
                        data: {
                            role: role
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}