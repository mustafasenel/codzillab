import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb"; 

// API Uç Noktası: /api/post/check-like
export async function POST(req: Request) {
    const currentUser = await getCurrentUser();
    const { postId } = await req.json();
  
    if (!currentUser || !postId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  
    try {
      const existingLike = await prisma.like.findFirst({
        where: {
          userId: currentUser.id,
          postId: postId,
        },
      });
  
      return NextResponse.json({ liked: !!existingLike }); // Eğer beğeni varsa true, yoksa false döndür
    } catch (error) {
      console.error("Error checking like status:", error);
      return new NextResponse("Something went wrong", { status: 500 });
    }
  }
  