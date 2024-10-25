import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb"; 

export async function POST(req: Request) {
    try {
        const currentUser = await getCurrentUser();
        const { commentId } = await req.json();

        // Kullanıcı veya postId doğrulaması yapılır
        if (!currentUser || !commentId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Postu bul ve sil
        const post = await prisma.comment.findUnique({
            where: { id: commentId },
        });

        // Postu sil
        await prisma.comment.delete({
            where: { id: commentId },
        });

        return new NextResponse("comment deleted successfully", { status: 200 });
    } catch (error) {
        console.error("Error deleting post:", error);
        return new NextResponse("Something went wrong", { status: 500 });
    }
}
