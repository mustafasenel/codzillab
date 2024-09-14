"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { FullUserType } from "@/types";
import { Game } from "@prisma/client";
import React from "react";

interface BrowseContentProps {
  user: FullUserType;
  games?: Game[] | [];
}

const BrowseContent: React.FC<BrowseContentProps> = ({ user, games }) => {
  return (
    <>
  <TabsContent value="browseRequests">
    <ScrollArea>

    {games && games.length > 0 ? (
      <div className="overflow-x-auto pb-4"> {/* Allow horizontal scrolling and prevent wrapping */}
        <div className="flex space-x-4"> {/* Flex container for horizontal alignment */}
          {games.map((game, index) => (
            <Card
              key={index}
              className="flex-shrink-0 w-32 rounded-xl overflow-hidden border-none cursor-pointer" // Ensure cards don't shrink
              onClick={() => {}}
            >
              {/* Dynamically resizing background image */}
              <CardContent className="aspect-[3/4] p-0 hover:scale-110 transition-all">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${game.image})` }}
                ></div>
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
  </TabsContent>
</>

  );
};

export default BrowseContent;
