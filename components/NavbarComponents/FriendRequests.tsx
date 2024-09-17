"use client";

import { FullFriendRequestType, FullUserType } from "@/types";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Icons } from "../icons";
import { Skeleton } from "../ui/skeleton";

interface FriendRequestsProps {
  currentUser?: FullUserType | null | undefined;
}

const FriendRequests: React.FC<FriendRequestsProps> = ({ currentUser }) => {
  const [isLoadingAccept, setIsLoadingAccept] = useState(false);
  const [isLoadingReject, setIsLoadingReject] = useState(false);

  const router = useRouter();
  const [friendRequests, setFriendRequests] = useState<FullFriendRequestType[]>(
    []
  );
  useEffect(() => {
    if (currentUser?.id) {
      const pendingRequests =
        currentUser.friendRequestReceived?.filter(
          (request) => request.status === "PENDING"
        ) || [];
      setFriendRequests(pendingRequests);
    } else {
      setFriendRequests([]);
    }
  }, [currentUser]);

  const handleAcceptRequest = async (requestId: string) => {
    setIsLoadingAccept(true);
    try {
      const response = await axios.post("/api/user/follow/accept-request", {
        requestId,
      });

      if (response.status === 200) {
        toast.success("Arkadaşlık isteği kabul edildi ve takip başlatıldı.");
        setIsLoadingAccept(false);
        router.refresh();
      }
    } catch (error) {
      toast.error("İstek kabul edilirken bir hata oluştu.");
      console.error(error);
    }
  };

  const handleRejectRequest = () => {
    // TO DO: implement reject request logic
  };

  return (
    <div className="w-full h-full p-2">
      {!!friendRequests.length ? (
        <div className="flex flex-col space-y-2">
          {friendRequests.map((friendRequest, index) => (
            <div
              key={index}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center">
                <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                  <AvatarImage
                    src={
                      friendRequest.requester.image
                        ? friendRequest.requester.image
                        : "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E"
                    }
                    alt="Avatar"
                  />
                  <AvatarFallback>JL</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {friendRequest.requester.name}{" "}
                    {friendRequest.requester.surname}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    @{friendRequest.requester.username}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="p-1 hover:bg-emerald-500 transition-all opacity-80 rounded-full"
                  onClick={() => handleAcceptRequest(friendRequest.id)}
                >
                  {isLoadingAccept ? (
                    <Icons.spinner className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                </button>
                <button
                  className="p-1 hover:bg-red-500 transition-all opacity-80 rounded-full"
                  onClick={handleRejectRequest}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-8 rounded-full animate-none"/>
              <div className="space-y-2">
                <Skeleton className="h-3 w-[150px] animate-none" />
                <Skeleton className="h-3 w-[100px] animate-none" />
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              Henüz arkadaşlık isteğin yok
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendRequests;
