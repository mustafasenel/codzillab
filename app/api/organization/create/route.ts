import getCurrentUser from '@/actions/getCurrentUser';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();
        const { name, description, logo, contactEmail, links } = body;

        if (!currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!name || !description) {
            return new NextResponse('Missing info', { status: 400 });
        }
        
        const filteredLinks = Array.isArray(links)
        ? links
            .map((link: { value: string }) => link.value?.trim())
            .filter((url: string) => (url !== "" && url!=undefined))
        : [];

         const  organization = await prisma.organization.create({
                data: {
                    name,
                    description,
                    logo,
                    contactEmail,
                    socialLinks: filteredLinks,
                    owner: {
                        connect: { 
                            id: currentUser.id 
                        }
                    }
 
                }
            });
        
        return NextResponse.json(organization);

    } catch (error: any) {
        console.log(error, 'GAME ERROR');
        return new NextResponse('Internal error', { status: 500 });
    }
}
