"use client"

import { Member, Message, User } from "@prisma/client";
import ChatWelcome from "./ChatWelcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment } from "react";
import ChatItem from "./ChatItem";
import { format } from "date-fns";
import { useChatSocket } from "@/hooks/use-chat-socket";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

interface ChatMessagesProps {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation"
}

type MessageMemberWithProfile = Message & {
    member: Member & {profile: User}
}

const ChatMessages = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type
}: ChatMessagesProps) => {

    const queryKey = `chat:${chatId}`;
    const addKey = `chat:${chatId}:messages`;
    const updateKey = `chat:${chatId}:messages:update`;

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    } = useChatQuery({
        apiUrl,
        queryKey,
        paramKey,
        paramValue
    });

    useChatSocket({ queryKey, addKey, updateKey });

    if (status === "pending") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-7 w-7 text-slate-500 animate-spin my-4" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Mesajlar yükleniyor...
                </p>
            </div>
        )
    };
    if (status === "error") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <ServerCrash className="h-7 w-7 text-slate-500 my-4" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Bir şeyler ters gitti!
                </p>
            </div>
        )
    }

  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1"/>
      <ChatWelcome name={name} type={type} />
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
            <Fragment key={i}>
                {group.items.map((message: MessageMemberWithProfile) => (
                    <ChatItem
                        key={message.id}
                        id={message.id}
                        currentMember={member}
                        member={message.member}
                        content={message.content}
                        fileUrl={message.fileUrl}
                        deleted={message.deleted}
                        timestamp={format(new Date(message.createdt), DATE_FORMAT)}
                        isUpdated={message.createdt !== message.updatedt}
                        socketUrl={socketUrl}
                        socketQuery={socketQuery}
                    />
                ))}
            </Fragment>
        ))}
      </div>
    </div>
  )
}

export default ChatMessages
