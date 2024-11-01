"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FullPostType } from "@/types";
import { User } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  format,
  formatDistanceToNow,
  isWithinInterval,
  subWeeks,
} from "date-fns";
import { da, tr } from "date-fns/locale";
import {
  Calendar,
  CalendarClockIcon,
  ChevronDownIcon,
  MessageSquareText,
  Pen,
  Pin,
  Send,
  Trash2,
  TriangleAlertIcon,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import PostComment from "./PostComment";
import PostCommentList from "./PostCommentList";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/utils/getInitials"; // Fonksiyonu uygun yoldan import edin
import PostItemModal from "./PostItemModal";
import { formatText } from "@/utils/formatTag";
import { Badge } from "@/components/ui/badge";

interface PostItemProps {
  post: FullPostType;
  currentUser: User;
  ref: any;
}
export interface NotificationData {
  userId: string |null; // Bildirimi alan kullanıcının ID'si
  organizationId: string |null; // Bildirimi alan kullanıcının ID'si
  type: "LIKE" | "COMMENT" | "MENTION"; // Bildirim türleri
  postId?: string; // (isteğe bağlı) Post ile ilişkili ID
  commentId?: string; // (isteğe bağlı) Yorum ile ilişkili ID
}
const PostItem: React.FC<PostItemProps> = ({ post, currentUser, ref }) => {
  const [displayDate, setDisplayDate] = useState<string>("");
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);

  const [likeCount, setLikeCount] = useState<number>(post.likesCount);
  const queryClient = useQueryClient();

  const [isLiked, setIsLiked] = useState(false);
  const [eventDate, setEventDate] = useState("");

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
      // Define the keys you want to handle dynamically
      const queryKeys = ["posts", "userPosts"];

      // Cancel any outgoing refetches for both "posts" and "userPosts" to prevent race conditions
      await Promise.all(
        queryKeys.map((key) => queryClient.cancelQueries({ queryKey: [key] }))
      );

      // Store the previous like counts to revert if necessary
      const prevData = queryKeys.map((key) => {
        const data = queryClient.getQueryData<{ pages: FullPostType[][] }>([
          key,
        ]);
        if (!data) return null;

        // Flatten the pages and find the post by id
        const allPosts = data.pages.flat();
        const targetPost = allPosts.find((p) => p.id === post.id);

        if (targetPost) {
          const prevLikeCount = targetPost.likesCount;

          // Optimistically update the like count
          setLikeCount(isLiked ? prevLikeCount - 1 : prevLikeCount + 1);
          setIsLiked(!isLiked);

          return { key, prevLikeCount };
        }
        return null;
      });

      // Return context with previous data for rollback in case of error
      return { prevData };
    },
    onSuccess: () => {
      const notificationData: NotificationData = {
        userId: post.userId, // Beğeni alan kullanıcının ID'si
        organizationId: post.organizationId,
        type: "LIKE", // Bildirim tipi
        postId: post.id, // Post ID
      };

      if (currentUser.id != post.userId && isLiked == true) {
        notificationMutation.mutate(notificationData);
      }
      // Invalidate both queries to refetch fresh data
      ["posts", "userPosts"].forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
    },

    onError: (error, variables, context) => {
      if (context?.prevData) {
        // Revert like counts for both "posts" and "userPosts" if they exist in the context
        context.prevData.forEach((item) => {
          if (item) {
            setLikeCount(item.prevLikeCount);
          }
        });
      }
      console.error("Error while liking the post:", error);
    },
  });

  const handleLikeClick = () => {
    likeMutation.mutate(); // Beğeni fonksiyonunu tetikle
  };

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`/api/post/delete`, {
        postId: post.id,
      });
      return response.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const prevPostsData = queryClient.getQueryData<{
        pages: FullPostType[][];
      }>(["posts"]);

      if (!prevPostsData) {
        return;
      }

      // Silinecek postu filtrele
      const newPagesData = prevPostsData.pages.map((page) =>
        page.filter((postItem) => postItem.id !== post.id)
      );

      // Yeni veriyi ayarla, yapıyı koruyarak
      queryClient.setQueryData(["posts"], {
        ...prevPostsData, // Önceki verinin diğer alanlarını kopyala
        pages: newPagesData, // Sadece pages alanını güncelle
      });

      return { prevPostsData };
    },
    onError: (error, variables, context) => {
      if (context?.prevPostsData) {
        queryClient.setQueryData(["posts"], context.prevPostsData);
      }
      console.error("Post silinirken hata:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleDeletePost = () => {
    deleteMutation.mutate(); // Post silme fonksiyonunu tetikle
  };

  const updateCommentStatusMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.put(`/api/post/update/commentStatus`, {
        postId: post.id,
      });
      return response.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const prevPostsData = queryClient.getQueryData<{
        pages: FullPostType[][];
      }>(["posts"]);

      if (!prevPostsData) {
        return;
      }

      // Güncellenen postu filtrele
      const newPagesData = prevPostsData.pages.map((page) =>
        page.map((postItem) =>
          postItem.id === post.id ? { ...postItem, ...post } : postItem
        )
      );

      queryClient.setQueryData(["posts"], {
        ...prevPostsData, // Önceki verinin diğer alanlarını kopyala
        pages: newPagesData, // Sadece pages alanını güncelle
      });

      return { prevPostsData };
    },
    onError: (error, variables, context) => {
      if (context?.prevPostsData) {
        queryClient.setQueryData(["posts"], context.prevPostsData);
      }
      console.error("Post güncellenirken hata:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // Post güncelleme işlevi
  const handleCommentStatus = () => {
    updateCommentStatusMutation.mutate(); // Güncelleme fonksiyonunu tetikle
  };

  // Notification Mutation
  const notificationMutation = useMutation<
    NotificationData,
    Error,
    NotificationData
  >({
    mutationFn: async (notificationData: NotificationData) => {
      const response = await axios.post(
        `/api/notification/create`,
        notificationData
      );
      return response.data;
    },
  });

  useEffect(() => {
    if (post.type === "EVENT") {
      const formattedDate = format(
        new Date(post.eventDate!),
        "dd MMMM yyyy - HH.mm",
        { locale: tr }
      );
      setEventDate(formattedDate);
    }
  }, [post]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const handleOpenImageModal = () => {
    setIsImageModalOpen(true);
  };
  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
  };
  return (
    <Card className={cn(post.isPromoted && "border-[2px] border-[#FFA412]")}>
      {post.isPromoted && (
        <div className="h-8 p-0 bg-[#FFA412] rounded-t-md flex items-center ">
          <div className="px-4 text-sm flex gap-3 items-center text-white font-semibold">
            <Zap />
            <p>Sponsorlu</p>
          </div>
        </div>
      )}
      {post.type === "EVENT" && (
        <div className="h-8 p-0 bg-[#322eff] rounded-t-md flex items-center ">
          <div className="px-4 text-sm flex gap-3 items-center text-white font-semibold">
            <CalendarClockIcon />
            <p>Etkinlik</p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between p-4" ref={ref}>
        <Link
          href={
            post.user
              ? `/${post.user.username}`
              : `/${post?.organization?.slug}`
          }
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
              <p className="text-xs text-muted-foreground">{displayDate}</p>
            </div>

            {post.user && (
              <span className="text-xs font-light">@{post.user.username}</span>
            )}
          </div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            {post.user?.id === currentUser.id ||
            post.organization?.ownerId === currentUser.id ? (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <Pen className="h-4 w-4" />
                    <span>Postu Düzenle</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={handleDeletePost}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Postu Sil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={handleCommentStatus}
                  >
                    <MessageSquareText className="h-4 w-4" />
                    <span>
                      {post.commentStatus === "ACTIVE"
                        ? "Yorumları Kapat"
                        : "Yorumları Aç"}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <Pin className="h-4 w-4" />
                    <span>Postu Sabitle</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <Zap className="h-4 w-4" />
                    <span>Postu Öne Çıkar</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            ) : (
              <DropdownMenuGroup>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <TriangleAlertIcon className="h-4 w-4" />
                  <span>Postu bildir</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CardContent className="flex flex-col p-0 pb-4">
        <p className="px-4 text-sm"> {formatText(post.content)}</p>
        <div
          className={`relative grid gap-2 cursor-pointer pt-4 ${
            post.attachments?.length === 1
              ? "grid-cols-1"
              : post.attachments?.length === 2
              ? "grid-cols-2"
              : "grid-cols-4"
          }`}
          onClick={() => handleOpenImageModal()}
        >
          {post.attachments?.map((attachment, index) => (
            <div key={index} className="w-full">
              <Image
                src={attachment.url}
                alt={`Attachment ${index + 1}`}
                layout="responsive"
                width={500}
                height={300}
                className="object-cover max-h-96"
              />
            </div>
          ))}
        </div>
        {post.type === "EVENT" && (
          <div className="flex flex-col gap-3 px-4 bg-gradient-to-r from-slate-100 to-slate-300 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-700 ">
            <h1 className="text-xl font-semibold pt-4">{post.eventName}</h1>
            <div className="flex items-center space-x-4 pb-4">
              <Calendar />
              <span className="text-sm">{eventDate}</span>
            </div>
          </div>
        )}
        <div className="flex gap-4 items-center px-6 pt-4">
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleLikeClick}>
              {isLiked ? (
                <FaThumbsUp className={cn("h-5 w-5")} />
              ) : (
                <FaRegThumbsUp className={cn("h-5 w-5")} />
              )}
            </button>
            <p className="text-sm text-muted-foreground">{likeCount}</p>
          </div>
          {post.commentStatus === "ACTIVE" && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCommentSectionOpen(!isCommentSectionOpen)}
              >
                <MessageSquareText className="h-5 w-5" />
              </button>
              <p className="text-sm text-muted-foreground">
                {post.CommentsCount}
              </p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button type="button">
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
        {post.commentStatus === "ACTIVE" && (
          <div
            className={cn(
              isCommentSectionOpen ? "flex-col space-y-4 pt-4 px-4" : "hidden"
            )}
          >
            <PostCommentList
              postId={post.id}
              postUserId={post.userId!}
              currentUser={currentUser}
            />
            <PostComment post={post} currentUser={currentUser} />
          </div>
        )}
      </CardContent>
      <PostItemModal
        post={post}
        isOpen={isImageModalOpen}
        onClose={handleCloseImageModal}
        currentUser={currentUser}
      />
    </Card>
  );
};

export default PostItem;
