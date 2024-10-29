"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { FullUserType } from "@/types";
import { Card } from "@/components/ui/card";
import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
import UserCard from "./UserCard";
import { User } from "@prisma/client";
import Search from "@/components/search";
import UserCardSkeletton from "./UserCardSkeletton";

interface FriendsExploreProps {
  currentUser: User;
}

const FriendsExplore: React.FC<FriendsExploreProps> = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState(""); // Arama terimi için state
  const [searchQuery, setSearchQuery] = useState(""); // Butonla yapılacak arama için state

  const fetchPosts = async ({
    pageParam = 0,
  }: QueryFunctionContext): Promise<FullUserType[]> => {
    const take = 8;
    const response = await fetch(
      `/api/users/getUsers?skip=${pageParam}&take=${take}&search=${searchQuery}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    if (!Array.isArray(data.users)) return [];
    return data.users;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<FullUserType[], Error>({
    queryKey: ["users", searchQuery],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 8 ? allPages.length * 8 : undefined,
    initialPageParam: 0,
  });

  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
      });
      if (node) observerRef.current.observe(node);
    },
    [isLoading, isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  // Butona tıklandığında yapılacak arama
  const handleSearchClick = () => {
    setSearchQuery(searchTerm); // Kullanıcının girdiği arama terimini kullan
  };

  return (
    <div className="flex flex-col space-y-4 pb-20">
      {/* Sabit Arama Kutusu */}
      <div className="flex items-center space-x-2">
        <Search
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={handleSearchClick}
        />
      </div>

      {/* İçerik Alanı */}
      {error && (
        <div className="mt-4">
          <Card className="w-full h-40 flex items-center justify-center">
            <h2 className="text-sm text-red-500">
              Error occurred: {error.message}
            </h2>
          </Card>
        </div>
      )}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
          <UserCardSkeletton />
          <UserCardSkeletton />
          <UserCardSkeletton />
          <UserCardSkeletton />
        </div>
      ) : !data?.pages.length ? (
        <div className="mt-4">
          <Card className="w-full h-40 flex items-center justify-center">
            <h2 className="text-sm">User bulunamadı</h2>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
          {data.pages.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.map((user, postIndex) => (
                <UserCard
                  key={user.id}
                  user={user}
                  currentUser={currentUser}
                  ref={
                    pageIndex === data.pages.length - 1 &&
                    postIndex === page.length - 1
                      ? lastPostRef
                      : undefined
                  }
                />
              ))}
            </React.Fragment>
          ))}
          {isFetchingNextPage && <div>Loading more...</div>}
        </div>
      )}
    </div>
  );
};

export default FriendsExplore;
