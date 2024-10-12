"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FullOrganizationType, FullUserType } from "@/types";
import axios from "axios";
import { AtSign, Camera, UserCheck, UserPlus, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ProfilePictureModal } from "./ProfilePictureModal";
import { Icons } from "@/components/icons";
import toast from "react-hot-toast";
import { Organization } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ProfileDetailsSkeleton from "./ProfileDetailsSkeletton";

interface ProfileDetailsProps {
  user?: FullUserType | FullOrganizationType | null;
  currentUser?: FullUserType | null;
  identifier: string;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  currentUser,
  identifier
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const [isFollowing, setIsFollowing] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);

  const router = useRouter();

  const [isOrganization, setIsOrganization] = useState(false);

  const {
    data: userQuery,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ["user", identifier],
    queryFn: async () => {
      const response = await axios.get(`/api/users/${identifier}`); // Kullanıcı API'sini çağır
      return response.data; // Yanıtı döndür
    },
    enabled: !!identifier, // identifier varsa sorguyu etkinleştir
  });

  // Organizasyon bilgisi için useQuery
  const {
    data: organizationQuery,
    isLoading: organizationLoading,
  } = useQuery({
    queryKey: ["organization", identifier],
    queryFn: async () => {
      const response = await axios.get(`/api/organizations/${identifier}`); // Organizasyon API'sini çağır
      return response.data; // Yanıtı döndür
    },
    enabled: !!identifier  // identifier varsa sorguyu etkinleştir
  });


    const singleUser = userQuery || null;
    const organization = organizationQuery || null;

    const user = singleUser || organization;


  useEffect(() => {
    if (user) {
      setIsOrganization("ownerId" in user);
    }
  }, [user]);

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
    enabled: !!user?.id && isOrganization, // Only fetch when user.id is available
  });

  // Fetch the follow status
  const {
    data: followStatus,
    isLoading: followLoading,
    error: followError,
  } = useQuery({
    queryKey: ["checkFollow", user?.id, isOrganization],
    queryFn: async () => {
      const endpoint = isOrganization
        ? "/api/organization/follow/check-follow"
        : "/api/user/follow/check-follow";
      const response = await axios.post(endpoint, {
        recipientId: user?.id,
      });
      return response.data;
    },
    enabled: !!user?.id && !!currentUser, // Only fetch when user.id and currentUser are available
  });

  // Durum güncellemeleri
  useEffect(() => {
    if (requestStatus && isOrganization) {
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
    mutationKey: ["follow", user?.id, isOrganization], // Using mutationKey for tracking
    mutationFn: async () => {
      if (!isOrganization) {
        if (!followStatus?.hasRequest) {
          return axios.post("/api/user/follow", {
            recipientId: user?.id,
          });
        } else {
          return axios.post("/api/user/follow/unfollow", {
            recipientId: user?.id,
          });
        }
      } else {
        return axios.post("/api/organization/follow", {
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

      // Takip durumu tersine çevrildi (sadece isOrganization için)
      if (isOrganization) {
        setIsFollowing((prev) => !prev); // Takip durumunu tersine çevir
      } else {
        setIsRequestSent((prev) => !prev); // İstek durumunu tersine çevir
      }

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
        queryClient.invalidateQueries({ queryKey: ["user", identifier] });
        queryClient.invalidateQueries({ queryKey: ["checkFollow", user?.id] }); // Invalidate follow query
        queryClient.invalidateQueries({
          queryKey: ["checkFriendRequest", user?.id],
        });
        queryClient.invalidateQueries({ queryKey: ["organization", identifier] });
      }
    }
  });

  const handleFollow = () => {
    followMutation.mutate();
  };

  const isLoading = requestLoading || followLoading;

  if (!user) {
    return <ProfileDetailsSkeleton />
  }

  return (
    <div className="flex items-center justify-between pt-4 md:px-0 px-2">
      <ProfilePictureModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isOrganization={isOrganization}
        user={user}
      />
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "group relative flex items-center justify-center md:w-40 md:h-40 h-20 w-20 transition-all",
            isOrganization
              ? (user as Organization)?.ownerId == currentUser?.id &&
                  "hover:opacity-80"
              : user?.id == currentUser?.id && "hover:opacity-80"
          )}
        >
          {currentUser?.id &&
            user?.id &&
            (user.id === currentUser.id ||
              (user as Organization)?.ownerId === currentUser.id) && (
              <span
                onClick={handleOpenModal}
                className="absolute bottom-4 right-4 bg-slate-100 p-1 rounded-lg hidden group-hover:block transition-all cursor-pointer hover:bg-slate-300"
              >
                <Camera className="text-muted-foreground w-5 h-5" />
              </span>
            )}
          <Image
            src={
              isOrganization
                ? (user as FullOrganizationType)?.logo ||
                  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E"
                : (user as FullUserType)?.image ||
                  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E"
            }
            alt="avatar"
            width={100}
            height={100}
            unoptimized
            placeholder="blur"
            blurDataURL={
              isOrganization
                ? (user as FullOrganizationType)?.logo ||
                  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E"
                : (user as FullUserType)?.image ||
                  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E"
            }
            className={cn(
              "md:w-40 md:h-40 h-20 w-20 object-cover",
              isOrganization ? "rounded-xl" : "rounded-full"
            )}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <h2 className="font-semibold text-lg md:text-3xl">
            {isOrganization ? (
              <>{(user as FullOrganizationType)?.name}</>
            ) : (
              <>
                {(user as FullUserType)?.name} {(user as FullUserType)?.surname}
              </>
            )}
          </h2>
          {!isOrganization && (
            <div className="flex items-center gap-1 ">
              <AtSign className="md:h-5 md:w-5 h-4 w-4 text-muted-foreground" />
              <p className="text-muted-foreground text-xs md:text-sm">
                {(user as FullUserType)?.username}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between space-x-6">
        {!isOrganization && (
          <div className="flex items-center space-x-2">
            <Users className="md:h-5 md:w-5 h-4 w-4" />
            <span className="text-xs md:text-base">
              {(user as FullUserType)?.followings?.length}
            </span>
            <span className="text-xs md:text-sm text-muted-foreground">
              takipçi
            </span>
          </div>
        )}
        {!isOrganization && (
          <div className="flex items-center space-x-2">
            <Users className="md:h-5 md:w-5 h-4 w-4" />
            <span className="text-xs md:text-base">
              {user?.followers?.length}
            </span>
            <span className="text-xs md:text-sm text-muted-foreground">
              takip edilen
            </span>
          </div>
        )}
        {isOrganization && (
          <div className="flex items-center space-x-2">
            <Users className="md:h-5 md:w-5 h-4 w-4" />
            <span className="text-xs md:text-base">
              {user?.followers?.length}
            </span>
            <span className="text-xs md:text-sm text-muted-foreground">
              takipçi
            </span>
          </div>
        )}

        {!isOrganization ? (
          user?.id !== currentUser?.id && (
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
                    <span>
                      {isRequestSent ? "İstek Gönderildi" : "Takip Et"}
                    </span>
                  )}
                </>
              )}
            </Button>
          )
        ) : (
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
                {isFollowing ? (
                  <UserCheck className="md:h-5 md:w-5 h-4 w-4" />
                ) : (
                  <UserPlus className="md:h-5 md:w-5 h-4 w-4" />
                )}
                <span>{isFollowing ? "Takip ediliyor" : "Takip Et"}</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;
