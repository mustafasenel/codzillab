import prisma from "@/lib/prismadb";
import { FullOrganizationType } from "@/types";

const getOrganizationBySlug = async (slug: string): Promise<FullOrganizationType | null> => {
  try {
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
      return null;
    }
    return organization as FullOrganizationType;
  } catch (error: any) {
    return null;
  }
};

export default getOrganizationBySlug;
