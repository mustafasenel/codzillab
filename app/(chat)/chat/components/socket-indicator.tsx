"use client"

import { Badge } from "@/components/ui/badge"
import { useSocket } from "@/context/socket-provider"



const SocketIndicator = () => {
    const { isConnected } = useSocket()
    if (!isConnected) {

        return (
          <Badge variant="outline" className="bg-yellow-600 text-white border-none">
            Fallback: Polling every is
          </Badge>
        )
    }

    return (
        <Badge variant="outline" className="bg-emerald-600 text-white border-none">
          Live: Real-time update
        </Badge>
      )
}

export default SocketIndicator
