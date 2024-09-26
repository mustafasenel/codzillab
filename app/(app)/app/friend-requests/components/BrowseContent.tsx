"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { FullGameBodyType, FullUserType } from "@/types";
import { Game, GameBody } from "@prisma/client";
import React, { useState, useEffect } from "react";
import AdvertCard from "./AdvertCard";
import { CreateGameMate } from "./CreateGameMate";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface BrowseContentProps {
  user: FullUserType;
  games?: Game[] | [];
}

const BrowseContent: React.FC<BrowseContentProps> = ({ user, games }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGameBodies, setSelectedGameBodies] = useState<
    FullGameBodyType[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string>();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const fetchGameBodies = async (gameId?: string) => {
    setLoading(true);
    try {
      const url = gameId
        ? `/api/gamebody/gamebodies?gameId=${gameId}`
        : "/api/gamebody/gamebodies";
      const response = await fetch(url);
      const data = await response.json();
      setSelectedGameBodies(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching game bodies:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameBodies();
  }, []);

  const handleGameClick = (gameId: string) => {
    fetchGameBodies(gameId);
  };

  return (
    <>
      <TabsContent value="browseRequests">
        <ScrollArea>
          {games && games.length > 0 ? (
            <div className="overflow-x-auto pb-4">
              <div className="flex space-x-4">
                {games.map((game) => (
                  <Card
                    key={game.id} // Öğe ID'si kullanılmalı
                    className={cn(
                      "flex-shrink-0 w-32 overflow-hidden cursor-pointer rounded-none shadow-none border-none"
                    )}
                    onClick={() => {
                      handleGameClick(game.id);
                      setSelectedGame(game.id);
                    }} // Oyuna tıklama işlemi
                  >
                    <CardContent className="aspect-[3/4] p-0 hover:scale-110 transition-all">
                      <div
                        className={cn(
                          "w-full h-full bg-cover bg-center",
                          selectedGame == game.id
                            ? "border-purple-500 border-4"
                            : "border-none"
                        )}
                      >
                        <Image
                          src={game.image!}
                          alt={game.name}
                          width={300}
                          height={300}
                          placeholder="blur"
                          blurDataURL={game.image!}
                          quality={100}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start space-y-1 pt-2 px-1 pb-2">
                      <h2 className="text-xs">{game.name}</h2>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div>Henüz Oyun Eklenmedi</div>
          )}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="py-6">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            {loading ? (
              <div>Yükleniyor...</div> // Yükleniyor durumu
            ) : !!selectedGameBodies.length ? (
              selectedGameBodies.map((advert) => (
                <AdvertCard key={advert.id} advert={advert!} />
              ))
            ) : (
              <div className="flex">Henüz Oyuna ait ilan yok</div>
            )}
          </div>
        </div>
        <CreateGameMate
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          games={games!}
        />
      </TabsContent>
    </>
  );
};

export default BrowseContent;
