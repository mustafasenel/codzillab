import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb"; 
import getCurrentUser from "@/actions/getCurrentUser";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId"); // Post ID'sini al
    const pageParam = Number(searchParams.get("skip")) || 0; // Sayfa parametresi
    const take = Number(searchParams.get("take")) || 3; // Her sayfada alınacak yorum sayısı (varsayılan 5)

    try {
        // Şu anki kullanıcıyı al
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!postId) {
            return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
        }

        // Yorumları al (sayfalama ile)
        const comments = await prisma.comment.findMany({
            where: {
                postId: postId, // Yorumların ait olduğu post
            },
            orderBy: {
                createdAt: 'desc' // Yorumları en yeniye göre sıralama
            },
            include: {
                user: true, // Yorum yazan kullanıcıyı dahil et
                likes: true
            },
            skip: pageParam, // Sayfalama
            take, // Alınacak yorum sayısı
        });

        // Toplam yorum sayısını hesapla (sonraki sayfalar için)
        const totalComments = await prisma.comment.count({
            where: {
                postId: postId,
            },
        });

        return NextResponse.json({
            comments,
            total: totalComments,
            page: Math.floor(pageParam / take) + 1, // Geçerli sayfa
            totalPages: Math.ceil(totalComments / take), // Toplam sayfa sayısı
        });

    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.error();
    }
}
