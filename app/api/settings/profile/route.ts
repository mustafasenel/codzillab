import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { username, email, name, surname, bio, links } = body;

    console.log(links)

    if (!currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const filteredLinks = Array.isArray(links)
      ? links
          .map((link: { value: string }) => link.value?.trim())
          .filter((url: string) => (url !== "" && url!=undefined))
      : [];

    console.log(filteredLinks)
    const updatedUser = await prisma.user.update({
        where: {
            id: currentUser.id
        },
        data : {
            username,
            name,
            surname,
            email,
            bio,
            links : filteredLinks
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
