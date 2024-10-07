import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  const { recipientId } = await request.json(); // İstek ID'si frontend'den gelir

  if (!currentUser?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const existingFollower = await prisma.organizationFollower.findFirst({
    where:{
      userId: currentUser.id,
      organizationId: recipientId
    }
  })

  try {
    if (!existingFollower) {
      await prisma.organizationFollower.create({
        data: {
          userId: currentUser.id,
          organizationId: recipientId
        },
      });
    } else {
      await prisma.organizationFollower.delete({
        where: {
          id: existingFollower.id
        },
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
