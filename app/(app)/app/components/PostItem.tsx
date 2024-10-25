"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { tr } from "date-fns/locale";
import {
  ArrowDown,
  ChevronDown,
  ChevronDownIcon,
  Forward,
  Ghost,
  Heart,
  Medal,
  MessageSquareText,
  Pen,
  Pin,
  Send,
  ThumbsUp,
  Trash2,
  TriangleAlert,
  TriangleAlertIcon,
  UserIcon,
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
import { getInitials } from '@/utils/getInitials'; // Fonksiyonu uygun yoldan import edin

interface PostItemProps {
  post: FullPostType;
  currentUser: User;
  ref: any;
}

const PostItem: React.FC<PostItemProps> = ({ post, currentUser, ref }) => {
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

  const deleteMutation = useMutation({
    mutationFn: async () => {
        const response = await axios.post(`/api/post/delete`, { postId: post.id });
        return response.data;
    },
    onMutate: async () => { 
        await queryClient.cancelQueries({ queryKey: ["posts"] }); 
        
        const prevPostsData = queryClient.getQueryData<{ pages: FullPostType[][] }>(["posts"]);

        if (!prevPostsData) {
            return; 
        }

        // Silinecek postu filtrele
        const newPagesData = prevPostsData.pages.map(page => 
            page.filter(postItem => postItem.id !== post.id)
        );

        // Yeni veriyi ayarla, yapıyı koruyarak
        queryClient.setQueryData(["posts"], { 
            ...prevPostsData, // Önceki verinin diğer alanlarını kopyala
            pages: newPagesData // Sadece pages alanını güncelle
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

            <AvatarFallback>{getInitials(post.user?.name || post.organization?.name)}</AvatarFallback>
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
            {post.user?.id === currentUser.id ? (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <Pen className="h-4 w-4" />
                    <span>Postu Düzenle</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={handleDeletePost}>
                    <Trash2 className="h-4 w-4" />
                    <span>Postu Sil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <MessageSquareText className="h-4 w-4" />
                    <span>Yorumları Kapat</span>
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
                  <TriangleAlertIcon className="h-4 w-4"/>
                  <span>Postu bildir</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CardContent className="flex flex-col space-y-4 p-0 pb-4">
        <p className="px-4 text-sm">{post.content}</p>
        <div
          className={`grid gap-2 ${
            post.attachments?.length === 1
              ? "grid-cols-1"
              : post.attachments?.length === 2
              ? "grid-cols-2"
              : "grid-cols-4"
          }`}
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
        <div className="flex gap-4 items-center px-6">
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
          <div className="flex items-center gap-2">
            <button type="button">
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div
          className={cn(
            isCommentSectionOpen ? "flex-col space-y-4 pt-4" : "hidden"
          )}
        >
          <PostCommentList postId={post.id} postUserId={post.userId!} currentUser={currentUser} />
          <PostComment post={post} currentUser={currentUser} />
        </div>
      </CardContent>
    </Card>
  );
};

export default PostItem;
