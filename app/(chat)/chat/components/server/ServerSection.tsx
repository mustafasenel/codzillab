"use client"

import { ServerWithMembersWithProfiles } from "@/types";
import { ChanelType, MemnerRole } from "@prisma/client";
import ActionTooltip from "../ActionTooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal";

interface ServerSectionProps {
    label: string;
    role?: MemnerRole;
    sectionType: "channels" | "members";
    channelType?: ChanelType;
    server?: ServerWithMembersWithProfiles;
}

const ServerSection = ({ label, role, sectionType, channelType, server }: ServerSectionProps) => {
    const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-muted-foreground">
        {label}
      </p>
      {role !== MemnerRole.GUEST && sectionType === "channels" && (
        <ActionTooltip label="Kanal Oluştur" side="top">
            <button className="text-muted-foreground transition" onClick={() => onOpen("createChannel", { channelType })}>
                <Plus className="h-4 w-4"/>
            </button>
        </ActionTooltip>
      )}
      {role === MemnerRole.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Yönrt" side="top">
            <button className="text-muted-foreground transition" onClick={() => onOpen("members", { server })}>
                <Settings className="h-4 w-4"/>
            </button>
        </ActionTooltip>
      )}
    </div>
  )
}

export default ServerSection
