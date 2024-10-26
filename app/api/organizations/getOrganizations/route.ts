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

        // Arama terimi mevcutsa, kullanıcıları 'name', 'surname' veya 'username' alanlarında ara
        const organizations = await prisma.organization.findMany({
            where: {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },

                ],
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                followers: true,
            },
            skip: pageParam,
            take,
        });

        const totalOrganizations = await prisma.organization.count({
            where: {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },

                ],
            },
        });

        return NextResponse.json({
            organizations,
            total: totalOrganizations,
            page: Math.floor(pageParam / take) + 1,
            totalPages: Math.ceil(totalOrganizations / take),
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.error();
    }
}
