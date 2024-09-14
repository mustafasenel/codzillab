import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  const currentUser = await getCurrentUser();

  if (!username || typeof username !== "string") {
    return new NextResponse("Invalid Username", { status: 400 });
  }

  try {
    let existingUser;

    // Eğer currentUser mevcutsa ve kullanıcı adıyla eşleşmiyorsa
    if (currentUser?.username !== username) {
      existingUser = await prisma.user.findFirst({
        where: { username: username },
      });
    }

    // Kullanıcı adı mevcutsa ve currentUser'ın kullanıcı adıyla eşleşmiyorsa
    if (existingUser) {
      return NextResponse.json(
        { isAvailable: false, message: "Username is already taken" },
        { status: 200 }
      );
    }

    return NextResponse.json({ isAvailable: true }, { status: 200 });
  } catch (error) {
    console.error("Error checking username:", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
