"use client"

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Game } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

interface SearchGameProps {
  games: Game[];
  onChange: (value: string) => void; // value olarak id dönecek
  value: string; // seçilen id
}

const SearchGame: React.FC<SearchGameProps> = ({ games, onChange, value }) => {
  const [selectedName, setSelectedName] = useState<string>(""); // Seçilen oyunun ismini tutacak state

  const handleSelect = (gameItem: Game) => {
    onChange(gameItem.id); // Id'yi dışarıya iletin
    setSelectedName(gameItem.name); // İsmi de UI'da göstermek için set edin
  };

  return (
    <div className="flex w-72">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="justify-between w-72"
          >
            {selectedName ? selectedName : "Oyun adına göre ara"} {/* İsmi göster */}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 z-10">
          <Command>
            <CommandInput placeholder="Oyun ara..." />
            <CommandList className="overflow-y-auto">
              <CommandEmpty>Oyun bulunamadı.</CommandEmpty>
              <CommandGroup className="overflow-y-auto">
                {games.map((gameItem) => (
                  <CommandItem
                    key={gameItem.id}
                    value={gameItem.name}
                    onSelect={() => handleSelect(gameItem)} // Id ve isim beraber işlenecek
                    className="justify-start flex"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        value === gameItem.id
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    <div className="flex items-center justify-start gap-2">
                      <Image
                        src={gameItem.image ? gameItem.image : "symbol.png"}
                        alt="gameImage"
                        width={30}
                        height={30}
                        unoptimized
                      />
                      {gameItem.name}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SearchGame;
