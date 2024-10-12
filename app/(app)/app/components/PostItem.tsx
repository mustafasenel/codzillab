"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FullPostType } from "@/types";
import { User } from "@prisma/client";
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
  Forward,
  Ghost,
  MessageSquareText,
  Send,
  ThumbsUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface PostItemProps {
  post: FullPostType;
  currentUser: User;
  ref: any
}

const PostItem: React.FC<PostItemProps> = ({ post, currentUser, ref }) => {
  const [displayDate, setDisplayDate] = useState<string>("");
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
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

  return (
    <Card>
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

            <AvatarFallback>CN</AvatarFallback>
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
        <ChevronDown />
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
            <button type="button">
              <ThumbsUp className="h-5 w-5" />
            </button>
            <p className="text-sm text-muted-foreground">1B</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setIsCommentSectionOpen(!isCommentSectionOpen)}>
              <MessageSquareText className="h-5 w-5" />
            </button>
            <p className="text-sm text-muted-foreground">23</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button">
              <Forward className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className={cn("gap-4 px-4",isCommentSectionOpen ? "flex" : "hidden")}>
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
                  currentUser?.image ||
                  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E"
                }
              />

              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <Input placeholder="Yorum yapın" />
          <Button>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostItem;
