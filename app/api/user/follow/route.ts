import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { recipientId } = body;

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!recipientId) {
      return new NextResponse("Missing info", { status: 400 });
    }

    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        requesterId: currentUser.id, // Oturum açmış kullanıcının kimliği
        recipientId: recipientId,    // Hedef kullanıcının kimliği
      },
    });

    if (existingRequest) {
      await prisma.friendRequest.delete({
        where: { id: existingRequest.id },
      });
      return new NextResponse("Friend request canceled", { status: 200 })

    } else {
      // Eğer istek yoksa, yeni bir istek oluştur
      const newRequest = await prisma.friendRequest.create({
        data: {
          requesterId: currentUser.id, // İstek gönderen
          recipientId: recipientId,
        },
      });

      return new NextResponse(
        JSON.stringify({ message: "Friend request sent", newRequest }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error: any) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
