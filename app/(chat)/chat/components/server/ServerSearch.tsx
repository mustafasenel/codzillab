"use client"

import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Search } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface ServerSearchProps {
    data: {
        label: string,
        type: "channel" | "member",
        data: {
            icon: React.ReactNode,
            name: string,
            id: string,
        }[] | undefined
    }[]
}

const ServerSearch = ({ data }: ServerSearchProps) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        }
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [])

    const onClick = ({ id, type }: { id:string, type: "channel" | "member" }) => {
        setOpen(false)

        if (type === "member") {
            return router.push(`/chat/servers/${params?.serverId}/conversations/${id}`);
        }

        if (type === "channel") {
            return router.push(`/chat/servers/${params?.serverId}/channels/${id}`);
        }
    }

  return (
    <>
      <button
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-slate-800/10 dark:hover:bg-slate-900/50 transition"
        onClick={() => setOpen(true)}
      >
        <Search className="w-4 h-4 text-muted-foreground"/>
        <p className="font-semibold text-muted-foreground text-sm group-hover:text-primary transition">
            Ara
        </p>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted  px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
            <span className="text-xs">
                Ctrl
            </span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Kanal veya üye ara" />
        <CommandList>
            <CommandEmpty>
                Sonuç bulunamadı!
            </CommandEmpty>
            {data.map(({ label, type, data }) => {
                if (!data?.length) return null
                
                return (
                    <CommandGroup key={label} heading={label}>
                        {data?.map(({id, icon, name}) => {
                            return (
                                <CommandItem key={id} onSelect={() => onClick({ id, type })}>
                                    {icon}
                                    <span>{name}</span>
                                </CommandItem>
                            )
                        })}
                    </CommandGroup>
                )
            })}
        </CommandList>
      </CommandDialog>
    </>
  )
}

export default ServerSearch
