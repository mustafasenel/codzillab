import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Member, Message, User } from "@prisma/client";
import { pusherClient } from "@/lib/pusher";
import { usePusher } from "@/context/PusherProvider";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: User;
  };
};

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) => {
  const { pusher, channel } = usePusher(); // Access Pusher and channel
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!pusher) {
      console.log("Pusher channel is not available");
      return;
    }

    
    if (!channel) {
        console.log("Pusher channel is not available");
        return;
      }
    // Bind update event to channel
    channel.bind(updateKey, (message: MessageWithMemberWithProfile) => {
      console.log("UPDATE KEY TRIGGRED");
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWithProfile) => {
              if (item.id === message.id) {
                return message;
              }
              return item;
            }),
          };
        });
        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    // Bind add event to channel
    channel.bind(addKey, (message: MessageWithMemberWithProfile) => {
      console.log("ADD KEY TRIGGRED", message); // Yeni mesaj geldiğinde kontrol et
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                items: [message],
              },
            ],
          };
        }

        const newData = [...oldData.pages];

        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        };

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    // Cleanup: Unbind events when component unmounts
    return () => {
      if (channel) {
        channel.unbind(updateKey);
        channel.unbind(addKey);
      }
    };
  }, [pusher, queryClient, addKey, queryKey, updateKey]);

  return null;
};
