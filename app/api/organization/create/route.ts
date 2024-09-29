import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "") // Remove punctuation
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with a single hyphen
}

async function createUniqueSlug(baseSlug: string) {
  let slug = baseSlug;
  let count = 1;

  while (await prisma.organization.findUnique({ where: { slug } })) {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit number
    slug = `${baseSlug}-${randomSuffix}`;
    count++;
  }

  return slug;
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { name, description, logo, contactEmail, links } = body;

    if (!currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name || !description) {
      return new NextResponse("Missing info", { status: 400 });
    }

    const existingOrganization = await prisma.organization.findUnique({
      where: {
        name: name,
      },
    });

    if (existingOrganization) {
      return NextResponse.json(
        { message: "Organizasyon adı kullanılıyor" },
        { status: 400 }
      );
    }

    const filteredLinks = Array.isArray(links)
      ? links
          .map((link: { value: string }) => link.value?.trim())
          .filter((url: string) => url !== "" && url != undefined)
      : [];

    const baseSlug = generateSlug(name); // Generate base slug
    const slug = await createUniqueSlug(baseSlug); // Create unique slug

    const organization = await prisma.organization.create({
      data: {
        name,
        slug,
        description,
        logo,
        contactEmail,
        socialLinks: filteredLinks,
        owner: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    return NextResponse.json(organization);
  } catch (error: any) {
    console.log(error, "GAME ERROR");
    return new NextResponse("Internal error", { status: 500 });
  }
}
