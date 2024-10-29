import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("gameId");
    const platformId = searchParams.get("platformId");
    const skip = parseInt(searchParams.get("skip") || "0", 10);
    const take = parseInt(searchParams.get("take") || "8", 10);

    const currentUser = await getCurrentUser();
    if (!currentUser?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Construct the where clause based on the provided filters
    const whereClause = {
      ...(gameId && { gameId }),
      ...(platformId && {
        game: {
          platform: {
            has: platformId,
          },
        },
      }),
    };

    // Fetch game bodies with the constructed where clause
    const gameBodies = await prisma.gameBody.findMany({
      where: whereClause,
      include: {
        user: true,
        game: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take,
    });

    // Count the total number of game bodies matching the filters
    const totalGameBodies = await prisma.gameBody.count({
      where: whereClause,
    });

    // Return the response with pagination info
    return NextResponse.json({
      gameBodies,
      total: totalGameBodies,
      page: Math.floor(skip / take) + 1,
      totalPages: Math.ceil(totalGameBodies / take),
    });
  } catch (error: any) {
    console.error("GAME FETCH ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
