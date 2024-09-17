import prisma from "@/lib/prismadb"
import { FullGameBodyType } from "@/types"
import getCurrentUser from "./getCurrentUser"

const getGameBodyByUserId = async (
    userId: string | undefined,
  ): Promise<FullGameBodyType[] | null> => {

    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return []

        let userGameBodyAdvert
        
        if(userId) {

            userGameBodyAdvert = await prisma.gameBody.findMany({
                where: {
                    userId: userId,
                },
                include: {
                    game: true,
                    user: true
                }
            })
        } else {
            return []
        }

        return userGameBodyAdvert as FullGameBodyType[]

    } catch (error: any) {
        return []
    }
  } 

export default getGameBodyByUserId