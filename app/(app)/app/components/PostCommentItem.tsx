"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FullCommentType } from "@/types";
import { User } from "@prisma/client";
import { ChevronDown, ChevronDownIcon, Pen, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  format,
  formatDistanceToNow,
  isWithinInterval,
  subWeeks,
} from "date-fns";
import { tr } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostCommentItemProps {
  comment: FullCommentType;
  currentUser: User;
  postUserId: string;
  onDelete: (commentId: string) => void; 
}

const PostCommentItem: React.FC<PostCommentItemProps> = ({
  comment,
  currentUser,
  postUserId,
  onDelete,
}) => {
  const [displayDate, setDisplayDate] = useState<string>("");

  useEffect(() => {
    const oneWeekAgo = subWeeks(new Date(), 1);
    const isRecent = isWithinInterval(comment.createdAt, {
      start: oneWeekAgo,
      end: new Date(),
    });

    let relativeTime = formatDistanceToNow(comment.createdAt, {
      addSuffix: true,
      locale: tr, // Türkçe lokalizasyon kullanımı
    });
    relativeTime = relativeTime
      .replace("minutes", "dk")
      .replace("hours", "sa")
      .replace("seconds", "sn");

    setDisplayDate(
      isRecent
        ? relativeTime
        : format(comment.createdAt, "d MMMM", { locale: tr })
    );
  }, [comment.createdAt]);

  return (
    <div className="flex flex-col space-y-2">
      <div className="w-full flex items-center justify-between">
        <Link
          href={`/${comment.user?.username}`}
          className="flex items-center space-x-4"
        >
          <Avatar>
            <AvatarImage
              src={
                comment.user?.image ||
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
                {comment.user?.name} {comment.user?.surname}
              </span>
              <p className="text-xs text-muted-foreground">·</p>
              <p className="text-xs text-muted-foreground">{displayDate}</p>
            </div>

            {comment.user && (
              <span className="text-xs font-light">
                @{comment.user.username}
              </span>
            )}
          </div>
        </Link>
        {(comment.user?.id === currentUser.id ||
          postUserId === currentUser.id) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <ChevronDownIcon className="w-4 h-4"/>
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              {comment.user?.id === currentUser.id ? (
                // Yorum sahibi: Düzenle ve Sil seçenekleri
                <DropdownMenuGroup>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <Pen className="h-4 w-4" />
                    <span>Yorumu Düzenle</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => onDelete(comment.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span>Yorumu Sil</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              ) : (
                // Yalnızca gönderi sahibi: Sil seçeneği
                <DropdownMenuGroup>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => onDelete(comment.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span>Yorumu Sil</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <p className="text-sm pl-14">{comment.content}</p>
    </div>
  );
};

export default PostCommentItem;
