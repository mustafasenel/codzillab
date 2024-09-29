import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { id, name, slug, description, contactEmail, contactPhone, location, links } = body;

    if (!currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name || !description) {
      return new NextResponse("Missing info", { status: 400 });
    }

    const existingOrganization = await prisma.organization.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingOrganization) {
      return new NextResponse("Organizasyon bulunamadı", { status: 400 });
    }
    const filteredLinks = Array.isArray(links)
      ? links
          .map((link: { value: string }) => link.value?.trim())
          .filter((url: string) => url !== "" && url != undefined)
      : [];


    const organization = await prisma.organization.update({
      where: {
        id: existingOrganization.id
      },
      data: {
        name,
        slug,
        description,
        contactEmail,
        contactPhone,
        location,
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
    return new NextResponse("Internal error", { status: 500 });
  }
}
