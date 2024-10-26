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

        // Postu sil
        const comment = await prisma.comment.delete({
            where: { id: commentId },
        });

       const updatedPost =  await prisma.post.update({
            where: { id: comment.postId },
            data: { CommentsCount: { decrement: 1 } },
          })

        return new NextResponse("comment deleted successfully", { status: 200 });
    } catch (error) {
        console.error("Error deleting post:", error);
        return new NextResponse("Something went wrong", { status: 500 });
    }
}
