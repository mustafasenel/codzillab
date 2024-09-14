"use client";

import React, { useState } from "react";
import { AddGame } from "./AddGameModal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import GamesList from "./GamesList";
import { Game } from "@prisma/client";

interface GamesCompProps {
  games?: Game[];
}

const GamesComp:React.FC<GamesCompProps> = ({ games }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  return (
    <div className="flex flex-col space-y-6">
      <div>
        <Button onClick={handleOpenModal}>Yeni Oyun Ekle</Button>
      </div>
      <Separator />
      <GamesList games={games!}/>
      <AddGame isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default GamesComp;
