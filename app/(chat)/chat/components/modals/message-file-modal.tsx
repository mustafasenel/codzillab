"use client";

import { SingleImageDropzone } from "@/components/SıngleImageDropzone";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
} from "@/components/ui/form";
import { useModal } from "@/hooks/use-modal";
import { useEdgeStore } from "@/lib/edgestore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import qs from "query-string";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Ek gerekli",
  }),
});

const MessageFileModal = () => {
  const [file, setFile] = useState<File>();
  const [isSubbitted, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { edgestore } = useEdgeStore();

  const { isOpen, onClose, type, data } = useModal();

  const { apiUrl, query } = data;

  const isModalOpen = isOpen && type === "messageFile";

  const handleClose = () => {
    form.reset();
    onClose();
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const fileUrl = form.watch("fileUrl")

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);
      const res = await edgestore.publicFiles.upload({
        file,
      });
      form.setValue("fileUrl", res.url)
      setIsSubmitting(false);
    }
  };

  const handleDeleteFile = async (file: string) => {
    if (file) {
      setIsSubmitting(true);
      await edgestore.publicFiles.delete({
        url: file,
      });
      setFile(undefined);
      form.setValue("fileUrl", "")
      setIsSubmitting(false);
    }
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        const url = qs.stringifyUrl({
          url: apiUrl || "",
          query: query,
        });

        await axios.post(url, {
          ...values,
          content: values.fileUrl
        });

        form.reset();
        router.refresh();
        handleClose();
    } catch (error) {
        console.log(error)
    }
  };


  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-semibold">
            Ekle
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <div className="flex group items-center justify-center w-full rounded-lg border-none relative">
                  {file && (
                    <div
                      className="group absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 transform z-50 cursor-pointer"
                      onClick={() => handleDeleteFile(form.getValues("fileUrl"))}
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
            <DialogFooter className="px-6 py-4 flex items-center gap-2">
              <Button disabled={isLoading} variant="primary">
                Gönder
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFileModal;
