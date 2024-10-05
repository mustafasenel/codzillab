import prisma from "@/lib/prismadb";
import { FullOrganizationType } from "@/types";

const getOrganizations = async (): Promise<FullOrganizationType[] | []> => {
  try {
    const organizations = await prisma.organization.findMany({
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

export default getOrganizations;
