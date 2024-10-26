"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { FullPostType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/getInitials";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { MessageSquareTextIcon, Send } from "lucide-react";
import PostCommentList from "./PostCommentList";
import PostComment from "./PostComment";
import { User } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  format,
  formatDistanceToNow,
  isWithinInterval,
  subWeeks,
} from "date-fns";
import { tr } from "date-fns/locale";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface PostItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: FullPostType;
  currentUser: User;
}

const PostItemModal: React.FC<PostItemModalProps> = ({
  isOpen,
  onClose,
  post,
  currentUser,
}) => {
  const [displayDate, setDisplayDate] = useState<string>("");
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);

  const [likeCount, setLikeCount] = useState<number>(post.likesCount);
  const queryClient = useQueryClient();

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (post.likes && Array.isArray(post.likes)) {
      const isLikedByUser = post.likes.some(
        (like) => like.userId === currentUser.id
      );
      setIsLiked(isLikedByUser);
    } else {
      setIsLiked(false);
    }
  }, [post.likes, currentUser.id, post.id]);

  useEffect(() => {
    const oneWeekAgo = subWeeks(new Date(), 1);
    const isRecent = isWithinInterval(post.createdAt, {
      start: oneWeekAgo,
      end: new Date(),
    });

    let relativeTime = formatDistanceToNow(post.createdAt, {
      addSuffix: true,
      locale: tr, // Türkçe lokalizasyon kullanımı
    });
    relativeTime = relativeTime
      .replace("minutes", "dk")
      .replace("hours", "sa")
      .replace("seconds", "sn");

    setDisplayDate(
      isRecent ? relativeTime : format(post.createdAt, "d MMMM", { locale: tr })
    );
  }, [post.createdAt]);

  // Like fonksiyonu için useMutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`/api/post/like`, { postId: post.id });
      return response.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["posts"] }); // Tüm postlar için sorguları durdur

      // pages dizisini düz bir dizi haline getir
      const prevPostsData = queryClient.getQueryData(["posts"]) as {
        pages: FullPostType[][];
      };
      const allPosts = prevPostsData?.pages.flat() || []; // Düzleştirilmiş post dizisi

      const prevPostData = allPosts.find((p) => p.id === post.id); // ID ile postu bul

      if (!prevPostData) {
        console.warn("Önceki veri bulunamadı, beğeni sayısı güncellenemedi");
        return;
      }

      const prevLikeCount = prevPostData.likesCount;

      // Beğeni durumu değişikliği
      setLikeCount(isLiked ? prevLikeCount - 1 : prevLikeCount + 1);
      setIsLiked(!isLiked);

      return { prevLikeCount };
    },
    onSuccess: () => {
      // Başarılı olduğunda ilgili postun sorgusunu yenile
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error, variables, context) => {
      if (context) {
        setLikeCount(context.prevLikeCount);
      }
      console.error("Beğeni eklenirken hata:", error);
    },
  });

  const handleLikeClick = () => {
    likeMutation.mutate(); // Beğeni fonksiyonunu tetikle
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl p-0 h-[700px] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-3 relative flex items-center justify-center bg-zinc-800 rounded-l-md overflow-hidden p-0">
            <Carousel className="w-full h-full flex items-center justify-center p-0">
              <CarouselContent className="h-full flex items-center">
                {post.attachments?.map((attachment, index) => (
                  <CarouselItem
                    key={index}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <Image
                        src={attachment.url}
                        alt={`Attachment ${index + 1}`}
                        objectFit="contain" // Resmin orantılı olarak yerleştirilmesini sağlar
                        className="h-fit w-fit bg-contain" // Resmin modalın boyutuna göre ayarlanmasını sağlar
                        width={500}
                        height={500}
                        unoptimized
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {!!post.attachments?.length && post.attachments.length > 1 && (
                <>
                  <CarouselPrevious className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10" />
                  <CarouselNext className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10" />
                </>
              )}
            </Carousel>
          </div>
          <div className="md:col-span-2 py-4 max-h-[700px] overflow-y-auto">
            <div className="flex flex-col space-y-4">
              <div

                className="flex items-center space-x-4"
              >
                <Avatar>
                  <AvatarImage
                    src={
                      post.user?.image ||
                      post.organization?.logo ||
                      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E"
                    }
                    height={15}
                    width={15}
                  />

                  <AvatarFallback>
                    {getInitials(post.user?.name || post.organization?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-between py-1">
                  <div className="flex gap-2 items-center">
                    <span className="text-sm font-semibold flex items-center">
                      {post.user
                        ? `${post.user.name} ${post.user.surname}`
                        : post?.organization?.name}
                    </span>
                    <p className="text-xs text-muted-foreground">·</p>
                    <p className="text-xs text-muted-foreground">
                      {displayDate}
                    </p>
                  </div>

                  {post.user && (
                    <span className="text-xs font-light">
                      @{post.user.username}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm">{post.content}</p>
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLikeClick}
                    className="outline-none"
                  >
                    {isLiked ? (
                      <FaThumbsUp className={cn("h-5 w-5")} />
                    ) : (
                      <FaRegThumbsUp className={cn("h-5 w-5")} />
                    )}
                  </button>
                  <p className="text-sm text-muted-foreground">{likeCount}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setIsCommentSectionOpen(!isCommentSectionOpen)
                    }
                  >
                    <MessageSquareTextIcon className="h-5 w-5" />
                  </button>
                  <p className="text-sm text-muted-foreground">
                    {post.CommentsCount}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button">
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="flex-col space-y-4 pt-4 pr-4">
                <PostComment post={post} currentUser={currentUser} />
                <PostCommentList
                  postId={post.id}
                  postUserId={post.userId!}
                  currentUser={currentUser}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostItemModal;
