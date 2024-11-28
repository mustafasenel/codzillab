import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { FullUserType } from '@/types'
import Image from 'next/image'
import React from 'react'

interface FavoriteGamesProps {
    user?: FullUserType | null
}

const FavoriteGames:React.FC<FavoriteGamesProps> = ({ user }) => {
  return (
    <div className='grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4'>
      {
        !!user?.UserGames?.length ? (
            user?.UserGames.map((game, index) => (
                <Card key={index} className="flex flex-col w-full rounded-xl overflow-hidden border-none cursor-pointer ">
                {/* Dynamically resizing background image */}
                <CardContent className="aspect-[3/4] p-0 hover:scale-110 transition-all ">
                  <div
                    className="w-full h-full bg-cover bg-center"
                  >
                    <Image
                      src={game.game?.image!}
                      alt={game.game?.image!}
                      width={300}
                      height={300}
                      placeholder='blur'
                      blurDataURL={game.game?.image!}
                      quality={100}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start space-y-1 pt-2 px-2 pb-2">
                  <h2 className="font-semibold">{game.game?.name}</h2>
                  <div className="flex flex-wrap gap-1">
                    {game.game?.genre.map((genre, index) => (
                      <Badge key={index} variant="outline">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            ))
        ) : (
            <Card className='md:h-60 h-32 flex items-center justify-center'> 
                <CardContent>
                    <p className='text-muted-foreground'>Favori oyun bulunmamaktadır</p>
                </CardContent>
            </Card>
        )
      }
    </div>
  )
}

export default FavoriteGames
