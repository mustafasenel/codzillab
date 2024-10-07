import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

// Uygulamanızdaki mevcut rotaları listeleyin
const blockedUsernames = ["app", "settings", "admin", "auth", "authentication"]; // Bu listeye tüm yolları ekleyin

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  const currentUser = await getCurrentUser();

  if (!username || typeof username !== "string") {
    return new NextResponse("Invalid Username", { status: 400 });
  }

  // Kullanıcı adının mevcut yollarla çakışıp çakışmadığını kontrol et
  if (blockedUsernames.includes(username)) {
    return NextResponse.json(
      { isAvailable: false, message: "Username conflicts with a reserved route" },
      { status: 200 }
    );
  }

  try {
    let existingUser;

    if (currentUser?.username !== username) {
      existingUser = await prisma.user.findFirst({
        where: { username: username },
      });
    }

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
