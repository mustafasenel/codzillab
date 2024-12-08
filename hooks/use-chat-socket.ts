import { useSocket } from "@/context/socket-provider";
import { Member, Message, User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

type ChatSocketProps = {
    addKey: string;
    updateKey: string;
    queryKey: string;
}

type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: User
    }
}

export const useChatSocket = ({
    addKey,
    updateKey,
    queryKey
}: ChatSocketProps) => {
    const { socket } = useSocket();
    const queryClient = useQueryClient();
    
    // useRef to track if listeners are already added
    const listenersAdded = useRef(false);

    useEffect(() => {
        if (!socket || listenersAdded.current) {
            return;
        }

        console.log("USE EFFECT TRIGGRED")
        console.log("Adding listeners for:", addKey, updateKey);
        console.log("Socket status:", socket?.connected);

        // Set listeners
        socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
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
                        })
                    }
                });
                return {
                    ...oldData,
                    pages: newData
                }
            });
        });

        socket.on(addKey as string, (message: MessageWithMemberWithProfile) => {
            console.log("ADD KEY TRIGGRED", message);
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
                };
            });
        });

        // Mark listeners as added
        listenersAdded.current = true;

        // Cleanup function to remove listeners only on unmount
        return () => {
            console.log("Removing listeners");
            socket.off(addKey);
            socket.off(updateKey);
            listenersAdded.current = false; // Reset the ref
        }
    }, [queryClient, addKey, queryKey, socket, updateKey]);
};
