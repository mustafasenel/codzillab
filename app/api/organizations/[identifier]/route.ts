// app/api/organizations/[slug]/route.ts
import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb"; 
import { FullOrganizationType } from "@/types";

export async function GET(request: Request, { params }: { params: { identifier: string } }) { 
  const currentUser = await getCurrentUser(); // Kullanıcı bilgilerini al

  try {
    const organization = await prisma.organization.findUnique({
      where: { 
        slug: params.identifier // Slug değerine göre organizasyonu bul
      },
      include: {
        followers: true,
        members: true
      },
    });

    if (!organization) {
      console.log("Organization not found for slug:", params.identifier); // Eğer organizasyon bulunamazsa
      return NextResponse.json({ error: "Organization not found" }, { status: 404 }); // 404 hatası döndür
    }

    return NextResponse.json(organization as FullOrganizationType); // Başarılı bir şekilde organizasyonu döndür
  } catch (error: any) {
    console.error("Error fetching organization:", error); // Hata durumunu yazdır
    return NextResponse.json({ error: "Internal server error" }, { status: 500 }); // Sunucu hatası döndür
  }
}
