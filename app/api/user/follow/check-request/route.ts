// /api/user/check-request.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  const { recipientId } = await request.json();

  if (!currentUser?.id) {
    return NextResponse.json({ hasRequest: false }, { status: 401 });
  }

  // Mevcut kullanıcı tarafından bir istek gönderilmiş mi kontrol et
  const friendRequest = await prisma.friendRequest.findFirst({
    where: {
      requesterId: currentUser.id,
      recipientId: recipientId,
    },
  });

  return NextResponse.json({
    hasRequest: !!friendRequest, // Eğer istek varsa true döner
  });
}
