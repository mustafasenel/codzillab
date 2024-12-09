"use client"

import React, { createContext, useContext, useEffect, useState } from "react";
import Pusher from "pusher-js"; // Correct import of Pusher constructor

type PusherContextType = {
  pusher: Pusher | null;
  channel: any; // Use 'any' for channel as it's dynamically created
};

const PusherContext = createContext<PusherContextType | undefined>(undefined);

interface PusherProviderProps {
  children: React.ReactNode;
  channelName: string; // Accept channelName as a prop
}

export const PusherProvider: React.FC<PusherProviderProps> = ({ children, channelName }) => {
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [channel, setChannel] = useState<any>(null); // 'any' type here for the channel

  useEffect(() => {
    // Initialize Pusher connection
    const pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    // Subscribe to the dynamic channel passed as a prop
    const channelInstance = pusherInstance.subscribe(channelName);

    setPusher(pusherInstance);
    setChannel(channelInstance);

    // Cleanup on unmount
    return () => {
      if (pusherInstance) {
        pusherInstance.unsubscribe(channelName);
      }
    };
  }, [channelName]); // Dependency on channelName to re-subscribe when it changes

  return (
    <PusherContext.Provider value={{ pusher, channel }}>
      {children}
    </PusherContext.Provider>
  );
};

// Custom hook to use Pusher context
export const usePusher = (): PusherContextType => {
  const context = useContext(PusherContext);
  if (!context) {
    throw new Error("usePusher must be used within a PusherProvider");
  }
  return context;
};
