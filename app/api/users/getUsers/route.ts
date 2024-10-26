import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/actions/getCurrentUser";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const pageParam = Number(searchParams.get("skip")) || 0;
    const take = Number(searchParams.get("take")) || 10;
    const search = searchParams.get("search") || ""; // Arama terimini al

    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Arama terimi mevcutsa ve currentUser'ı hariç tutarak kullanıcıları ara
        const users = await prisma.user.findMany({
            where: {
                AND: [
                    { id: { not: currentUser.id } }, // Şu anki kullanıcıyı hariç tut
                    {
                        OR: [
                            { name: { contains: search, mode: "insensitive" } },
                            { surname: { contains: search, mode: "insensitive" } },
                            { username: { contains: search, mode: "insensitive" } },
                        ],
                    },
                ],
            },
            include: {
                followers:true,
                followings:true
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip: pageParam,
            take,
        });

        // Toplam kullanıcı sayısını arama kriterine ve currentUser hariç olacak şekilde hesapla
        const totalUsers = await prisma.user.count({
            where: {
                AND: [
                    { id: { not: currentUser.id } }, // Şu anki kullanıcıyı hariç tut
                    {
                        OR: [
                            { name: { contains: search, mode: "insensitive" } },
                            { surname: { contains: search, mode: "insensitive" } },
                            { username: { contains: search, mode: "insensitive" } },
                        ],
                    },
                ],
            },
            
        });

        return NextResponse.json({
            users,
            total: totalUsers,
            page: Math.floor(pageParam / take) + 1,
            totalPages: Math.ceil(totalUsers / take),
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.error();
    }
}
