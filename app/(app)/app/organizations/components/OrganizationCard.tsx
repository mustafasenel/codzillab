"use client"

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FullOrganizationType } from '@/types'
import { User } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { UserCheck, UserPlus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

interface OrganizationCardProps {
    organization: FullOrganizationType;
    currentUser: User
}

const OrganizationCard:React.FC<OrganizationCardProps> = ({ organization, currentUser }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
  
    const queryClient = useQueryClient();

    // Fetch the follow status
    const {
      data: followStatus,
      isLoading: followLoading,
      error: followError,
    } = useQuery({
      queryKey: ["checkFollowOrg", organization?.id],
      queryFn: async () => {
        const response = await axios.post("/api/organization/follow/check-follow", {
          recipientId: organization?.id,
        });
        return response.data;
      },
      enabled: !!organization?.id && !!currentUser, // Only fetch when user.id and currentUser are available
    });
  

    useEffect(() => {
      if (followStatus) {
        setIsFollowing(followStatus.hasRequest);
      }
    }, [followStatus, organization]);
  
    // Mutation for following/unfollowing a user or organization
    const followMutation = useMutation({
      mutationKey: ["followOrg", organization?.id], // Using mutationKey for tracking
      mutationFn: async () => {
          return axios.post("/api/organization/follow", {
            recipientId: organization?.id,
          });
      },
      onMutate: async () => {
        // Mutasyon başlamadan önce durumları güncelle
        await queryClient.cancelQueries({ queryKey: ["checkFollowOrg", organization?.id] });

        const previousFollowStatus = queryClient.getQueryData([
          "checkFollowOrg",
          organization?.id,
        ]);

        setIsFollowing((prev) => !prev); // Takip durumunu tersine çevir

        return { previousFollowStatus }; // Geri döndür
      },
      onError: (error, _, context) => {
        console.error("Takip işlemi sırasında hata oluştu:", error);
        if (context?.previousFollowStatus) {
          queryClient.setQueryData(
            ["checkFollowOrg", organization?.id],
            context.previousFollowStatus
          );
        }

      },
      onSuccess: () => {
        // Invalidate queries to refetch data after mutation success
        if (organization?.id !== undefined) {
          queryClient.invalidateQueries({ queryKey: ["checkFollow", organization?.id] }); // Invalidate follow query
        }
      }
    });
  
    const handleFollow = () => {
      followMutation.mutate();
    };

  return (
    <Card className="p-0 flex flex-col">
    <div
      className="w-full h-24 bg-origin-content bg-cover bg-center rounded-t-xl"
      style={{
        backgroundImage: organization?.cover
          ? `url(${organization.cover})`
          : `url("anasayfabg.png")`,
      }}
    />
    <div className="flex items-center justify-center">
      <Image
        src={
          organization?.logo
            ? organization.logo
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
      <Link
        href={`/${organization.slug}`}
        className="text-xl hover:underline"
      >
        {organization.name}
      </Link>
      <p className="text-muted-foreground text-sm">
        {organization?.followers?.length} takipçi
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
        ) : isFollowing ? (
          <UserCheck className="md:h-5 md:w-5 h-4 w-4" />
        ) : (
          <UserPlus className="md:h-5 md:w-5 h-4 w-4" />
        )}
        {isFollowing ? (
          <span>Takip ediliyor</span>
        ) : (
          <span>Takip Et</span>
        )}
      </Button>
      </div>
    </div>
  </Card>
  )
}

export default OrganizationCard
