"use client";

import { FullOrganizationType, FullPostType, FullUserType } from "@/types";
import CreatePost from "../../app/components/CreatePost";
import { Card } from "@/components/ui/card";
import PostSkeleton from "../../app/components/PostSkeletton";
import React, { useCallback, useRef } from "react";
import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
import PostItem from "../../app/components/PostItem";

interface PostContentProps {
  user?: FullUserType | FullOrganizationType | null;
  currentUser?: FullUserType | null;
}

const PostContent: React.FC<PostContentProps> = ({ user, currentUser }) => {
  const fetchPosts = async ({
    pageParam = 0,
  }: QueryFunctionContext): Promise<FullPostType[]> => {
    const take = 10;

    let organizationId = "";
    let userId = "";
    console.log("USERID :", user?.id)
    if (isFullUserType(user)) {
        userId = user.id
    } else if (isFullOrganizationType(user)) {
      organizationId = user.id
    }
    const response = await fetch(
      `/api/post/getUserPosts?skip=${pageParam}&take=${take}&userId=${userId}&organizationId=${organizationId}`
    );
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

  function isFullUserType(user: FullUserType | FullOrganizationType | null | undefined): user is FullUserType {
    return (user as FullUserType)?.username !== undefined;
  }
  
  function isFullOrganizationType(user: FullUserType | FullOrganizationType | null | undefined): user is FullOrganizationType {
    return (user as FullOrganizationType)?.slug !== undefined;
  }

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<FullPostType[], Error>({
    queryKey: ["userPosts"],
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

  return (
    <>
      {isLoading && <PostSkeleton />}
      {error && <div>An error occurred: {error.message}</div>}
      {!isLoading && !error && (
        <div className="flex flex-col gap-4">
          {(user?.id === currentUser?.id ||
            (user as FullOrganizationType)?.ownerId === currentUser?.id) && (
            <CreatePost
              user={currentUser!}
              isOrganization={!!(user as FullOrganizationType).ownerId}
              identifier={user}
            />
          )}
          {!data?.pages[0].length ||
          (data?.pages[0].length === 0 && !data.pages[0]?.length) ? (
            <div>
              <Card className="w-full h-40 flex items-center justify-center">
                <h2 className="text-sm">Henüz post oluşturulmadı.</h2>
              </Card>
            </div>
          ) : (
            <div className="w-full flex flex-col space-y-4">
              {data.pages.map((page, pageIndex) => (
                <React.Fragment key={pageIndex}>
                  {page.map((post, postIndex) => (
                    <PostItem
                      key={post.id}
                      post={post}
                      currentUser={currentUser!}
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
              {isFetchingNextPage && <PostSkeleton />}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PostContent;
