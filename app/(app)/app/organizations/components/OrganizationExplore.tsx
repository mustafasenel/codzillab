"use client";

import { FullOrganizationType } from "@/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import OrganizationCard from "./OrganizationCard";
import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
import Search from "@/components/search";
import UserCardSkeletton from "../../friends/components/UserCardSkeletton";

interface OrganizationsProps {
  organizations?: FullOrganizationType[] | [];
  currentUser: User;
}

const OrganizationExplore: React.FC<OrganizationsProps> = ({
  organizations,
  currentUser,
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(""); // Arama terimi için state
  const [searchQuery, setSearchQuery] = useState(""); // Butonla yapılacak arama için state

  const fetchPosts = async ({
    pageParam = 0,
  }: QueryFunctionContext): Promise<FullOrganizationType[]> => {
    const take = 8;
    const response = await fetch(
      `/api/organizations/getOrganizations?skip=${pageParam}&take=${take}&search=${searchQuery}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    if (!Array.isArray(data.organizations)) return [];
    return data.organizations;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<FullOrganizationType[], Error>({
    queryKey: ["organizations", searchQuery],
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
    <div className="flex flex-col space-y-4">
      {/* Sabit Arama Kutusu */}
      <div className="sticky top-0 z-10 flex items-center justify-between space-x-2">
        <Search
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={handleSearchClick}
        />
        <Button onClick={() => router.push("/settings/organizations")}>
          Oluştur
        </Button>
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
                <OrganizationCard
                  key={user.id}
                  organization={user}
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

export default OrganizationExplore;
