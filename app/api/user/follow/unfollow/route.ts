import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  const { recipientId } = await request.json(); // İstek ID'si frontend'den gelir

  if (!currentUser?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {

    const isFollowing = await prisma.follower.findFirst({
      where:{
        followerId: currentUser.id,
        followingId: recipientId
      }
    });

    if (isFollowing) {
      await prisma.follower.delete({
        where:{
          id: isFollowing.id
        }
      });
    }

    return NextResponse.json({
      message: "Request accepted and follower relationship created",
    });
  } catch (error) {
    console.error("İstek kabul edilirken hata oluştu:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
