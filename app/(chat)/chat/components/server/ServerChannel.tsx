"use client";

import { cn } from "@/lib/utils";
import { ChanelType, Channel, MemnerRole, Server } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import ActionTooltip from "../ActionTooltip";
import { ModalType, useModal } from "@/hooks/use-modal";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemnerRole;
}

const iconMap = {
  [ChanelType.TEXT]: Hash,
  [ChanelType.AUDIO]: Mic,
  [ChanelType.VIDEO]: Video,
};

const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
  const { onOpen } = useModal()

  const params = useParams();
  const router = useRouter();

  const Icon = iconMap[channel.type];

  const onClick = () => {
    router.push(`/chat/servers/${server.id}/channels/${channel.id}`);
  }

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, {channel, server});
  }

  return (
    <button
    onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md text-muted-foreground flex items-center gap-x-2 w-full transition mb-1 dark:hover:bg-slate-800/50 hover:bg-slate-300/50",
        params?.channelId === channel.id &&
          "dark:bg-slate-800/60 bg-slate-300/60"
      )}
    >
      <Icon className="flex-shrink-0 w-5 h-5 text-muted-foreground" />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm transition dark:hover:text-white",
          params?.channelId === channel.id && "text-black dark:text-primary"
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== MemnerRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
            <ActionTooltip label="Düzenle">
                <Edit className="hidden group-hover:block w-4 h-4 text-muted-foreground transition" onClick={(e) => onAction(e, "editChannel")}/>
            </ActionTooltip>
            <ActionTooltip label="Sil">
                <Trash className="hidden group-hover:block w-4 h-4 text-muted-foreground transition" onClick={(e) => onAction(e, "deleteChannel")}/>
            </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <Lock className="ml-auto w-4 h-4 text-muted-foreground transition"/>
      )}
    </button>
  );
};

export default ServerChannel;
