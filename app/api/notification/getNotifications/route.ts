import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb"; 
import getCurrentUser from "@/actions/getCurrentUser";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const pageParam = Number(searchParams.get("skip")) || 0; // Sayfa parametresi
    const take = Number(searchParams.get("take")) || 5; // Her sayfada alınacak yorum sayısı (varsayılan 5)

    try {
        // Şu anki kullanıcıyı al
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Yorumları al (sayfalama ile)
        const notifications = await prisma.notification.findMany({
            where: {
                userId: currentUser.id, // Yorumların ait olduğu post
            },
            orderBy: {
                createdAt: 'desc' // Yorumları en yeniye göre sıralama
            },
            include: {
                actor: true, // Yorum yazan kullanıcıyı dahil et
            },
            skip: pageParam, // Sayfalama
            take, // Alınacak yorum sayısı
        });

        // Toplam yorum sayısını hesapla (sonraki sayfalar için)
        const totalnotifications = await prisma.notification.count({
            where: {
                userId: currentUser.id,
            },
        });

        return NextResponse.json({
            notifications,
            total: totalnotifications,
            page: Math.floor(pageParam / take) + 1, // Geçerli sayfa
            totalPages: Math.ceil(totalnotifications / take), // Toplam sayfa sayısı
        });

    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.error();
    }
}
