"use client";

import { FullPostType, FullUserType } from "@/types";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import PostItem from "./PostItem";
import PostSkeleton from "./PostSkeletton";

interface TimelineProps {
  user: FullUserType;
}

const Timeline: React.FC<TimelineProps> = ({ user }) => {
  const { data, error, isLoading } = useQuery<FullPostType[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch("/api/post/getPosts/feed");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  // Hata kontrolü
  if (error) {
    console.error("Error fetching posts:", error);
    return <div>An error occurred: {error.message}</div>;
  }

  if (isLoading) {
      return <PostSkeleton />
  }

  if (!data) {
    return (
      <div>
        <Card className="w-full h-40 flex items-center justify-center">
          <h2 className="text-sm">Post bulunamadı</h2>
        </Card>
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col space-y-4">
      {data.map((post, index) => (
          <PostItem key={index} post={post} currentUser={user}/>
      ))}
    </div>
  );
};

export default Timeline;
