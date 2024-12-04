import { ChanelType, Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType = "createServer" | "editServer" | "invite" | "members" | "createChannel" | "leaveServer" | "deleteServer";


interface ModalData {
    server?: Server;
    channelType?: ChanelType;
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