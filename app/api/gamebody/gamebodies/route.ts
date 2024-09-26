import getCurrentUser from '@/actions/getCurrentUser';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const gameId = searchParams.get('gameId');

        const currentUser = await getCurrentUser();
        if (!currentUser?.email) {
            return new Response('Unauthorized', { status: 401 });
        }

        let gameBodies;

        if (gameId) {
            gameBodies = await prisma.gameBody.findMany({
                where: {
                    gameId: gameId
                },
                include: {
                    user: true, // İlişkili kullanıcıyı getir
                    game: true, // İlişkili oyunu getir
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } else {
            gameBodies = await prisma.gameBody.findMany({
                include: {
                    user: true,
                    game: true,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }
        // Eğer oyun verisi yoksa boş bir liste dön
        return NextResponse.json(gameBodies || []);

    } catch (error: any) {
        console.error(error, 'GAME FETCH ERROR');
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
