import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb"; 

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            orderBy:{
                createdAt: 'desc'
            },
            include: {
                attachments: true,
                user: true,
                organization: true,
            },
            
        });
        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.error();
    }
}
