import getCurrentUser from '@/actions/getCurrentUser';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();
        const { id, title, game, description, type, image } = body;

        if (!currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!title || !game || !description || !type) {
            return new NextResponse('Missing info', { status: 400 });
        }

        let gameBody;

        if (id) {
            gameBody = await prisma.gameBody.update({
                where: { id },
                data: {
                    title,
                    type,
                    description,
                    image,
                }
            });
        } else {
            gameBody = await prisma.gameBody.create({
                data: {
                    title,
                    type,
                    description,
                    image,
                    game: {
                        connect:{
                            name: game
                        }
                    },
                    user: {
                        connect: {
                            id: currentUser.id
                        }
                    }   
                }
            });
        }

        return NextResponse.json(game);
    } catch (error: any) {
        console.log(error, 'GAME ERROR');
        return new NextResponse('Internal error', { status: 500 });
    }
}
