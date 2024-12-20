import { useSocket } from "@/context/socket-provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";

interface ChatQueryProps {
    queryKey: string;
    apiUrl: string;
    paramKey: "channelId" | "conversationId";
    paramValue: string
}

export const useChatQuery = ({ queryKey, apiUrl, paramKey, paramValue }: ChatQueryProps) => {
    const { isConnected } = useSocket();

    const fetchMessages = async ({ pageParam = undefined }) => {
        const url = qs.stringifyUrl({
            url: apiUrl,
            query: {
                cursor: pageParam,
                [paramKey]: paramValue,
            }
        }, { skipNull: true });

        const res = await fetch(url);
        if (!res.ok) {
            throw new Error("Failed to fetch messages");
        }
        return res.json();
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMessages,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        initialPageParam: undefined, // Add this line
    });

    return {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    }


};

