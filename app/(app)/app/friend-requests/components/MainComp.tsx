"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FullGameBodyType, FullUserType } from "@/types";
import React, { useState } from "react";
import { Search } from "./search";
import BrowseContent from "./BrowseContent";
import { Game } from "@prisma/client";
import MyRequests from "./MyRequests";
import { CreateGameMate } from "./CreateGameMate";
import { Button } from "@/components/ui/button";

interface MainCompProps {
  user: FullUserType;
  games?: Game[]
  userGameBodyAdverts?: FullGameBodyType[] | [] | undefined
}

const MainComp: React.FC<MainCompProps> = ({ user, games, userGameBodyAdverts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div>
      <Tabs defaultValue="browseRequests" className="space-y-4">
        <div className="flex items-start space-y-2 md:space-y-0 md:items-center justify-start md:justify-between md:flex-row flex-col w-full">
          <TabsList className="grid grid-cols-2 gap-4 w-full md:w-96">
            <TabsTrigger className="" value="myRequests">
              Benim İlanlarım
            </TabsTrigger>
            <TabsTrigger value="browseRequests">Keşfet</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-4 md:justify-start justify-between w-full md:w-fit">
          <Search />
          <Button onClick={handleOpenModal}>Oluştur</Button>
          </div>
        </div>
        <TabsContent value="myRequests" className="space-y-4"></TabsContent>
        <BrowseContent games={games} user={user}/>
        <MyRequests games={games} user={user} userGameBodyAdverts={userGameBodyAdverts}/>
      </Tabs>
      <CreateGameMate
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        games={games!}
      />
    </div>
  );
};

export default MainComp;
