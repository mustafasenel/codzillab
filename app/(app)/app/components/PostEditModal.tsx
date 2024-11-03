"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { SingleImageDropzone } from "@/components/SıngleImageDropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { CalendarIcon, ClockIcon, X } from "lucide-react";
import { Icons } from "@/components/icons";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";

import { FullPostType } from "@/types";
import {
  FileState,
  MultiImageDropzone,
} from "@/components/MultipleImageDropzone";

const PostEventFormSchema = z.object({
  content: z.string().min(1, "Post boş olamaz"),
  postId: z.string(),
  attachments: z
    .array(
      z.object({
        url: z.string(),
      })
    )
    .optional(),
});

// Types for form values
type PostEventFormValues = z.infer<typeof PostEventFormSchema>;

interface PostEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: FullPostType;
}

export function PostEditModal({ isOpen, onClose, post }: PostEditModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { edgestore } = useEdgeStore();
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const queryClient = useQueryClient();

  const formEvent = useForm<PostEventFormValues>({
    resolver: zodResolver(PostEventFormSchema),
    mode: "onSubmit",
    defaultValues: {
      content: post.content,
      attachments: post?.attachments?.map((attachment) => ({
        url: attachment.url,
      })),
    },
  });

  const { setValue, watch, reset, handleSubmit, getValues } = formEvent;
  setValue("postId", post.id)
  useEffect(() => {
    if (post.attachments) {
      const initialFileStates = post.attachments.map((attachment, index) => ({
        file: attachment.url, // An empty File object as placeholder
        url: attachment.url,
        key: `attachment-${index}`,
        progress: "COMPLETE" as "COMPLETE", // Explicitly setting type for progress
      }));
      setFileStates(initialFileStates as FileState[]); // Type assertion to FileState[]
    }
  }, [post.attachments]);

  function updateFileProgress(
    key: string,
    progress: FileState["progress"],
    url?: string
  ) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
        if (url) {
          fileState.url = url; // publicUrl'yi güncelle
        }
      }
      return newFileStates;
    });
  }

  const handleDeleteFile = async (file: string) => {
    if (file) {
      await edgestore.publicFiles.delete({
        url: file,
      });
      // Önceki değeri alın
      const previousAttachments = getValues("attachments") || [];

      // Yeni değeri ayarlayın
      const updatedAttachments = previousAttachments.filter(
        (attachment: { url: string }) => attachment.url !== file
      );
      setValue("attachments", updatedAttachments);
    }
  };

  const editMutation = useMutation({
    mutationFn: async (data : PostEventFormValues ) => {
      const response = await axios.put(`/api/post/update/post`, data); // Update endpoint and add postId
      return response.data;
    },
    onSuccess: () => {
      toast.success("Post güncellendi!");
      onClose();
      reset();
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
    onError: () => {
      toast.error("Bir hata oluştu.");
    },
    onSettled: () => {
      reset();
      setIsLoading(false);
    },
  });
  

  const onSubmit = (data: PostEventFormValues) => {
    editMutation.mutate(data);
    setIsLoading(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-screen ">
        <DialogHeader>
          <DialogTitle>Postu Düzenle</DialogTitle>
        </DialogHeader>
        <Separator />
        <Form {...formEvent}>
          <form className="space-y-6 flex flex-col">
            <div className="">
              <FormField
                control={formEvent.control}
                name="content"
                render={({ field }: { field: any }) => (
                  <FormItem className="space-y-4">
                    <FormControl>
                      <Textarea
                        placeholder="Neler oluyor? #Hashtag @mention"
                        {...field}
                        rows={5}
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
            <div className="sm:col-span-2 space-y-6 h-full">
              <div className="flex group justify-center w-full h-full rounded-lg border-none relative">
              <MultiImageDropzone
                  value={fileStates}
                  dropzoneOptions={{
                    maxFiles: 4,
                  }}
                  onChange={(files) => {
                    setFileStates(files);
                  }}
                  onDelete={async (file) => {
                    await handleDeleteFile(file);
                  }}
                  onFilesAdded={async (addedFiles) => {
                    const newFiles = await Promise.all(
                      addedFiles.map(async (addedFileState) => {
                        try {
                          const res = await edgestore.publicFiles.upload({
                            file:
                              addedFileState.file instanceof File
                                ? addedFileState.file
                                : new File([], ""), // Eğer stringse boş bir File oluştur
                            onProgressChange: async (progress) => {
                              updateFileProgress(addedFileState.key, progress);
                              if (progress === 100) {
                                await new Promise((resolve) =>
                                  setTimeout(resolve, 1000)
                                );
                              }
                            },
                          });
                          updateFileProgress(
                            addedFileState.key,
                            "COMPLETE",
                            res.url
                          );
                          // Dosya durumunu güncelle
                          return {
                            file: addedFileState.file,
                            url: res.url, // URL'yi burada ekliyoruz
                            key: addedFileState.key,
                            progress: "COMPLETE", // veya başlangıçta "PENDING" olabilir
                          };
                        } catch (err) {
                          updateFileProgress(addedFileState.key, "ERROR");
                          return null; // Hata durumunda null döndür
                        }
                      })
                    );

                    const validFiles = newFiles.filter(Boolean);
                    setValue(
                      "attachments",
                      validFiles.map((file) => ({ url: file?.url! })) // URL'leri form değerine ekle
                    );
                  }}
                />
              </div>
            </div>
          </form>
        </Form>
        <DialogFooter className="sm:justify-end gap-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Kapat
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
          >
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
