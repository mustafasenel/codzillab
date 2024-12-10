"use client"

import { User } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";


interface MediaRoomProps {
    chatId: string;
    audio: boolean;
    video: boolean;
    user: User
}

const MediaRoom = ({user, chatId, audio, video }: MediaRoomProps) => {
  
    const [token, setToken] = useState("");

    useEffect(() => {
        if (!user?.name || !user?.surname) return;

        const name = `${user.name} ${user.surname}`;

        (
            async () => {
                try {
                    const resp = await fetch(`/api/livekit?room=${chatId}&username=${name}`);
                    const data = await resp.json();
                    setToken(data.token);
                } catch (error) {
                    console.log(error)
                }
            }
        )();
    }, [user?.name, user?.surname, chatId])

    if (token === "") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 
                    className="h7 w-7 text-slate-500 animate-spin my-4"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Yükleniyor...
                </p>
            </div>
        )
    }
    return (
    <LiveKitRoom
        data-lk-theme="default"
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        token={token}
        connect={true}
        video={video}
        audio={audio}
    >
        <VideoConference />
    </LiveKitRoom>
  )
}

export default MediaRoom
