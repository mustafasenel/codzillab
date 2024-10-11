import prisma from "@/lib/prismadb";
import { FullPostType } from "@/types";

const getPosts = async (): Promise<FullPostType[] | []> => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true,
        organization: true
      },
    });

    if (!posts) {
      return [];
    }
    console.log(posts)
    return posts as FullPostType[];
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

export default getPosts;
