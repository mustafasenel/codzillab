import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import ChatHeader from "@/app/(chat)/chat/components/chat/ChatHeader";
import ChatInput from "@/app/(chat)/chat/components/chat/ChatInput";
import ChatMessages from "@/app/(chat)/chat/components/chat/ChatMessages";
import { pusherClient } from "@/lib/pusher";
import { PusherProvider } from "@/context/PusherProvider";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await getCurrentUser();
  if (!profile) {
    return redirect("/authentication");
  }

  const channel = await prismadb.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await prismadb.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) {
    return redirect("/chat");
  }

  return (
    <PusherProvider channelName={`chat_${channel.id}`}>
      <div className="flex flex-col h-full">
        <ChatHeader
          serverId={channel.serverId}
          name={channel.name}
          type="channel"
        />
        <ChatMessages
          member={member}
          chatId={channel.id}
          name={channel.name}
          type="channel"
          apiUrl="/api/chat/messages"
          socketUrl="/api/socket/messages"
          socketQuery={{
            channelId: channel.id,
            serverId: channel.serverId,
          }}
          paramKey="channelId"
          paramValue={channel.id}
        />
        <ChatInput
          name={channel.name}
          type="channel"
          apiUrl="/api/socket/messages"
          query={{
            channelId: params.channelId,
            serverId: channel.serverId,
          }}
        />
      </div>
    </PusherProvider>
  );
};

export default ChannelIdPage;
