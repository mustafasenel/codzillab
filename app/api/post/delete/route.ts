import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb"; 

export async function POST(req: Request) {
    try {
        const currentUser = await getCurrentUser();
        const { postId } = await req.json();

        // Kullanıcı veya postId doğrulaması yapılır
        if (!currentUser || !postId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Postu bul ve sil
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        // Postun mevcut olup olmadığını ve kullanıcıya ait olup olmadığını kontrol et
        if (!post || post.userId !== currentUser.id) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        // Postu sil
        await prisma.post.delete({
            where: { id: postId },
        });

        return new NextResponse("Post deleted successfully", { status: 200 });
    } catch (error) {
        console.error("Error deleting post:", error);
        return new NextResponse("Something went wrong", { status: 500 });
    }
}
