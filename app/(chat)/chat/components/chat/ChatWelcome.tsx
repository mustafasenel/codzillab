"use client"

import { Hash } from "lucide-react";

interface ChatWelcomeProps {
    name: string,
    type: "channel" | "conversation";
}

const ChatWelcome = ({ name, type }: ChatWelcomeProps) => {
  return (
    <div className="space-y-2 px-4 mb-4">
      {type === "channel" && (
        <div className="h-[75px] w-[75px] rounded-full bg-slate-500 dark:bg-slate-700 flex items-center justify-center">
            <Hash className="h-12 w-12 text-white"/>
        </div>
      )}
      <p className="text-xl md:text-3xl font-bold">
        {type === "channel" ? `#${name} kanalına hoşgeldiniz` : `${name}`}
      </p>
      <p className="text-slate-600 dark:text-slate-400 text-sm">
        {type === "channel"
            ? `Burası #${name} kanalının başlangıcıdır.`
            : `Burası ${name} ile olan sohbetinizin başlangıcıdır.`
        }
      </p>
    </div>
  )
}

export default ChatWelcome
