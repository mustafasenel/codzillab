"use client";

import { FullCommentType } from "@/types";
import { User } from "@prisma/client";
import {
  QueryFunctionContext,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import PostCommentItem from "./PostCommentItem";

const fetchComments = async ({
  queryKey,
  pageParam = 0,
}: QueryFunctionContext): Promise<FullCommentType[]> => {
  const postId = queryKey[1] as string; // Extract postId from the queryKey
  const take = 3; // Number of comments to fetch

  const response = await fetch(
    `/api/post/comment/getComments?postId=${postId}&skip=${pageParam}&take=${take}`
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();

  if (!Array.isArray(data.comments)) {
    console.error("comments is not an array:", data.comments);
    return []; // Return an empty array if comments are invalid
  }

  return data.comments; // Return the comments array
};

const PostCommentList: React.FC<{
  postId: string;
  currentUser: User;
  postUserId: string;
}> = ({ postId, currentUser, postUserId }) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<FullCommentType[], Error>({
    queryKey: ["comments", postId],
    queryFn: fetchComments,
    getNextPageParam: (lastPage, allPages) => {
      // Eğer son sayfa alınan veri sayısı 'take' değerine eşitse, daha fazla sayfa var demektir
      const totalCommentsFetched = allPages.reduce(
        (acc, page) => acc + page.length,
        0
      );
      return lastPage.length === 3 ? totalCommentsFetched : undefined;
    },
    initialPageParam: 0,
  });

  const queryClient = useQueryClient();

  // Comment silme işlemi için mutation
  const { mutate: deleteComment } = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await fetch(`/api/post/comment/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId }),
      });

      if (!response.ok) {
        throw new Error("Yorum silinemedi");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] }); // Silme işlemi sonrası yorumları yenile
    },
    onError: (error) => {
      console.error("Yorum silinirken hata:", error);
    },
  });

  // Yükleniyor durumu
  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  // Hata durumu
  if (error) {
    return <div>Yorumları yüklerken bir hata oluştu: {error.message}</div>;
  }

  return (
    <div className="w-full flex flex-col space-y-4">
      {data?.pages.flatMap((group) => group).length === 0 ? (
        <div className="text-center text-xs text-muted-foreground">Yorum bulunamadı</div>
      ) : (
        data?.pages.flatMap((group) =>
          group.map((comment: FullCommentType) => (
            <PostCommentItem
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              postUserId={postUserId}
              onDelete={() => deleteComment(comment.id)}
            />
          ))
        )
      )}
      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} variant="link">
          Daha Fazla yorum yükle
        </Button>
      )}
      {isFetchingNextPage && !hasNextPage ? <div>Yükleniyor...</div> : null}
    </div>
  );
};

export default PostCommentList;
