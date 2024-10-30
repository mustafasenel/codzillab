import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/actions/getCurrentUser";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageParam = Number(searchParams.get("skip")) || 0; // Sayfa parametresini al
  const take = Number(searchParams.get("take")) || 10; // Her sayfada gösterilecek post sayısı
  const userId = searchParams.get("userId");
  const organizationId = searchParams.get("organizationId");

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const whereCondition = userId
      ? { userId } // Eğer userId varsa, onu kullan
      : organizationId
      ? { organizationId } // Yoksa organizationId ile ara
      : {}; // Her iki değer de yoksa, boş bir nesne döndür

    const posts = await prisma.post.findMany({
      where: whereCondition,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        attachments: true,
        user: true,
        organization: true,
        likes: true,
      },
      skip: pageParam, // Sayfalama
      take, // Alınacak post sayısı
    });

    // Toplam post sayısını hesapla (sonraki sayfalar için)
    const totalPosts = await prisma.post.count({
      where: whereCondition,
    });

    return NextResponse.json({
      posts,
      total: totalPosts,
      page: Math.floor(pageParam / take) + 1, // Geçerli sayfa
      totalPages: Math.ceil(totalPosts / take), // Toplam sayfa sayısını hesapla
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.error();
  }
}
