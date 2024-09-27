"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FullGameBodyType, FullUserType } from "@/types";
import React, { useState } from "react";
import { Search } from "./search";
import BrowseContent from "./BrowseContent";
import { Game } from "@prisma/client";
import MyRequests from "./MyRequests";
import { CreateGameMate } from "./CreateGameMate";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface MainCompProps {
  user: FullUserType;
  games?: Game[] | [] | undefined;
  userGameBodyAdverts?: FullGameBodyType[] | [] | undefined;
}

const MainComp: React.FC<MainCompProps> = ({
  user,
  games,
  userGameBodyAdverts,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pathname = usePathname()

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div>
      <div className="space-y-4">
        <div className="flex items-start space-y-2 md:space-y-0 md:items-center justify-start md:justify-between md:flex-row flex-col w-full">
          <div className="grid grid-cols-2 gap-4 w-full md:w-96 h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground ">
            <Link
              className={cn(
                pathname == "/app/friend-requests/me" && "bg-background text-foreground",
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
              )}
              href={"/app/friend-requests/me"}
            >
              Benim İlanlarım
            </Link>
            <Link
              className={cn(
                pathname == "/app/friend-requests" && "bg-background text-foreground",
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
              )}
              href={"/app/friend-requests"}
            >
              Keşfet
            </Link>
          </div>
          <div className="flex items-center gap-4 md:justify-start justify-between w-full md:w-fit">
            <Search />
            <Button onClick={handleOpenModal}>Oluştur</Button>
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

export default MainComp;
