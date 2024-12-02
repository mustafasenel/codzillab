"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal";
import { ServerWithMembersWithProfiles } from "@/types";
import { MemnerRole } from "@prisma/client";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import React from "react";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemnerRole;
}

const ServerHeader = ({ server, role }: ServerHeaderProps) => {

    const { onOpen } = useModal();

  const isAdmin = role === MemnerRole.ADMIN;
  const isModerator = isAdmin || role === MemnerRole.MODERATOR;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-base font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {server.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
        {isModerator && 
            <DropdownMenuItem
            onClick={() => onOpen("invite", { server })}
            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer">
                Davet Et
                <UserPlus className="w-4 h-4 ml-auto"/>
            </DropdownMenuItem>}
        {isAdmin && 
            <DropdownMenuItem className="text-sm px-3 py-2 cursor-pointer" onClick={() => onOpen("editServer", { server })}>
                Sunucu Ayarları
                <Settings className="w-4 h-4 ml-auto"/>
            </DropdownMenuItem>}
        {isAdmin && 
            <DropdownMenuItem className="text-sm px-3 py-2 cursor-pointer" onClick={() => onOpen("members", { server })}>
                Yönet
                <Users className="w-4 h-4 ml-auto"/>
            </DropdownMenuItem>}
        {isModerator && 
            <DropdownMenuItem className="text-sm px-3 py-2 cursor-pointer" onClick={() => onOpen("createChannel", { server })}>
                Kanal Oluştur
                <PlusCircle className="w-4 h-4 ml-auto"/>
            </DropdownMenuItem>}
        {isModerator && 
            <DropdownMenuSeparator />
            }
        {isAdmin && 
            <DropdownMenuItem className="text-rose-500 text-sm px-3 py-2 cursor-pointer" onClick={() => onOpen("deleteServer", { server })}>
                Sunucuyu Sil
                <Trash className="w-4 h-4 ml-auto"/>
            </DropdownMenuItem>}
        {!isAdmin && 
            <DropdownMenuItem className="text-rose-500 text-sm px-3 py-2 cursor-pointer" onClick={() => onOpen("leaveServer", { server })}>
                Sunucudan Ayrıl
                <LogOut className="w-4 h-4 ml-auto"/>
            </DropdownMenuItem>}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
