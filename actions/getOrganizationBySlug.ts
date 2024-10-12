import prisma from "@/lib/prismadb";
import { FullOrganizationType } from "@/types";

const getOrganizationBySlug = async (slug: string): Promise<FullOrganizationType | null> => {
  try {
    console.log("Fetching organization with slug:", slug); // Slug değerini kontrol et

    const organization = await prisma.organization.findUnique({
      where: { 
        slug: slug
      },
      include: {
        followers: true,
        members: true
      },
    });

    if (!organization) {
      console.log("Organization not found for slug:", slug); // Eğer organizasyon bulunamazsa
      return null;
    }

    return organization as FullOrganizationType;
  } catch (error: any) {
    console.error("Error fetching organization:", error); // Hata durumunu yazdır
    return null;
  }
};

export default getOrganizationBySlug;
