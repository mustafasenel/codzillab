import { useEffect, useState } from "react";
import { usePusher } from "@/context/PusherProvider"; // Import your existing Pusher context

export const usePusherConnectionStatus = () => {
  const { pusher } = usePusher(); // Access Pusher instance from context
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!pusher) return;

    // Event listener to track the Pusher connection status
    const handleConnectionStateChange = () => {
      setIsConnected(pusher.connection.state === "connected");
    };

    // Initial state
    handleConnectionStateChange();

    // Listen for changes in connection state
    pusher.connection.bind("state_change", handleConnectionStateChange);

    // Cleanup listener on unmount
    return () => {
      pusher.connection.unbind("state_change", handleConnectionStateChange);
    };
  }, [pusher]); // Re-run when the pusher instance changes

  return isConnected;
};
