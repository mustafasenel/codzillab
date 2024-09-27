"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { CreateGameMate } from "./CreateGameMate";
import { FullGameBodyType, FullUserType } from "@/types";
import { Game } from "@prisma/client";
import AdvertCard from "./AdvertCard";

interface MyRequestsProps {
  user: FullUserType;
  games?: Game[] | [];
  userGameBodyAdverts?: FullGameBodyType[] | [] | undefined;
}

const MyRequests: React.FC<MyRequestsProps> = ({
  user,
  games,
  userGameBodyAdverts,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);



  return (
    <div>
      {userGameBodyAdverts == null || userGameBodyAdverts?.length == 0 ? (
        <div className="flex items-center justify-between h-52 gap-6 p-0">
          <Card
            className="h-full w-1/4 items-center justify-center p-0 dark:bg-slate-800 bg-slate-200 cursor-pointer hover:opacity-70 transition-all"
            onClick={handleOpenModal}
          >
            <CardContent className="flex items-center justify-center h-full p-0">
              <div className="flex items-center gap-4">
                <FaPlusCircle size={24} />
                <p className="text-lg font-bold">Yeni Oluştur</p>
              </div>
            </CardContent>
          </Card>
          <Card className="h-full flex-1 items-center justify-center">
            <CardContent className="flex items-center justify-center h-full">
              <div className="flex items-center gap-4">
                <p className="text-muted-foreground">
                  Henüz arkadaşlık ilanı oluşturmadın
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {userGameBodyAdverts.map((advert, index) => (
            <AdvertCard key={advert.id} advert={advert}/>
          ))}
        </div>
      )}
      <CreateGameMate
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        games={games!}
      />
    </div>
  );
};

export default MyRequests;
