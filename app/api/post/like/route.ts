import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/actions/getCurrentUser";

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();
  const { postId } = await req.json();

  if (!currentUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!postId) {
    return new NextResponse("Post ID is required", { status: 400 });
  }

  try {
    // Beğeniyi kontrol et, eğer zaten beğenildiyse kaldır
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: currentUser.id,
        postId: postId,
      },
    });

    if (existingLike) {
      // Eğer beğeni varsa, beğeniyi kaldır
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      // Postun beğeni sayısını azalt
      await prisma.post.update({
        where: { id: postId },
        data: {
          likesCount: {
            decrement: 1,
          },
        },
      });

      return NextResponse.json({ message: "Like removed" });
    } else {
      // Beğeni yoksa, yeni bir beğeni ekle
      await prisma.like.create({
        data: {
          userId: currentUser.id,
          postId: postId,
        }
      });

      // Postun beğeni sayısını artır
      await prisma.post.update({
        where: { id: postId },
        data: {
          likesCount: {
            increment: 1,
          },
        },
      });

      return NextResponse.json({ message: "Post liked" });
    }
  } catch (error) {
    console.error("Error liking post:", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
