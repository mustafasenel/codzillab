import { FullGameBodyType, FullUserType } from "@/types";
import React, { use } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostContent from "./PostContent";
import GameBodyContent from "./GameBodyContent";
import RightSide from "./RightSide";

interface ProfileLayoutProps {
  user?: FullUserType | null;
  currentUser?: FullUserType | null;
  userGameBodyAdverts?: FullGameBodyType[] | [];
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ user, currentUser, userGameBodyAdverts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 pt-4">
      <div className="md:col-span-4 order-2 md:order-1">
        <Tabs defaultValue="posts" className="w-full space-y-4">
          <TabsList className="w-full flex items-center justify-between overflow-x-auto">
            <TabsTrigger className="md:text-sm text-xs" value="posts">Gönderiler</TabsTrigger>
            <TabsTrigger className="md:text-sm text-xs" value="gamebody">Oyun Arkadaşları</TabsTrigger>
            <TabsTrigger className="md:text-sm text-xs" value="games">Favori Oyunlar</TabsTrigger>
            <TabsTrigger className="md:text-sm text-xs" value="following">Takip Edilenler</TabsTrigger>
            <TabsTrigger className="md:text-sm text-xs" value="followers">Takipçiler</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <PostContent user={user} currentUser={currentUser}/>
          </TabsContent>
          <TabsContent value="gamebody">
            <GameBodyContent userGameBodyAdverts={userGameBodyAdverts!} user={user!}/>
          </TabsContent>
        </Tabs>
      </div>
      <div className="md:col-span-2 order-1 md:order-2">
        <RightSide user={user!} currentUser={currentUser!} />
      </div>
    </div>
  );
};

export default ProfileLayout;
