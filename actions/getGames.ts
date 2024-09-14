import { FullUserType } from "@/types";
import prisma from "@/lib/prismadb";

const getGames = async () => {

    try {
        const games = await prisma.game.findMany({

        })

        if (!games) {
            return []
        }
        return games
    } catch (error: any) {
        return []
    }
}

export default getGames;