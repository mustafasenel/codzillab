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

        // Belirtilen user'ın takipçilerini getir ve arama terimini uygula
        const followers = await prisma.follower.findMany({
            where: {
                followingId: userId,
                follower: {
                    OR: [
                        { name: { contains: search, mode: "insensitive" } },
                        { surname: { contains: search, mode: "insensitive" } },
                        { username: { contains: search, mode: "insensitive" } },
                    ],
                },
            },
            include: {
                follower: true, // Kullanıcı bilgilerini tam User formatında dahil et
            },
            skip: pageParam,
            take,
        });

        // Toplam takipçi sayısını arama kriterine göre al
        const totalFollowers = await prisma.follower.count({
            where: {
                followingId: userId,
                follower: {
                    OR: [
                        { name: { contains: search, mode: "insensitive" } },
                        { surname: { contains: search, mode: "insensitive" } },
                        { username: { contains: search, mode: "insensitive" } },
                    ],
                },
            },
        });

        // Takipçileri tam User formatında döndür
        return NextResponse.json({
            followers: followers.map((f) => f.follower), // follower alanını User formatında döndür
            total: totalFollowers,
            page: Math.floor(pageParam / take) + 1,
            totalPages: Math.ceil(totalFollowers / take),
        });
    } catch (error) {
        console.error("Error fetching followers:", error);
        return NextResponse.error();
    }
}
