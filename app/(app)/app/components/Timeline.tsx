"use client";

import { FullPostType, FullUserType } from "@/types";
import React, { useRef, useCallback } from "react";
import { useInfiniteQuery, QueryFunctionContext } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import PostItem from "./PostItem";
import PostSkeleton from "./PostSkeletton";

interface TimelineProps {
  user: FullUserType;
}

const Timeline: React.FC<TimelineProps> = ({ user }) => {
  const fetchPosts = async ({ pageParam = 0 }: QueryFunctionContext): Promise<FullPostType[]> => {
    const take = 10; // Her istekte kaç post getirileceği
    const response = await fetch(`/api/post/getPosts/feed?skip=${pageParam}&take=${take}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // API yanıtını kontrol et
    if (!Array.isArray(data.posts)) {
      console.error("Posts is not an array:", data.posts);
      return []; // Boş bir dizi döndür
    }

    return data.posts; // Dizi olarak döndür
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<FullPostType[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length * 10 : undefined; // Eğer son sayfa 10 post içeriyorsa, bir sonraki sayfa parametresi döndür
    },
    initialPageParam: 0,
  });

  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetchingNextPage) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        const firstEntry = entries[0];

        if (firstEntry.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);

      return () => {
        if (observerRef.current) observerRef.current.disconnect();
      };
    },
    [isLoading, isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  if (isLoading) {
    return <div className="w-full flex flex-col space-y-4">
    <PostSkeleton />
    <PostSkeleton />
    <PostSkeleton />
    </div>;
  }

  if (error) {
    console.error("Error fetching posts:", error);
    return <div>An error occurred: {error.message}</div>;
  }

  if (!data?.pages.length) {
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
      
      {data.pages.map((page, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {page.map((post, postIndex) => (
            <PostItem
              key={post.id}
              post={post}
              currentUser={user}
              ref={pageIndex === data.pages.length - 1 && postIndex === page.length - 1 ? lastPostRef : undefined} // Son post'a referans ver
            />
          ))}
        </React.Fragment>
      ))}
      {isFetchingNextPage && <PostSkeleton />} {/* Yeni sayfa yüklenirken skeleton göster */}
    </div>
  );
};

export default Timeline;
