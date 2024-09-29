import prisma from "@/lib/prismadb";
import { FullOrganizationType } from "@/types";

const getOrganizationsByUserById = async (userId: string): Promise<FullOrganizationType[] | []> => {
  try {
    const organizations = await prisma.organization.findMany({
      where: { 
        ownerId: userId
      },
      include: {
        followers: true,
        members: true
      },
    });

    if (!organizations) {
      return [];
    }
    return organizations as FullOrganizationType[];
  } catch (error: any) {
    return [];
  }
};

export default getOrganizationsByUserById;
