"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppWindowIcon, LogOutIcon, User2Icon } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { MdLogout, MdPerson } from "react-icons/md";

interface UserAvatarProps {
  imageUrl: string | null;
  username: string;
}

const UserAvatar = ({ imageUrl, username }: UserAvatarProps) => {
  return (
    <DropdownMenu >
      <DropdownMenuTrigger className="outline-none">
        <Avatar>
          <AvatarImage
            src={
              imageUrl
                ? imageUrl
                : "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E"
            }
          />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link
              href={`/${username}`}
              className="flex items-center gap-2 cursor-pointer"
            >
              <User2Icon className="w-4 h-4"/>
              <span>Profilim</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href={`/app`}
              className="flex items-center gap-2 cursor-pointer"
            >
              <AppWindowIcon className="w-4 h-4"/>
              <span>Ana Sayfa</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOutIcon className="w-4 h-4"/>
            <span>Çıkış</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
