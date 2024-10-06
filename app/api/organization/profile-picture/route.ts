import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.username) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await request.json();
    const updatedCover = await prisma.organization.update({
      where: {
        id: body.id,
      },
      data: {
        logo: body.data,
      },
    });

    return new NextResponse(JSON.stringify(updatedCover), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    return new NextResponse("Internal error", { status : 500 });
  }
}
