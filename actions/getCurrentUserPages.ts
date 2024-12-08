import prisma from "@/lib/prismadb";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const getCurrentUserPages = async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        const session = await getServerSession(req, res, authOptions);
        if (!session?.user?.email) {
            return null
        }

        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string
            },
          
        })

        if (!currentUser) {
            return null
        }
        return currentUser
    } catch (error: any) {
        return null
    }
}

export default getCurrentUserPages;