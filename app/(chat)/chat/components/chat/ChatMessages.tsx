"use client";

import { Member, Message, User } from "@prisma/client";
import ChatWelcome from "./ChatWelcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
<<<<<<< HEAD
import { ElementRef, Fragment, useRef } from "react";
=======
import { ElementRef, Fragment, useEffect, useRef } from "react";
>>>>>>> 9051b5ddd4cddb77d269a93c36a6e3472dd664fb
import ChatItem from "./ChatItem";
import { format } from "date-fns";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";
<<<<<<< HEAD
=======

>>>>>>> 9051b5ddd4cddb77d269a93c36a6e3472dd664fb

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
  type: "channel" | "conversation";
}

type MessageMemberWithProfile = Message & {
  member: Member & { profile: User };
};

const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
<<<<<<< HEAD
  const addKey = `chat_${chatId}_messages`;
  const updateKey = `chat_${chatId}_messages_update`;
=======
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;
>>>>>>> 9051b5ddd4cddb77d269a93c36a6e3472dd664fb

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

<<<<<<< HEAD
=======

>>>>>>> 9051b5ddd4cddb77d269a93c36a6e3472dd664fb
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      apiUrl,
      queryKey,
      paramKey,
      paramValue,
    });

  useChatSocket({ queryKey, addKey, updateKey });
  useChatScroll({
    chatRef, 
    bottomRef, 
    loadMore: fetchNextPage, 
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage, 
    count: data?.pages?.[0].items?.length ?? 0
})

<<<<<<< HEAD
=======
  useChatScroll({
    chatRef, 
    bottomRef, 
    loadMore: fetchNextPage, 
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage, 
    count: data?.pages?.[0].items?.length ?? 0
})

>>>>>>> 9051b5ddd4cddb77d269a93c36a6e3472dd664fb
  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-slate-500 animate-spin my-4" />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Mesajlar yükleniyor...
        </p>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-slate-500 my-4" />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Bir şeyler ters gitti!
        </p>
      </div>
    );
  }

  return (
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && (
      <ChatWelcome name={name} type={type} />
      )}
      {hasNextPage && (
        <div className="flex justify-center">
            {isFetchingNextPage ? (

                <Loader2 className="h-7 w-7 text-slate-500 animate-spin my-4"/>
            ) : (
                <button onClick={() => fetchNextPage()} className="text-slate-500 hover:text-slate-600 dark:text-slate-400 text-xs my-4 dark:hover:text-slate-300">
                    Önceki mesajları yükle
                </button>
            )}
        </div>
      )}
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
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
