"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Skeleton bileşeni eklenmeli
import { Avatar } from "@/components/ui/avatar";
import React from "react";

const PostSkeleton: React.FC = () => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-4">
          <Avatar>
            <Skeleton className="w-10 h-10" /> {/* Avatar için iskelet */}
          </Avatar>
          <div className="flex flex-col">
            <Skeleton className="w-32 h-4 mb-1" /> {/* Kullanıcı adı için iskelet */}
            <Skeleton className="w-24 h-4" /> {/* Tarih için iskelet */}
          </div>
        </div>
      </div>
      <CardContent className="flex flex-col space-y-2 p-0 pb-4">
        <Skeleton className="w-full h-40 mb-2" /> {/* Post içeriği için iskelet */}
        <div className="flex gap-4 items-center">
          <Skeleton className="w-5 h-5" />
          <Skeleton className="w-5 h-5" />
          <Skeleton className="w-5 h-5" />
        </div>
      </CardContent>
    </Card>
  );
};

export default PostSkeleton;
