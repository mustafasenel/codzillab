"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User } from "@prisma/client";
import { Plus } from "lucide-react";
import Image from "next/image";
import React from "react";

interface StoryCompProps {
  currentuser: User;
}

const StoryComp: React.FC<StoryCompProps> = ({ currentuser }) => {
  return (
    <div className="flex">
      <Card className="h-40 w-28 p-0 rounded-md relative flex items-center">
        <Image
          src={
            currentuser?.image
              ? currentuser.image
              : "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E"
          }
          alt="avatar-image"
          width={100}
          height={100}
          className="h-40 w-28  object-cover object-center rounded-md"
          unoptimized
        />
        <button className="absolute flex items-center justify-center -bottom-3 left-1/2 transform -translate-x-1/2  rounded-full p-1 ring-2 ring-background bg-primary">
          <Plus className="w-4 h-4 text-secondary" />
        </button>
      </Card>
    </div>
  );
};

export default StoryComp;
