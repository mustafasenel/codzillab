import { Card } from "@/components/ui/card";
import { FullUserType } from "@/types";
import Image from "next/image";
import React from "react";

interface RightBarProps {
  user: FullUserType;
}

const RightBar: React.FC<RightBarProps> = ({ user }) => {
  return (
    <div className="flex flex-col w-full">
      <Card className="p-0 flex flex-col">
        <div
          className="w-full h-32 bg-origin-content bg-cover bg-center rounded-t-xl"
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
        <div className="flex flex-col items-center space-y-2 py-6">
          <h2 className="text-xl">
            {user?.name} {user?.surname}
          </h2>
          <h2 className="text-muted-foreground">@{user?.username}</h2>
          <p className="text-muted-foreground text-sm">
            {user?.followings?.length} takipçi • {user?.followers?.length} takip edilen 
          </p>
        </div>
      </Card>
    </div>
  );
};

export default RightBar;
