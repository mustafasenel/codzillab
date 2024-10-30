import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/actions/getCurrentUser"; // Kullanıcı bilgilerini almak için gerekli fonksiyon

export async function GET() {
    try {
        const currentUser = await getCurrentUser();

        // Kullanıcı doğrulama
        if (!currentUser?.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // En çok post eklenmiş olan 5 tag'i çek
        const tags = await prisma.tag.findMany({
            include: {
                posts: true, // Post ilişkisini dahil et
            },
            orderBy: {
                posts: {
                    _count: 'desc', // Post sayısına göre sıralama
                },
            },
            take: 5, // Sadece 5 tag al
        });

        return NextResponse.json(tags, { status: 200 });
    } catch (error: any) {
        return new NextResponse(error.message, { status: 500 });
    }
}
