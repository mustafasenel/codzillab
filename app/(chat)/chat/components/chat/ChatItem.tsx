"use client"

import qs from "query-string";
import { Member, MemnerRole, User } from "@prisma/client";
import UserAvatar from "../user-avatar";
import ActionTooltip from "../ActionTooltip";
import { Edit, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { values } from "lodash";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useModal } from "@/hooks/use-modal";

interface ChatItemProps {
    id: string;
    content: string;
    member: Member & {
        profile: User
    };
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>
}

const roleIconMap  = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
}

const formShema = z.object({
    content: z.string().min(1),
});

const ChatItem = ({
    id,
    content,
    member,
    timestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery
}: ChatItemProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const { onOpen } = useModal();

    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.key === 'Escape') {
                setIsEditing(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [])

    const form = useForm<z.infer<typeof formShema>>({
        resolver: zodResolver(formShema),
        defaultValues: {
            content: content
        }
    });

    useEffect(() => {
        form.reset({
            content: content
        })
    }, [content])

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formShema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery
            });

            await axios.patch(url, values);

            form.reset();
            setIsEditing(false);
        } catch (error) {
            console.log(error)
        }
    }

    const fileType = fileUrl?.split(".").pop();

    const isAdmin = currentMember.role === MemnerRole.ADMIN;
    const isModerator = currentMember.role === MemnerRole.MODERATOR;
    const isOwner = currentMember.id === member.id;
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !deleted && isOwner && !fileUrl;
    const isPDF = fileType === "pdf" && fileUrl;
    const isImage = !isPDF && fileUrl; 

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full"> 
      <div className="group flex gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
            <UserAvatar src={member.profile.image ? member.profile.image : "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E"}/>
        </div>
        <div className="flex flex-col w-full">
            <div className="flex items-center gap-x-2">
                <div className="flex items-center">
                    <p className="font-semibold text-sm hover:underline cursor-pointer">
                        {member.profile.name} {member.profile.surname}
                    </p>
                    <ActionTooltip label={member.role}>
                        {roleIconMap[member.role]}
                    </ActionTooltip>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                    {timestamp}
                </span>
            </div>
            {isImage && (
                <a href={fileUrl} target="_blank" rel="noopener noreferer" className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary w-48 h-48">
                    <Image 
                        src={fileUrl}
                        alt={content}
                        fill
                        className="object-cover"
                    />
                </a>
            )}
            {isPDF && (
                <div className="">
                        {/* TODO: PDF veya dosya ekleri */}
                </div>
            )}
            {!fileUrl && !isEditing && (
                <p className={cn("text-sm text-slate-600 dark:text-slate-300",
                    deleted && "italic text-slate-500 dark:text-slate-400 text-xs mt-1"
                )}>
                    {content}
                    {isUpdated && !deleted && (
                        <span className="text-[10px] mx-2 text-slate-500 dark:text-slate-400">
                            (düzenlendi)
                        </span>
                    )}
                </p>
            )}
            {!fileUrl && isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center w-full gap-x-2 pt-2">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <div className="relative w-full">
                                            <Input 
                                            disabled={isLoading}
                                                className="p-2 bg-slate-200/90 dark:bg-slate-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-600 dark:text-slate-200"
                                                placeholder="Düzenlenen mesaj içeriği"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button size="sm" variant="primary" disabled={isLoading}>
                            Kaydet
                        </Button>
                    </form>
                    <span className="text-[10px] mt-1 text-zinc-400">
                        İptal etmek için ESC, kaydetmek için ENTER'a basın.
                    </span>
                </Form>
            )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 top-2 right-5 bg-white dark:bg-slate-800 border rounded-sm">
            {canEditMessage && (
                <ActionTooltip label="Düzenle">
                    <Edit onClick={() => setIsEditing(true)} className="cursor-pointer ml-auto w-4 h-4 text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"/>
                </ActionTooltip>
            )}
            <ActionTooltip label="Sil">
                <Trash onClick={() => onOpen("deleteMessage", {
                    apiUrl: `${socketUrl}/${id}`,
                    query: socketQuery
                })} className="cursor-pointer ml-auto w-4 h-4 text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"/>
            </ActionTooltip>
        </div>
      )}
    </div>
  )
}

export default ChatItem
