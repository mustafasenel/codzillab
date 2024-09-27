import getCurrentUser from '@/actions/getCurrentUser';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();
        const { id, name, genre, platform, image } = body;

        if (!currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!Array.isArray(genre) || genre.length === 0) {
            return new NextResponse('Genre must be a non-empty array', { status: 400 });
        }
        if (!Array.isArray(platform) || platform.length === 0) {
            return new NextResponse('platform must be a non-empty array', { status: 400 });
        }


        let game;

        if (id) {
            // If an id is provided, update the existing game
            game = await prisma.game.update({
                where: { id },
                data: {
                    name,
                    genre,
                    platform,
                    image
                }
            });
        } else {
            // If no id is provided, create a new game
            game = await prisma.game.create({
                data: {
                    name,
                    genre,
                    platform,
                    image
                }
            });
        }

        return NextResponse.json(game);
    } catch (error: any) {
        console.log(error, 'GAME ERROR');
        return new NextResponse('Internal error', { status: 500 });
    }
}
