"use client"

import { useSocket } from "@/context/socket-provider";

const SocketIndicator = () => {
  const isConnected = useSocket();
    if (!isConnected) {

        return (
          <div className="bg-yellow-600 text-white border-none rounded-full w-4 h-4"/>

        )
    }

    return (
        <div className="bg-emerald-600 text-white border-none rounded-full w-4 h-4" />
      )
}

export default SocketIndicator
