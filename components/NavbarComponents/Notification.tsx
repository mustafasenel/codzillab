import { FullNotificationType } from "@/types";
import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import { Icons } from "../icons";
import { format, formatDistanceToNow, isWithinInterval, subWeeks } from "date-fns";
import { tr } from "date-fns/locale";

// Fetch notifications from the API
const fetchNotifications = async ({
  pageParam = 0,
}: QueryFunctionContext): Promise<FullNotificationType[]> => {
  const take = 5; // Number of notifications to fetch
  const response = await fetch(`/api/notification/getNotifications?skip=${pageParam}&take=${take}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();

  if (!Array.isArray(data.notifications)) {
    console.error("notifications is not an array:", data.notifications);
    return [];
  }
  return data.notifications;
};

// Notification component
const Notification = () => {
  const router = useRouter();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<FullNotificationType[], Error>({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    getNextPageParam: (lastPage, allPages) => {
      const totalCommentsFetched = allPages.reduce((acc, page) => acc + page.length, 0);
      return lastPage.length === 5 ? totalCommentsFetched : undefined;
    },
    initialPageParam: 0,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <Icons.spinner className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  // Error state
  if (error) {
    return <div>Bildirimler yüklerken bir hata oluştu: {error.message}</div>;
  }

  // Utility function to format notification date
  const formatNotificationDate = (date:Date) => {
    const oneWeekAgo = subWeeks(new Date(), 1);
    const isRecent = isWithinInterval(date, {
      start: oneWeekAgo,
      end: new Date(),
    });

    let relativeTime = formatDistanceToNow(date, {
      addSuffix: true,
      locale: tr,
    });

    relativeTime = relativeTime
      .replace("minutes", "dk")
      .replace("hours", "sa")
      .replace("seconds", "sn");

    return isRecent ? relativeTime : format(date, "d MMMM", { locale: tr });
  };

  return (
    <div className="w-full flex flex-col">
      {data?.pages.flatMap((group) => group).length === 0 ? (
        <div className="text-center text-xs text-muted-foreground">
          Bildirim bulunamadı
        </div>
      ) : (
        data?.pages.flatMap((group) =>
          group.map((notification: FullNotificationType) => (
            <div
              key={notification.id} // Add a unique key for each notification
              className="flex gap-2 p-2 hover:cursor-pointer hover:dark:bg-slate-800 transition"
              onClick={() => router.push(`/${notification.actor.username}`)}
            >
              <div className="flex">
                <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                  <AvatarImage
                    src={
                      notification.actor.image
                        ? notification.actor.image
                        : "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E"
                    }
                    alt="Avatar"
                  />
                  <AvatarFallback>JL</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col space-y-1">
                <div className="flex space-x-2">
                  <p className="font font-semibold text-xs">
                    @{notification.actor.username}{" "}
                  </p>
                  {notification.type === "LIKE" ? (
                    <p className="text-xs text-muted-foreground truncate text-wrap">
                      {" "}
                      gönderini beğendi
                    </p>
                  ) : notification.type === "COMMENT" ? (
                    <p className="text-xs text-muted-foreground truncate text-wrap">
                      {" "}
                      gönderine yorum yaptı
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground truncate text-wrap">
                      {" "}
                      gönderiye tepki verdi
                    </p>
                  )}
                </div>
                <span className="text-muted-foreground text-xs">
                  {formatNotificationDate(new Date(notification.createdAt))}
                </span>
                {
                  notification.type === "COMMENT" && (
                    <span className="text-muted-foreground truncate text-wrap text-xs">
                    {notification.content}
                  </span>
                  )
                }
              </div>
            </div>
          ))
        )
      )}
      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} variant="link">
          Daha Fazla yükle
        </Button>
      )}
      {isFetchingNextPage && !hasNextPage ? <div>Yükleniyor...</div> : null}
    </div>
  );
};

export default Notification;
