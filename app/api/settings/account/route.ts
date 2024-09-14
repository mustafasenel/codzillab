import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { day, month, year, country } = body;

    const dob = new Date(
      `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
    );

    if (!currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: currentUser.id
        },
        data : {
          dob,
          country
        }
    })

    const responseBody = JSON.stringify({updatedUser: updatedUser})

    return new NextResponse(responseBody, {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            },
    })
  } catch (error: any) {
    return new NextResponse("internal error", { status: 500 });
  }
}
