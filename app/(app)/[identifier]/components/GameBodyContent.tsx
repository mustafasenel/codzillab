import { FullGameBodyType, FullUserType } from '@/types';
import React from 'react'
import AdvertCard from '../../app/friend-requests/components/AdvertCard';
import { Card, CardContent } from '@/components/ui/card';

interface GameBodyContentProps {
    user: FullUserType;
    userGameBodyAdverts?: FullGameBodyType[] | [];
}

const GameBodyContent:React.FC<GameBodyContentProps> = ({ user, userGameBodyAdverts }) => {
  return (
    <div className='flex flex-col gap-4'>
      {
        !!userGameBodyAdverts?.length ? (
            userGameBodyAdverts.map((advert, index) => (
                <AdvertCard key={index} advert={advert} />
            ))
        ) : (
            <Card className='md:h-60 h-32 flex items-center justify-center'> 
                <CardContent>
                    <p className='text-muted-foreground'>Arkadaşlık ilanı bulunmamaktadır{userGameBodyAdverts?.length}</p>
                </CardContent>
            </Card>
        )
      }
    </div>
  )
}

export default GameBodyContent
