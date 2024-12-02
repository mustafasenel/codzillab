import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb"
import { ChanelType, MemnerRole } from "@prisma/client";
import ServerHeader from "./ServerHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import ServerSearch from "./ServerSearch";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

interface ServerSidebarProps {
    serverId: string;
}

const iconMap = {
    [ChanelType.TEXT]: <Hash className="mr-2 w-4 h-4"/>,
    [ChanelType.AUDIO]: <Mic className="mr-2 w-4 h-4"/>,
    [ChanelType.VIDEO]: <Video className="mr-2 w-4 h-4"/>,
};

const roleIconMap = {
    [MemnerRole.GUEST]: null,
    [MemnerRole.MODERATOR]: <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500"/>,
    [MemnerRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500"/>,

}

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
    const profile = await getCurrentUser();

    if (!profile) {
        return redirect("/chat")
    }

    const server = await prismadb.server.findUnique({
        where: {
            id: serverId
        },
        include: {
            channels: {
                orderBy: {
                    createdAd: "asc"
                }
            },
            members: {
                include: {
                    profile: true
                },
                orderBy:{
                    role: "asc"
                }
            }
        }
    });

    const textChannels = server?.channels.filter((channel) => channel.type === ChanelType.TEXT);
    const audioChannels = server?.channels.filter((channel) => channel.type === ChanelType.AUDIO);
    const videoChannels = server?.channels.filter((channel) => channel.type === ChanelType.VIDEO);

    const members = server?.members.filter((member) => member.profileId !== profile.id)

    if (!server) {
        return redirect("/chat")
    }

    const role = server.members.find((member) => member.profileId === profile.id)?.role;


  return (
    <div className="flex flex-col h-full w-full dark:bg-[#0c1220] bg-[#F2F3F5]">
      <ServerHeader 
        server={server}
        role={role}
      />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
            <ServerSearch 
            data={[
                {
                    label: "Sohbet Kanalları",
                    type: "channel",
                    data: textChannels?.map((channel) => ({
                        id: channel.id,
                        name: channel.name,
                        icon: iconMap[channel.type]
                    }))
                },
                {
                    label: "Sesli Sohbet Kanalları",
                    type: "channel",
                    data: audioChannels?.map((channel) => ({
                        id: channel.id,
                        name: channel.name,
                        icon: iconMap[channel.type]
                    }))
                },
                {
                    label: "Görüntülü Sohbet Kanalları",
                    type: "channel",
                    data: videoChannels?.map((channel) => ({
                        id: channel.id,
                        name: channel.name,
                        icon: iconMap[channel.type]
                    }))
                },
                {
                    label: "Üyeler",
                    type: "member",
                    data: members?.map((member) => ({
                        id: member.id,
                        name: `${member?.profile?.name} ${member?.profile?.surname}`,
                        icon: roleIconMap[member.role]
                    }))
                },
            ]}/>
        </div>
      </ScrollArea>
    </div>
  )
}

export default ServerSidebar
