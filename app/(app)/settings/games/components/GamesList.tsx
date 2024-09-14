"use client"

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Game } from '@prisma/client'
import React, { useState } from 'react'
import { AddGame } from './AddGameModal'

interface GamesListProps {
  games?: Game[]
}

const GamesList: React.FC<GamesListProps> = ({ games }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);

    const handleOpenModal = (game: Game) => {
        setSelectedGame(game);
        setIsModalOpen(true);
        console.log(game)
      };
    
      const handleCloseModal = () => {
        setSelectedGame(null);
        setIsModalOpen(false);
      }    

  return (
    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8">
      {games && games.length > 0 ? (
        <>
          {games.map((game, index) => (
            <Card key={index} className="flex flex-col w-full rounded-xl overflow-hidden border-none cursor-pointer " onClick={() => handleOpenModal(game)}>
              {/* Dynamically resizing background image */}
              <CardContent className="aspect-[3/4] p-0 hover:scale-110 transition-all ">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${game.image})` }}
                ></div>
              </CardContent>
              <CardFooter className="flex flex-col items-start space-y-1 pt-2 px-2 pb-2">
                <h2 className="font-semibold">{game.name}</h2>
                <div className="flex flex-wrap gap-1">
                  {game.genre.map((genre, index) => (
                    <Badge key={index} variant="outline">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </CardFooter>
            </Card>
          ))}
        </>
      ) : (
        <div>Henüz Oyun Eklenmedi</div>
      )}
      <AddGame isOpen={isModalOpen} onClose={handleCloseModal} game={selectedGame}/>
    </div>
  )
}

export default GamesList
