import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
<<<<<<< HEAD
import { useEffect } from "react";
=======
import { Member, Message, User } from "@prisma/client";
import { pusherClient } from "@/lib/pusher";
import { usePusher } from "@/context/PusherProvider";
>>>>>>> 9051b5ddd4cddb77d269a93c36a6e3472dd664fb

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
<<<<<<< HEAD
    const { socket, isConnected } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) {
            console.log("SOCKET DSCONNECTED")
            return;
        }
        console.log("USE EFFECT TRIGGRED")
        console.log("Adding listeners for:", addKey, updateKey);
        console.log("Socket status:", socket?.connected);

        socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
            console.log("UPDATE KEY TRIGGRED")
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
                        })
                    }
                });
                return {
                    ...oldData,
                    pages: newData
                }
            });
=======
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
>>>>>>> 9051b5ddd4cddb77d269a93c36a6e3472dd664fb
        });
        return {
          ...oldData,
          pages: newData,
        };
      });
    });

<<<<<<< HEAD
        socket.on(addKey, (message: MessageWithMemberWithProfile) => {
            console.log("ADD KEY TRIGGRED", message); // Yeni mesaj geldiğinde kontrol et
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return {
                        pages: [{
                            items: [message]
                        }]
                    };
                }

                const newData = [...oldData.pages];

                newData[0] = {
                    ...newData[0],
                    items: [
                        message,
                        ...newData[0].items,
                    ]
                };
                

                return {
                    ...oldData,
                    pages: newData,
                }

            })
        });

        return () => {
            socket.off(addKey);
            socket.off(updateKey);
        }
    }, [socket, isConnected, queryClient, addKey, queryKey, updateKey]);
}
=======
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
>>>>>>> 9051b5ddd4cddb77d269a93c36a6e3472dd664fb
