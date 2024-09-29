"use client";

import { Button } from "@/components/ui/button";
import { Organization, User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { CoverModal } from "./CoverModal";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Icons } from "@/components/icons";
import { useEdgeStore } from "@/lib/edgestore";

interface CoverProps {
  user?: User | Organization | null;
  currentUser?: User | null;
}

const Cover: React.FC<CoverProps> = ({ user, currentUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const router = useRouter();
  const { edgestore } = useEdgeStore();

  const [isOrganization, setIsOrganization] = useState(false);

  useEffect(() => {
    if (user) {
      setIsOrganization('ownerId' in user); 
    }
  }, [user]);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const coverImageUrl = (user as User)?.coverImage || (user as Organization)?.cover; 
  
      const endpoint = !isOrganization ? "/api/settings/cover-image" : "/api/organization/cover-image";
  
      await axios.post(endpoint, { data: "", id: user?.id });
      toast.success("Kapak fotoğrafı başarılı şekilde kaldırıldı");
  
      await edgestore.publicFiles.delete({ url: coverImageUrl! });
  
      router.refresh();
    } catch (error: any) {
      console.error("Error from cover images posted", error);
      toast.error("Error during posted cover image");
    } finally {
      setIsLoading(false);
    }
  };

  const coverImage = (user as User)?.coverImage || (user as Organization)?.cover; // Type assertion for Organization

  return (
    <div>
      {coverImage ? (
        <div
          className="group relative bg-transparent h-32 sm:h-40 md:h-48 xl:h-60 flex flex-col items-center justify-center space-y-10 transition-all rounded-2xl bg-origin-content bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${coverImage})`,
          }}
        >
          <div className="absolute bottom-2 right-2 hidden group-hover:flex transition-all">
            {
            
            currentUser?.id && user?.id && (user.id === currentUser.id || (user as Organization)?.ownerId === currentUser.id)  && (
              <div className="flex items-center space-x-2 transition-all">
                <Button variant={"outline"} onClick={handleOpenModal}>
                  Kapak Fotoğrafını Değiştir
                </Button>
                <Button variant={"destructive"} onClick={handleDelete}>
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
      ) : (
        <div className="group relative h-60 flex flex-col rounded-md items-center justify-center space-y-10 bg-gradient-to-r from-slate-100 to-slate-300 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-700 transition-all">
          <div className="absolute bottom-2 right-2 hidden group-hover:flex transition-all">
            {currentUser?.id && user?.id && (user.id === currentUser.id || (user as Organization)?.ownerId === currentUser.id) && (
              <div className="flex items-center space-x-2 transition-all">
                <Button variant={"outline"} onClick={handleOpenModal}>
                  Kapak Fotoğrafını Değiştir
                </Button>
                <Button variant={"destructive"} onClick={handleDelete}>
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
      <CoverModal isOpen={isModalOpen} onClose={handleCloseModal} user={user!} />
    </div>
  );
};

export default Cover;
