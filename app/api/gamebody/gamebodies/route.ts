import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("gameId");
    const platformId = searchParams.get("platformId");

    const currentUser = await getCurrentUser();
    if (!currentUser?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    let gameBodies;

    if (gameId && platformId) {
      // Both gameId and platformId provided
      gameBodies = await prisma.gameBody.findMany({
        where: {
          gameId: gameId,
          game: {
            platform: {
              has: platformId,
            },
          },
        },
        include: {
          user: true,
          game: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else if (gameId) {
      // Only gameId provided
      gameBodies = await prisma.gameBody.findMany({
        where: {
          gameId: gameId,
        },
        include: {
          user: true,
          game: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else if (platformId) {
      // Only platformId provided
      console.log("PLATFORM ADDDED")
      gameBodies = await prisma.gameBody.findMany({
        where: {
          game: {
            platform: {
              has: platformId,
            },
          },
        },
        include: {
          user: true,
          game: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      // No filters applied
      gameBodies = await prisma.gameBody.findMany({
        include: {
          user: true,
          game: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }
    // Eğer oyun verisi yoksa boş bir liste dön
    return NextResponse.json(gameBodies || []);
  } catch (error: any) {
    console.error(error, "GAME FETCH ERROR");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
