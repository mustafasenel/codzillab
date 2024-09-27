import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { platforms } from "@/utils/platforms";
import { Check, ChevronsUpDown } from "lucide-react";
import React from "react";

interface SearchPlatformProps {
    onChange: (value:string) => void;
    value: string
}

const SearchPlatform:React.FC<SearchPlatformProps> = ({ onChange, value }) => {
  return (
    <div className="flex w-72"> 
      <Popover>
        <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="justify-between w-72"
            >
              {value ? value : "Platform'a göre ara"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 z-10">
          <Command>
            <CommandInput placeholder="Tür ara..." />
            <CommandList className="overflow-y-auto">
              <CommandEmpty>Platform bulunamadı.</CommandEmpty>
              <CommandGroup className="overflow-y-auto">
                {platforms.map((gameItem) => (
                  <CommandItem
                    key={gameItem.label}
                    value={gameItem.label}
                    onSelect={() => onChange(gameItem.label)}
                    className="justify-start flex"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        value === gameItem.label
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    {gameItem.label}
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

export default SearchPlatform;
