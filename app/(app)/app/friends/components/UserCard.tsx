"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FullOrganizationType, FullUserType } from "@/types";
import { User } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { UserCheck, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { forwardRef, useEffect, useState } from "react";

interface UserCardProps {
  user: FullUserType;
  currentUser: User;
  ref: any;
}

const UserCard = forwardRef<HTMLDivElement, UserCardProps>(function UserCard(
  { user, currentUser },
  ref
) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);

  const queryClient = useQueryClient();

  // Fetch the friend request status
  const {
    data: requestStatus,
    isLoading: requestLoading,
    error: requestError,
  } = useQuery({
    queryKey: ["checkFriendRequest", user?.id],
    queryFn: async () => {
      const response = await axios.post("/api/user/follow/check-request", {
        recipientId: user?.id,
      });
      return response.data;
    },
    enabled: !!user?.id, // Only fetch when user.id is available
  });

  // Fetch the follow status
  const {
    data: followStatus,
    isLoading: followLoading,
    error: followError,
  } = useQuery({
    queryKey: ["checkFollow", user?.id],
    queryFn: async () => {
      const response = await axios.post("/api/user/follow/check-follow", {
        recipientId: user?.id,
      });
      return response.data;
    },
    enabled: !!user?.id && !!currentUser, // Only fetch when user.id and currentUser are available
  });

  // Durum güncellemeleri
  useEffect(() => {
    if (requestStatus) {
      setIsRequestSent(requestStatus.hasRequest);
    }
  }, [requestStatus, user]);

  useEffect(() => {
    if (followStatus) {
      setIsFollowing(followStatus.hasRequest);
    }
  }, [followStatus, user]);

  // Mutation for following/unfollowing a user or organization
  const followMutation = useMutation({
    mutationKey: ["follow", user?.id], // Using mutationKey for tracking
    mutationFn: async () => {
      if (!followStatus?.hasRequest) {
        return axios.post("/api/user/follow", {
          recipientId: user?.id,
        });
      } else {
        return axios.post("/api/user/follow/unfollow", {
          recipientId: user?.id,
        });
      }
    },
    onMutate: async () => {
      // Mutasyon başlamadan önce durumları güncelle
      await queryClient.cancelQueries({ queryKey: ["checkFollow", user?.id] });
      await queryClient.cancelQueries({
        queryKey: ["checkFriendRequest", user?.id],
      });

      const previousFollowStatus = queryClient.getQueryData([
        "checkFollow",
        user?.id,
      ]);
      const previousRequestStatus = queryClient.getQueryData([
        "checkFriendRequest",
        user?.id,
      ]);

      setIsRequestSent((prev) => !prev); // İstek durumunu tersine çevir

      return { previousFollowStatus, previousRequestStatus }; // Geri döndür
    },
    onError: (error, _, context) => {
      console.error("Takip işlemi sırasında hata oluştu:", error);
      if (context?.previousFollowStatus) {
        queryClient.setQueryData(
          ["checkFollow", user?.id],
          context.previousFollowStatus
        );
      }
      if (context?.previousRequestStatus) {
        queryClient.setQueryData(
          ["checkFriendRequest", user?.id],
          context.previousRequestStatus
        );
      }
    },
    onSuccess: () => {
      // Invalidate queries to refetch data after mutation success
      if (user?.id !== undefined) {
        queryClient.invalidateQueries({ queryKey: ["user", user.username] });
        queryClient.invalidateQueries({ queryKey: ["checkFollow", user?.id] }); // Invalidate follow query
        queryClient.invalidateQueries({
          queryKey: ["checkFriendRequest", user?.id],
        });
      }
    },
  });

  const handleFollow = () => {
    followMutation.mutate();
  };
  return (
    <Card className="p-0 flex flex-col" ref={ref}>
    <div
      className="w-full h-24 bg-origin-content bg-cover bg-center rounded-t-xl"
      style={{
        backgroundImage: user?.coverImage
          ? `url(${user.coverImage})`
          : `url("anasayfabg.png")`,
      }}
    />
    <div className="flex items-center justify-center">
      <Image
        src={
          user?.image
            ? user.image
            : "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E"
        }
        alt="avatar-image"
        width={100}
        height={100}
        className="w-28 h-28 -mt-14 rounded-full object-cover object-center border-4"
        unoptimized
      />
    </div>
    <div className="flex flex-col items-center space-y-2 py-4">
      <Link href={`/${user.username}`} className="text-xl hover:underline">
        {user.name} {user.surname}
      </Link>
      <p className="text-sm text-muted-foreground">@{user.username}</p>
      <p className="text-muted-foreground text-sm">
        {user?.followings?.length} takipçi
      </p>
      <Separator />
      <div className="pt-2">
        <Button
          className="gap-2"
          type="button"
          onClick={handleFollow}
          disabled={isLoading}
        >
          {isLoading ? (
            <Icons.spinner className="md:h-5 md:w-5 h-4 w-4 animate-spin" />
          ) : (
            <>
              {isRequestSent || isFollowing ? (
                <UserCheck className="md:h-5 md:w-5 h-4 w-4" />
              ) : (
                <UserPlus className="md:h-5 md:w-5 h-4 w-4" />
              )}
              {isFollowing ? (
                <span>Takip ediliyor</span>
              ) : (
                <span>{isRequestSent ? "İstek Gönderildi" : "Takip Et"}</span>
              )}
            </>
          )}
        </Button>
      </div>
    </div>
  </Card>
  );
});

// Set displayName for debugging
UserCard.displayName = "UserCard";

export default UserCard;