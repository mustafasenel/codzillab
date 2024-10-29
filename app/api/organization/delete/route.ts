import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb"; 

export async function POST(req: Request) {
    try {
        const currentUser = await getCurrentUser();
        const { organizationId } = await req.json();

        // Kullanıcı veya postId doğrulaması yapılır
        if (!currentUser || !organizationId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Postu bul ve sil
        const organization = await prisma.organization.findUnique({
            where: { id: organizationId },
        });

        // Postun mevcut olup olmadığını ve kullanıcıya ait olup olmadığını kontrol et
        if (!organization || organization.ownerId !== currentUser.id) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        // Postu sil
        await prisma.organization.delete({
            where: { id: organizationId },
        });

        return new NextResponse("Organization deleted successfully", { status: 200 });
    } catch (error) {
        console.error("Error deleting Organization:", error);
        return new NextResponse("Something went wrong", { status: 500 });
    }
}
