// app/api/users/[username]/route.ts
import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb"; 
import { FullUserType } from "@/types";

export async function GET(request: Request, { params }: { params: { identifier: string } }) {
  const currentUser = await getCurrentUser(); // Kullanıcı bilgilerini al

  try {
    console.log("Fetching user with username:", params.identifier); // Username değerini kontrol et

    const user = await prisma.user.findUnique({
      where: { username: params.identifier }, // Username değerine göre kullanıcıyı bul
      include: {
        followers: true,
        followings: true,
        friendRequestReceived: {
          include: {
            recipient: true,
            requester: true,
          },
        },
        friendRequestSent: {
          include: {
            recipient: true,
            requester: true,
          },
        },
      },
    });

    if (!user) {
      console.log("User not found for username:", params.identifier); // Eğer kullanıcı bulunamazsa
      return NextResponse.json({ error: "User not found" }, { status: 404 }); // 404 hatası döndür
    }

    return NextResponse.json(user as FullUserType); // Başarılı bir şekilde kullanıcıyı döndür
  } catch (error: any) {
    console.error("Error fetching user:", error); // Hata durumunu yazdır
    return NextResponse.json({ error: "Internal server error" }, { status: 500 }); // Sunucu hatası döndür
  }
}
