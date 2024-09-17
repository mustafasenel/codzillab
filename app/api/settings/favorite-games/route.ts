import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { genres, platforms, games } = body;

    if (!currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        genres,
        platforms,
        UserGames: {
          create: await Promise.all(
            games.map(async (gameName: string) => {
              // Game tablosunda oyunu bul
              const game = await prisma.game.findUnique({
                where: { name: gameName },
              });

              if (!game) {
                throw new Error(`Game ${gameName} not found`);
              }
              return {
                game: {
                  connect: {
                    id: game.id,
                  },
                },
              };
            })
          ),
        },
      },
    });

    const responseBody = JSON.stringify({ updatedUser });

    return new NextResponse(responseBody, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Error adding games:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
