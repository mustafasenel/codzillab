"use client";

import { cn } from "@/lib/utils";
import { Member, MemnerRole, Server, User } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import UserAvatar from "../user-avatar";

interface ServerMemberProps {
  member: Member & { profile: User };
  server: Server;
}

const roleIconMap = {
  [MemnerRole.GUEST]: null,
  [MemnerRole.MODERATOR]: (
    <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />
  ),
  [MemnerRole.ADMIN]: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
};

const ServerMember = ({ member, server }: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[member.role];

  const onClick = () => {
    router.push(`/chat/servers/${params?.serverId}/conversations/${member.id}`);
  }

  return (
    <button
    onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full transition mb-1 dark:hover:bg-slate-800/50 hover:bg-slate-300/50",
        params?.memberId === member.id && "dark:bg-slate-800/60 bg-slate-300/60 "
      )}
    >
      <UserAvatar
        src={
          member.profile?.image
            ? member.profile?.image
            : "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E"
        }
        className="h-8 w-8 md:h-8 md:w-8"
      />
      <p         className={cn(
          "line-clamp-1 font-semibold text-sm transition dark:hover:text-white",
          params?.memberId === member.id && "text-black dark:text-primary"
        )}>
        {member.profile.name} {member.profile.surname} 
      </p>
      {icon}
    </button>
  );
};

export default ServerMember;
