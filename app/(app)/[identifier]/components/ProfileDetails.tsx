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

interface ProfileDetailsProps {
  user?: FullUserType | FullOrganizationType | null;
  currentUser?: FullUserType | null;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  user,
  currentUser,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const [isRequestSent, setIsRequestSent] = useState(false); // İstek gönderilmiş mi?
  const [isFollowing, setIsFollowing] = useState(false);

  const router = useRouter();

  const [isOrganization, setIsOrganization] = useState(false);

  useEffect(() => {
    if (user) {
      setIsOrganization("ownerId" in user);
    }
  }, [user]);

  useEffect(() => {
    const checkFriendRequest = async () => {
      if (user && currentUser) {
        try {
          const response = await axios.post("/api/user/follow/check-request", {
            recipientId: user.id,
          });

          setIsRequestSent(response.data.hasRequest);
        } catch (error: any) {
          console.error("İstek kontrol edilemedi:", error);
        }
      }
    };

    checkFriendRequest();
  }, [user, currentUser]);

  useEffect(() => {
    const checkFollow = async () => {
      if (user && currentUser) {
        try {
          const response = await axios.post("/api/user/follow/check-follow", {
            recipientId: user.id,
          });

          setIsFollowing(response.data.hasRequest);
        } catch (error: any) {
          console.error("İstek kontrol edilemedi:", error);
        }
      }
    };

    checkFollow();
  }, [user, currentUser]);

  const handleFollow = () => {
    setIsLoading(true);
    try {
      if (!isFollowing) {
        axios
          .post("/api/user/follow", {
            recipientId: user?.id,
          })
          .then(() => {
            isRequestSent
              ? toast.success("Arkadaşlık isteği geri çekildi")
              : toast.success("Arkadaşlık isteği gönderildi");
            router.refresh();
          })
          .finally(() => setIsLoading(false));
      } else {
        axios
          .post("/api/user/follow/unfollow", {
            recipientId: user?.id,
          })
          .then(() => {
            router.refresh();
          })
          .finally(() => setIsLoading(false));
      }
    } catch (error: any) {
      console.error(error);
    }
  };
  return (
    <div className="flex items-center justify-between pt-4 md:px-0 px-2">
      <ProfilePictureModal isOpen={isModalOpen} onClose={handleCloseModal} isOrganization={isOrganization} user={user}/>
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
          {currentUser?.id && user?.id && (user.id === currentUser.id || (user as Organization)?.ownerId === currentUser.id)  && (
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
          <>
            {user?.id !== currentUser?.id && (
              <Button
                className="gap-2"
                type="button"
                onClick={handleFollow}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Icons.spinner className="md:h-5 md:w-5 h-4 w-4 animate-spin" />
                ) : isRequestSent || isFollowing ? (
                  <UserCheck className="md:h-5 md:w-5 h-4 w-4" />
                ) : (
                  <UserPlus className="md:h-5 md:w-5 h-4 w-4" />
                )}
                {isFollowing ? (
                  <span>Takip ediliyor</span>
                ) : (
                  <>
                    {isRequestSent ? (
                      <span>İstek Gönderildi</span>
                    ) : (
                      <span>Takip Et</span>
                    )}
                  </>
                )}
              </Button>
            )}
          </>
        ) : (
          <Button
            className="gap-2"
            type="button"
            onClick={handleFollow}
            disabled={isLoading}
          >
            {isLoading ? (
              <Icons.spinner className="md:h-5 md:w-5 h-4 w-4 animate-spin" />
            ) : isFollowing ? (
              <UserCheck className="md:h-5 md:w-5 h-4 w-4" />
            ) : (
              <UserPlus className="md:h-5 md:w-5 h-4 w-4" />
            )}
            {isFollowing ? <span>Takip ediliyor</span> : <span>Takip Et</span>}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;
