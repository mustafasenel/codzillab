"use client";

import { FullOrganizationType } from "@/types";
import React, { useState } from "react";
import { Search } from "../../friend-requests/components/search";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { UserCheck, UserPlus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

interface OrganizationsProps {
  organizations?: FullOrganizationType[] | [];
}

const OrganizationExplore: React.FC<OrganizationsProps> = ({
  organizations,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const router = useRouter()
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <Search />
        <Button onClick={() => router.push("/settings/organizations")}>Oluştur</Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {organizations ? (
          organizations.map((organization, index) => (
            <Card className="p-0 flex flex-col" key={index}>
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
                  onClick={() => {}}
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
          ))
        ) : (
          <div className="w-full flex items-center justify-center">
            Organizasyon bulunamadı
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationExplore;
