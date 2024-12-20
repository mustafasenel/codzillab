import { ChanelType, Channel, Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType = "createServer" | "editServer" | "invite" | "members" | "createChannel" | "leaveServer" | "deleteServer" | "deleteChannel" | "editChannel" | "messageFile" | "deleteMessage";


interface ModalData {
    server?: Server;
    channelType?: ChanelType;
    channel?: Channel;
    apiUrl?: string;
    query?: Record<string, any>
}

interface ModalStore {
    type: ModalType | null;
    data: ModalData;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({ data, type, isOpen: true }),
    onClose: () => set({ isOpen: false, type: null }),
}))