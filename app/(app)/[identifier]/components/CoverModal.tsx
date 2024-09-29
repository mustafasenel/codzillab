"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Organization, User } from "@prisma/client";
import axios from "axios";

import { useTheme } from "next-themes";

import { useRouter } from "next/navigation";
import { SingleImageDropzone } from "@/components/SıngleImageDropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { X } from "lucide-react";
import { Icons } from "@/components/icons";

interface CoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | Organization;
}

export function CoverModal({ isOpen, onClose, user }: CoverModalProps) {
  const [open, setOpen] = useState(isOpen);
  const [file, setFile] = useState<File>();
  const [isSubbitted, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { edgestore } = useEdgeStore();
  const { theme } = useTheme();

  const [isOrganization, setIsOrganization] = useState(false);

  useEffect(() => {
    if (user) {
      setIsOrganization('ownerId' in user); 
    }
  }, [user]);


  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);
      const res = await edgestore.publicFiles.upload({
        file,
      });
      setCoverImage(res.url);
      setIsSubmitting(false);
    }
  };

  const handleDeleteFile = async (file: string) => {
    setIsSubmitting(true);
    if (file) {
      await edgestore.publicFiles.delete({
        url: file,
      });
      setFile(undefined);
      setCoverImage("");
      setIsSubmitting(false);
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);
    try {
      const endpoint = !isOrganization ? "/api/settings/cover-image" : "/api/organization/cover-image";
      axios.post(endpoint, { data: coverImage, id: user?.id }).then(() => {
        onClose();
        setCoverImage("");
        setFile(undefined);
        setIsLoading(false);
        router.refresh();
      });
    } catch (error: any) {
      console.error("Error from cover images posted", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl py-6 min-h-72">
        <DialogHeader>
          <DialogTitle>Kapak Fotoğrafını Güncelle</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center w-full space-x-2">
          <div className="flex flex-col space-y-4 w-full">
            <div className="flex group items-center justify-center w-full rounded-lg border-none relative">
              {file && (
                <div
                  className="group absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 transform z-50 cursor-pointer"
                  onClick={() => handleDeleteFile(coverImage)}
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-md border border-solid border-gray-500 bg-white transition-all duration-300 hover:h-6 hover:w-6 dark:border-gray-400 dark:bg-black">
                    <X
                      className="text-gray-500 dark:text-gray-400"
                      width={16}
                      height={16}
                    />
                  </div>
                </div>
              )}
              <SingleImageDropzone
                className="w-full outline-none relative"
                disabled={isSubbitted}
                value={file}
                onChange={onChange}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Kapat
            </Button>
          </DialogClose>
          <Button type="button" disabled={isLoading} onClick={handleSubmit}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Kaydet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
