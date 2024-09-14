"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FullGameBodyType } from "@/types";
import {
  format,
  formatDistanceToNowStrict,
  isWithinInterval,
  subWeeks,
} from "date-fns";
import { tr } from "date-fns/locale";
import { Calendar, Eye, MapPin, User, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface AdvertCardProps {
  advert: FullGameBodyType;
}

const AdvertCard: React.FC<AdvertCardProps> = ({ advert }) => {
  const [displayDate, setDisplayDate] = useState<string>("");
  useEffect(() => {
    const oneWeekAgo = subWeeks(new Date(), 1);
    const isRecent = isWithinInterval(advert.createdAt, {
      start: oneWeekAgo,
      end: new Date(),
    });

    let relativeTime = formatDistanceToNowStrict(advert.createdAt, {
      addSuffix: false,
      locale: tr, // Türkçe lokalizasyon kullanımı
    });
    relativeTime = relativeTime
      .replace("minutes", "dk")
      .replace("hours", "sa")
      .replace("seconds", "sn");

    setDisplayDate(
      isRecent
        ? relativeTime
        : format(advert.createdAt, "d MMMM", { locale: tr })
    );
  }, [advert.createdAt]);
  return (
    <Card className="relative hover:shadow-sm border transition overflow-hidden rounded-lg h-full min-h-52 flex flex-col p-0">
      <div className="flex-1 space-y-2 flex sm:flex-row flex-col">
        <div className="relative w-full sm:w-1/4 min-h-32 overflow-hidden border-b">
          <Image
            src={
              advert.game.image
                ? advert.game.image
                : "https://avatars.githubusercontent.com/u/93220191?v=4"
            }
            alt={"image"}
            className="object-cover"
            quality={100}
            fill
          />
          <Badge className="absolute top-1 left-1 px-1">{advert.game.name}</Badge>
          <div className="absolute bottom-1 left-1 flex flex-wrap gap-1">
            {advert.game.genre.slice(0, 2).map((genre, index) => (
              <Badge key={index} variant="secondary">
                {genre}
              </Badge>
            ))}
          </div>
        </div>
        <Link
          href={`/`}
          className="flex flex-1 flex-col pt-2 px-3 space-y-4 w-full sm:w-3/4 justify-between"
        >
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between">
              <Link
                href={`/${advert.user.username}`}
                className="flex items-center space-x-4"
              >
                <Avatar>
                  <AvatarImage
                    src={
                      advert.user?.image
                        ? advert.user?.image
                        : "https://avatars.githubusercontent.com/u/93220191?v=4"
                    }
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-between py-1">
                  <span className="text-sm font-semibold">
                    {advert.user.name} {advert.user.surname}
                  </span>
                  <span className="text-xs font-light">
                    @{advert.user.username}
                  </span>
                </div>
              </Link>
              <span
                className={cn(
                  "flex items-center justify-between gap-1 py-0 px-0 text-xs h-fit",
                  badgeVariants({ variant: "secondary" })
                )}
              >
                {advert.type == "TEAMMATE" ? (
                  <Users className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}

                <p>
                  {advert.type == "TEAMMATE" ? (
                    <span>Takım arkadaşı</span>
                  ) : (
                    <span>Oyun arkadaşı</span>
                  )}
                </p>
              </span>
            </div>
            <div className="text-sm md:text-lg font-semibold group-hover:text-slate-500 transition line-clamp-2">
              {advert.title}
            </div>
            <div className="text-sm font-light truncate">
              {advert.description}
            </div>
          </div>
          <div className=" flex items-center justify-between pb-3">
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <span className="flex gap-1 flex-nowrap text-nowrap items-center">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs">{displayDate}</span>
                </span>
                <span className="flex gap-1 flex-nowrap text-nowrap items-center">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs">12</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-5 w-5" />
              <span className="text-xs font-light">Ankara</span>
            </div>
          </div>
        </Link>
      </div>
    </Card>
  );
};

export default AdvertCard;
