"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal";
import axios from "axios";
import qs from "query-string";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const DeleteChannelModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type == "deleteChannel";
  const { server, channel } = data;

  const router = useRouter();
  const params = useParams();

  const onClick = async() => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/chat/channels/${channel?.id}`,
        query: {
          serverId: params?.serverId
        }
      })
      await axios.delete(url);

      onClose();
      router.refresh()
      router.push(`/chat/servers/${server?.id}`);

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-semibold">
            Kanalı Sil
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground py-2">
            <span className="font-semibold text-indigo-500">
              #{channel?.name}
            </span>
            <span>{" "}</span>
            kanalını gerçekten silmek istediğinize emin misiniz? 
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4">
          <div className="flex items-center justify-between w-full">
              <Button 
                disabled={isLoading}
                onClick={onClose}
                variant="ghost"
              >
                İptal
              </Button>
              <Button 
                disabled={isLoading}
                variant="destructive"
                onClick={onClick}
              >
                Kanalı Sil
              </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelModal;
