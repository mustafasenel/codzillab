"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { FullGameBodyType, FullUserType } from "@/types";
import { Game } from "@prisma/client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import AdvertCard from "./AdvertCard";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import SkeletonCard from "./SkeletonCard";
import SearchGame from "./SearchGame";
import SearchPlatform from "./SearchPlatform";
import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";

interface BrowseContentProps {
  user: FullUserType;
  games?: Game[] | [];
}

const BrowseContent: React.FC<BrowseContentProps> = ({ user, games }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  const [selectedGames, setSelectedGames] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");

  // Temporary state to hold the selections
  const [tempSelectedGames, setTempSelectedGames] = useState("");
  const [tempSelectedPlatform, setTempSelectedPlatform] = useState("");

  const fetchGameBodies = async ({
    pageParam = 0,
  }: QueryFunctionContext): Promise<FullGameBodyType[]> => {
    const take = 8;
    const response = await fetch(
      `/api/gamebody/gamebodies?skip=${pageParam}&take=${take}&gameId=${selectedGames}&platformId=${selectedPlatform}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    if (!Array.isArray(data.gameBodies)) return [];
    return data.gameBodies;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery<FullGameBodyType[], Error>({
    queryKey: ["gamebodies", selectedGames, selectedPlatform],
    queryFn: fetchGameBodies,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 8 ? allPages.length * 8 : undefined,
    initialPageParam: 0,
  });

  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastAdvertRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
      });
      if (node) observerRef.current.observe(node);
    },
    [isLoading, isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  const handleGameClick = (gameId: string) => {
    setSelectedGames(gameId); // Sets the selected game, which will automatically trigger a refetch due to the queryKey dependency
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = event.currentTarget.scrollTop;
    if (scrollTop > 20) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  const handleSearch = () => {
    setSelectedGames(tempSelectedGames); // Update the selected games
    setSelectedPlatform(tempSelectedPlatform); // Update the selected platform
    refetch(); // Trigger the fetching
  };
  const handleClear = () => {
    setSelectedGames("");
    setSelectedPlatform("");
    setTempSelectedGames("");
    setTempSelectedPlatform("");
    refetch();
  };
  return (
    <div className="">
      <div
        className={cn(
          "overflow-hidden flex flex-col gap-2"
        )}
      >
        <ScrollArea className="transition-all duration-300 max-w-5xl">
          {games && games.length > 0 ? (
            <div className="pb-4 ">
              <div className="flex space-x-4">
                {games.map((game) => (
                  <Card
                    key={game.id} // Öğe ID'si kullanılmalı
                    className={cn(
                      "flex-shrink-0 w-32 overflow-hidden cursor-pointer rounded-none shadow-none border-none"
                    )}
                    onClick={() => handleGameClick(game.id)}
                  >
                    <CardContent className="relative aspect-[3/4] p-0 z-10">
                      <div
                        className={cn(
                          " w-full h-full bg-cover bg-center",
                          selectedGames && selectedGames == game.id
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
                    {/* <CardFooter className="flex flex-col items-start space-y-1 pt-2 px-1 pb-2">
                      <h2 className="text-xs">{game.name}</h2>
                    </CardFooter> */}
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
              value={tempSelectedGames} // Use temporary state here
              onChange={setTempSelectedGames} // Update temporary state on change
            />
            <SearchPlatform
              value={tempSelectedPlatform} // Use temporary state here
              onChange={setTempSelectedPlatform} // Update temporary state on change
            />
          </div>
          <div className="flex gap-2">
            {(tempSelectedGames || tempSelectedPlatform) && (
              <Button
                variant={"outline"}
                onClick={handleClear}
              >
                Temizle
              </Button>
            )}
            <Button variant={"secondary"} onClick={handleSearch}>
              Filtrele
            </Button>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "overflow-y-auto transition-all duration-300"
        )}
      >
        <div className="py-4 flex flex-col">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 pr-3">
            {isLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : data &&
              data.pages.length > 0 &&
              data.pages.flat().length > 0 ? (
              data.pages
                .flat()
                .map((advert) => (
                  <AdvertCard
                    key={advert.id}
                    advert={advert}
                    ref={lastAdvertRef}
                  />
                ))
            ) : (
              <div className="flex">Henüz Oyuna ait ilan yok</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseContent;
