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
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import SkeletonCard from "./SkeletonCard";
import SearchGame from "./SearchGame";
import SearchPlatform from "./SearchPlatform";

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
  const [isScrolled, setIsScrolled] = useState(false);

  const [selectedGame, setSelectedGame] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleGameChange = (gameName: string) => {
    setSelectedGame(gameName);
  };

  const handlePlatformChange = (platformName: string) => {
    setSelectedPlatform(platformName); // Seçilen oyunu state'e atıyoruz
  };


  const handleSearch = () => {
    fetchGameBodies(selectedGame)
  }

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
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = event.currentTarget.scrollTop;
    console.log(scrollTop);
    if (scrollTop > 20) {
      setIsScrolled(true); // Eğer scroll 100px'in üzerindeyse gizle
    } else {
      setIsScrolled(false); // Scroll yukarıdaysa göster
    }
  };

  const handleClear = () => {
    setSelectedGame("");
    fetchGameBodies();
  };
  useEffect(() => {
    console.log("Updated selectedGame:", selectedGame);
  }, [selectedGame]);
  return (
    <div className="h-[calc(100vh-150px)]">
      <div
        className={cn(
          isScrolled
            ? "transition-all duration-500 h-0 opacity-0"
            : "transition-all duration-500 h-auto opacity-100",
          "overflow-hidden flex flex-col gap-2"
        )}
      >
        <ScrollArea className="transition-all duration-300">
          {games && games.length > 0 ? (
            <div className="pb-4 ">
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
                    <CardContent className="relative aspect-[3/4] p-0 z-10">
                      {selectedGame && selectedGame === game.id && (
                        <button
                          className="group absolute right-1 top-1 transform z-50 cursor-pointer"
                          onClick={handleClear}
                        >
                          <div className="flex h-5 w-5 items-center justify-center rounded-md border border-solid border-gray-500 bg-white transition-all duration-300 hover:h-6 hover:w-6 dark:border-gray-400 dark:bg-slate-800">
                            <X
                              className="text-gray-500 dark:text-gray-400"
                              width={16}
                              height={16}
                            />
                          </div>
                        </button>
                      )}
                      <div
                        className={cn(
                          " w-full h-full bg-cover bg-center",
                          selectedGame && selectedGame == game.id
                            ? "border-primary border-4 "
                            : "border-none hover:scale-110 transition-all"
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
        <div className="flex items-center justify-between gap-4 bg-background w-full py-2">
          <div className="flex gap-4">
            <SearchGame
              games={games!}
              value={selectedGame}
              onChange={handleGameChange}
            />
            <SearchPlatform
              value={selectedPlatform}
              onChange={handlePlatformChange}
            />
          </div>
          <div className="flex gap-2">
            {
              (selectedGame || selectedPlatform) && (
                <Button variant={"outline"} onClick={() => { setSelectedGame(""); setSelectedPlatform("") }}>Temizle</Button>
              )
            }
            <Button variant={"secondary"} onClick={handleSearch}>Filtrele</Button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          isScrolled ? "h-[calc(100vh-160px)] " : "h-[calc(100vh-400px)]",
          "overflow-y-auto transition-all duration-300"
        )}
        onScroll={handleScroll}
      >
        <div className="py-4 flex flex-col">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 pr-3">
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : !!selectedGameBodies.length ? (
              selectedGameBodies.map((advert) => (
                <AdvertCard key={advert.id} advert={advert!} />
              ))
            ) : (
              <div className="flex">Henüz Oyuna ait ilan yok</div>
            )}
          </div>
        </div>
      </div>
      <CreateGameMate
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        games={games!}
      />
    </div>
  );
};

export default BrowseContent;
