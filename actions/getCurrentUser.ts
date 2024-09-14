import { FullUserType } from "@/types";
import getSession from "./getSession";
import prisma from "@/lib/prismadb";

const getCurrentUser = async ():Promise<FullUserType|null> => {

    try {
        const session = await getSession();
        if (!session?.user?.email) {
            return null
        }

        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string
            },
            include:{
                account: true,
                followers: true,
                followings: true
            }
        })

        if (!currentUser) {
            return null
        }
        return currentUser as FullUserType
    } catch (error: any) {
        return null
    }
}

export default getCurrentUser;