import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function DELETE(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return new NextResponse("ID is required", { status: 400 });
    }

    // İş deneyimini veritabanından silme işlemi
    await prisma.education.delete({
      where: { id: id },
    });

    return new NextResponse("Deleted successfully", { status: 200 });

  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
