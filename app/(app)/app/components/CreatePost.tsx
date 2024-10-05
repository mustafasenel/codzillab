"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FullOrganizationType, FullUserType } from "@/types";
import { CalendarClock, Image, Video } from "lucide-react";
import React from "react";

interface CreatePostProps {
  user: FullUserType;
  isOrganization?: Boolean;
  identifier?: FullUserType | FullOrganizationType | null
}

const CreatePost: React.FC<CreatePostProps> = ({ user, isOrganization, identifier }) => {
  return (
    <div className="w-full">
      <Card className="space-y-6 pt-6 bg-muted">
        <CardContent className="flex flex-col gap-6">
          <div  className="flex flex-col items-start md:flex-row md:items-center md:justify-between md:gap-6 gap-4">
            <div className="flex items-center justify-center">
              <Avatar>
                <AvatarImage
            src={
              isOrganization
                ? (identifier as FullOrganizationType)?.logo ||
                  "https://d2q79iu7y748jz.cloudfront.net/s/_squarelogo/256x256/97f7fb0e435bdd42e9b50113e67abf36"
                : (user as FullUserType)?.image ||
                  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E"
            }
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1">
              <Input placeholder="Neler oluyor?" className="ring-muted-foreground ring-1" />
            </div>
            <div>
              <Button>Gönder</Button>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-start md:flex-row md:items-center md:justify-between md:gap-6">
              <Button className="gap-2" variant={"ghost"}>
                <Image size={20}/>
                Görsel Yükle
              </Button>
              <Button className="gap-2" variant={"ghost"}>
                <Video size={20}/>
                Video Yükle
              </Button>
              <Button className="gap-2" variant={"ghost"}>
                <CalendarClock size={20}/>
                Etkinlik Oluştur
              </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePost;
