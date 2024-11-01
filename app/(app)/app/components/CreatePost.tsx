"use client";

import {
  FileState,
  MultiImageDropzone,
} from "@/components/MultipleImageDropzone";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,

} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useEdgeStore } from "@/lib/edgestore";
import { cn } from "@/lib/utils";
import { FullOrganizationType, FullUserType } from "@/types";
import { CalendarClock, Image, Video } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateEventModal } from "./CreateEventModal";

const PostFormSchema = z.object({
  content: z.string().min(1, "Post boş olamaz"),
  userId_organizationId: z.string(),
  isOrganization: z.boolean(),
  attachments: z
    .array(
      z.object({
        url: z.string(),
      })
    )
    .optional(),
});

// Types for form values
type PostFormValues = z.infer<typeof PostFormSchema>;

interface CreatePostProps {
  user: FullUserType;
  isOrganization?: Boolean;
  identifier?: FullUserType | FullOrganizationType | null;
}

const CreatePost: React.FC<CreatePostProps> = ({
  user,
  isOrganization,
  identifier,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState(1);
  const [openImageUpload, setOpenImageUpload] = useState(false);

  const [isOpenEventModal, setIsOpenEventModal] = useState(false);

  const handleOpenEventModal = () => setIsOpenEventModal(true);
  const handleCloseEventModal = () => setIsOpenEventModal(false);


  const handleFocus = () => {
    setRows(4);
  };
  const handleBlur = () => {
    setRows(1);
  };

  const handleClickOutside = (event: any) => {
    const textarea = document.getElementById("my-textarea"); // Textarea'nın ID'sini ayarlayın
    if (textarea && !textarea.contains(event.target)) {
      handleBlur(); // Textarea dışında bir yere tıklandığında satır sayısını düşür
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleUploadImage = () => {
    setOpenImageUpload(!openImageUpload);
  };

  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const { edgestore } = useEdgeStore();

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

  const form = useForm<PostFormValues>({
    resolver: zodResolver(PostFormSchema),
  });

  const { setValue, getValues, reset } = form;

  useEffect(()=> {
    if (isOrganization && identifier?.id) {
      setValue("userId_organizationId", identifier?.id)
    } else {
      setValue("userId_organizationId", user.id)
    }
    setValue("isOrganization", isOrganization === true);
  }, [identifier, user, isOrganization])



  const mutation = useMutation({
    mutationFn: async (data: PostFormValues) => {
      const response = await axios.post('/api/post/create', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Post oluşturuldu!");
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
    },
    onError: () => {
      toast.error("An error occurred");
    },
    onSettled: () => {
      reset(); 
      setFileStates([]); 
      setIsLoading(false); 
    },
  });
  const onSubmit = (data: PostFormValues) => {
    mutation.mutate(data);
    setIsLoading(true);
    setOpenImageUpload(false)
  };


  // function onSubmit(data: PostFormValues) {
  //   try {
  //     setIsLoading(true);
  //     axios
  //       .post("/api/post/create", data)
  //       .then(() => {
  //         toast.success("Post oluşturuldu!");
  //         router.refresh();
  //         reset
  //       })
  //       .finally(() => {
  //         setIsLoading(false);
 
  //         setFileStates([])
  //       });
  //   } catch (error) {
  //     toast.error("An error occurred");
  //     console.log(error);
  //   }
  // }

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

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="space-y-6 pt-6 bg-muted">
            <CardContent className="flex flex-col gap-6 md:px-4 px-2">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex items-center justify-start md:justify-center">
                  <Avatar>
                    <AvatarImage
                      src={
                        isOrganization
                          ? (identifier as FullOrganizationType)?.logo ||
                            "https://d2q79iu7y748jz.cloudfront.net/s/_squarelogo/256x256/97f7fb0e435bdd42e9b50113e67abf36"
                          : (user as FullUserType)?.image ||
                            "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E"
                      }
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 flex md:justify-center w-full">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }: { field: any }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Textarea
                            id="my-textarea"
                            placeholder="Neler oluyor? #Hashtag @mention"
                            className="min-h-9 max-h-72 bg-background transition-all duration-300 resize-none overflow-y-auto"
                            rows={rows}
                            onFocus={handleFocus}
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <Button type="submit" disabled={isLoading}>Gönder</Button>
                </div>
              </div>

              {/* Alt butonlar ve dropzone */}
              <div className="flex flex-col items-center">
                <MultiImageDropzone
                  className={cn(openImageUpload ? "mb-4" : "hidden")}
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
                <div className="w-full flex flex-row items-center justify-between gap-4 md:gap-6">
                  <Button
                    className="gap-2 hover:bg-primary-foreground"
                    variant={"ghost"}
                    onClick={handleUploadImage}
                    type="button"
                    id="image-upload-button"
                  >
                    <Image size={20} />
                    <span className="md:flex hidden">Görsel Yükle</span>
                  </Button>
                  <Button className="gap-2 hover:bg-primary-foreground" variant={"ghost"} type="button">
                    <Video size={20} />
                    <span className="md:flex hidden">Video Yükle</span>
                  </Button>
                  <Button className="gap-2 hover:bg-primary-foreground" variant={"ghost"} type="button" onClick={handleOpenEventModal}>
                    <CalendarClock size={20} />
                    <span className="md:flex hidden">Etkinlik Oluştur</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
      <CreateEventModal isOpen={isOpenEventModal} onClose={handleCloseEventModal} userId_organizationId={getValues("userId_organizationId")}/>
    </div>
  );
};

export default CreatePost;
