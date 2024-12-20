import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

// Uygulamanızdaki mevcut rotaları listeleyin
const blockedUsernames = ["app", "settings", "admin", "auth", "authentication"]; // Bu listeye tüm yolları ekleyin

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  const currentValue = searchParams.get("currentValue");

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
    let existingOrganization;

    // Kullanıcı adı kontrolü
    // currentValue ile username eşleşmiyorsa kontrol et
    if (username !== currentValue) {
      existingUser = await prisma.user.findFirst({
        where: { username: username },
      });
    }

    // Organizasyon slug kontrolü
    // currentValue ile username eşleşmiyorsa kontrol et
    if (username !== currentValue) {
      existingOrganization = await prisma.organization.findFirst({
        where: { slug: username }, // Slug kontrolü için aynı username kullanıldı
      });
    }

    // Kullanıcı adı kontrolü
    if (existingUser) {
      return NextResponse.json(
        { isAvailable: false, message: "Username is already taken" },
        { status: 200 }
      );
    }

    // Organizasyon slug kontrolü
    if (existingOrganization) {
      return NextResponse.json(
        { isAvailable: false, message: "Organization slug is already taken" },
        { status: 200 }
      );
    }

    // Kullanıcı adı ve organizasyon slug'ı mevcut değilse
    return NextResponse.json({ isAvailable: true }, { status: 200 });
  } catch (error) {
    console.error("Error checking username or organization slug:", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
