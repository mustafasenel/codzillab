import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb"; 

export async function PUT(req: Request) {
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
        if (!post ) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const newStatus = post.commentStatus === "ACTIVE" ? "DISABLE" : "ACTIVE";

        await prisma.post.update({
            where: { id: postId },
            data: {
                commentStatus: newStatus
            }
        });

        return new NextResponse("Post updated successfully", { status: 200 });
    } catch (error) {
        console.error("Error updating post:", error);
        return new NextResponse("Something went wrong", { status: 500 });
    }
}
