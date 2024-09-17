import bcrypt from 'bcrypt'

import prisma from '@/lib/prismadb'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, name, surname, password, username } = body;

        if (!email || !name  || !password || !username) {
            return new NextResponse('Missing info', {status: 400});
        }

        const existingEmail = await prisma.user.findUnique({
            where: { email }
        })

        if(existingEmail) {
            return new NextResponse('Email kullanılıyor', {status: 400});
        }
        
        const existingUsername = await prisma.user.findFirst({
            where: {
                username: username
            }
        })

        if (existingUsername) {
            return new NextResponse("Username already taken", {status: 409})
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await prisma.user.create({
            data: {
                email,
                name,
                surname,
                hashedPassword,
                username
            }
        })

        return NextResponse.json(user)
    } catch (error: any) {
        console.log(error, 'REGISTRATION ERROR')
        return new NextResponse('Internal error', { status: 500 })
    }
}