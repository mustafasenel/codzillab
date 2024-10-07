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

  const friendRequest = await prisma.organizationFollower.findFirst({
    where: {
        organizationId: recipientId,
        userId: currentUser.id
    },
  });

  return NextResponse.json({
    hasRequest: !!friendRequest, // Eğer istek varsa true döner
  });
}
