import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/actions/getCurrentUser";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const pageParam = Number(searchParams.get("skip")) || 0;
    const take = Number(searchParams.get("take")) || 10;
    const userId = searchParams.get("userId");
    const search = searchParams.get("search") || ""; // Arama terimini al

    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Eğer userId parametresi sağlanmamışsa hata döndür
        if (!userId) {
            return NextResponse.json({ error: "UserId is required" }, { status: 400 });
        }

        // Belirtilen kullanıcının takip ettiği kişileri getir ve arama terimini uygula
        const followings = await prisma.follower.findMany({
            where: {
                followerId: userId, // Kullanıcının takip ettikleri
                following: {
                    OR: [
                        { name: { contains: search, mode: "insensitive" } },
                        { surname: { contains: search, mode: "insensitive" } },
                        { username: { contains: search, mode: "insensitive" } },
                    ],
                },
            },
            include: {
                following: true, // Takip edilen kullanıcı bilgilerini dahil et
            },
            skip: pageParam,
            take,
        });

        // Toplam takip edilen sayısını arama kriterine göre al
        const totalFollowings = await prisma.follower.count({
            where: {
                followerId: userId,
                following: {
                    OR: [
                        { name: { contains: search, mode: "insensitive" } },
                        { surname: { contains: search, mode: "insensitive" } },
                        { username: { contains: search, mode: "insensitive" } },
                    ],
                },
            },
        });

        // Takip edilen kullanıcıları tam User formatında döndür
        return NextResponse.json({
            followings: followings.map((f) => f.following), // following alanını User formatında döndür
            total: totalFollowings,
            page: Math.floor(pageParam / take) + 1,
            totalPages: Math.ceil(totalFollowings / take),
        });
    } catch (error) {
        console.error("Error fetching followings:", error);
        return NextResponse.error();
    }
}
