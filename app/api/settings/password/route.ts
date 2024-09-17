import bcrypt from 'bcrypt';
import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { oldPassword, password } = body;

    if (!currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Kullanıcının mevcut şifresini al
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: { hashedPassword: true, account: true }, // hashedPassword ve isSocial'ı al
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Sosyal medya ile bağlı ise şifre kontrolü yapma
    if (!!user?.account?.length) {
      return new NextResponse("Sosyal hesap ile bağlısınız. Şifrenizi değiştiremezsiniz.", { status: 400 });
    }

    // Eski şifreyi doğrula
    if (user.hashedPassword) {
      const isPasswordValid = await bcrypt.compare(oldPassword, user.hashedPassword);
      
      if (!isPasswordValid) {
        return new NextResponse("Invalid old password", { status: 400 });
      }

      // Yeni şifreyi hash'le
      const saltRounds = 10; // veya uygun bir değer
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Kullanıcıyı güncelle
      const updatedUser = await prisma.user.update({
        where: { id: currentUser.id },
        data: { hashedPassword },
      });

      const responseBody = JSON.stringify({ updatedUser });

      return new NextResponse(responseBody, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return new NextResponse("Password not found", { status: 404 });
    }
  } catch (error) {
    console.error("Error updating password:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
