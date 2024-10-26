"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Skeleton bileşeni eklenmeli
import { Avatar } from "@/components/ui/avatar";
import React from "react";

const UserCardSkeletton: React.FC = () => {
  return (
    <Card className="p-0 flex flex-col">
    {/* Arka Plan Görsel Skeleton */}
    <div className="w-full h-24 rounded-t-xl" />

    {/* Profil Resmi Skeleton */}
    <div className="flex items-center justify-center -mt-14">
      <Skeleton className="w-28 h-28 rounded-full border-4" />
    </div>

    <div className="flex flex-col items-center space-y-2 py-4">
      {/* Organizasyon İsmi Skeleton */}
      <Skeleton className="h-5 w-32" />

      {/* Takipçi Sayısı Skeleton */}
      <Skeleton className="h-4 w-20" />

      {/* Takip Et Butonu Skeleton */}
      <div className="pt-2">
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>
    </div>
  </Card>
  );
};

export default UserCardSkeletton;
