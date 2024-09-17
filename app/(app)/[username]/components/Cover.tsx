"use client";

import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { CoverModal } from "./CoverModal";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Icons } from "@/components/icons";
import { useEdgeStore } from "@/lib/edgestore";

interface CoverProps {
  user?: User | null;
  currentUser?: User | null;
}

const Cover: React.FC<CoverProps> = ({ user, currentUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const router = useRouter();
  const { edgestore } = useEdgeStore();

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      axios
        .post("/api/settings/cover-image/", { data: "" })
        .then(() => {
          toast.success("Kapak fotoğrafı başarılı şekilde kaldırıldı");

          router.refresh();
        })
        .finally(() => setIsLoading(false));
      await edgestore.publicFiles.delete({
        url: user?.coverImage!,
      });
    } catch (error: any) {
      console.error("Error from cover images posted", error);
      toast.error("Error during posted cover image");
    }
  };

  return (
    <div className="">
      {user?.coverImage ? (
        <div
          className="group relative bg-transparent h-32 sm:h-40 md:h-48 xl:h-60 flex flex-col items-center justify-center space-y-10 transition-all rounded-2xl bg-origin-content bg-cover bg-center  bg-no-repeat"
          style={{
            backgroundImage: user?.coverImage
              ? `url(${user.coverImage})`
              : undefined,
          }}
        >
          <div className="absolute bottom-2 right-2 hidden group-hover:flex transition-all">
            {currentUser?.id && user.id == currentUser.id && (
              <div className="flex items-center space-x-2 transition-all">
                <Button
                  className=""
                  variant={"outline"}
                  onClick={handleOpenModal}
                >
                  Kapak Fotoğrafını Değiştir 
                </Button>
                {user.coverImage && (
                  <Button
                    className=""
                    variant={"destructive"}
                    onClick={handleDelete}
                  >
                    {isLoading ? (
                      <Icons.spinner className="h-4 w-4 animate-spin" />
                    ) : (
                      <IoMdClose size={16} />
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="group relative h-60 flex flex-col rounded-md items-center justify-center space-y-10 bg-gradient-to-r from-slate-100 to-slate-300 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-700 transition-all">
          <div className="absolute bottom-2 right-2 hidden group-hover:flex transition-all">
            {currentUser?.id && user?.id && user.id == currentUser.id && (
              <div className="flex items-center space-x-2 transition-all">
                <Button
                  className=""
                  variant={"outline"}
                  onClick={handleOpenModal}
                >
                  Change Cover
                </Button>
                <Button
                  className=""
                  variant={"destructive"}
                  onClick={handleDelete}
                >
                  {isLoading ? (
                    <Icons.spinner className="h-4 w-4 animate-spin" />
                  ) : (
                    <IoMdClose size={16} />
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      <CoverModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={currentUser!}
      />
    </div>
  );
};

export default Cover;
