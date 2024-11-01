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
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { tr } from "date-fns/locale";

const PostEventFormSchema = z.object({
  content: z.string().min(1, "Post boş olamaz"),
  userId_organizationId: z.string(),
  attachments: z
    .array(
      z.object({
        url: z.string(),
      })
    )
    .optional(),
  eventName: z.string(),
  location: z.string(),
  eventDate: z.date(),
  eventTime: z.string().optional(),

  type: z.string().optional(),
});

// Types for form values
type PostEventFormValues = z.infer<typeof PostEventFormSchema>;

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId_organizationId: string;
}

export function CreateEventModal({
  isOpen,
  onClose,
  userId_organizationId,
}: CreateEventModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [file, setFile] = useState<File>();
  const [isSubbitted, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<string>("");

  const router = useRouter();
  const { edgestore } = useEdgeStore();
  const queryClient = useQueryClient();

  const formEvent = useForm<PostEventFormValues>({
    resolver: zodResolver(PostEventFormSchema),
    mode: "onSubmit",
  });

  const { setValue, watch, reset, handleSubmit } = formEvent;
  setValue("type", "EVENT");
  setValue("userId_organizationId", userId_organizationId);

  const handleDeleteFile = async (file: string) => {
    if (file) {
      setIsSubmitting(true);
      await edgestore.publicFiles.delete({
        url: file,
      });
      setFile(undefined);
      setImage("");
      setIsSubmitting(false);
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: PostEventFormValues) => {
      const response = await axios.post("/api/post/create", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Post oluşturuldu!");
      onClose()
      reset()
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
    onError: () => {
      toast.error("An error occurred");
    },
    onSettled: () => {
      reset();
      setIsLoading(false);
    },
  });
  const onSubmit = (data: PostEventFormValues) => {
    console.log("Submitted data:", data); // Debugging line
    mutation.mutate(data);
    setIsLoading(true);
  };

  const formatTimeInput = (value: string) => {
    // Remove non-numeric characters
    const cleanedValue = value.replace(/[^0-9]/g, "");

    // Extract hours and minutes
    const hours = cleanedValue.substring(0, 2); // Get first two characters for hours
    const minutes = cleanedValue.substring(2, 4); // Get next two characters for minutes

    // Construct the time string
    if (hours && minutes) {
      return `${hours}:${minutes}`; // If both hours and minutes are present
    } else if (hours) {
      return `${hours}${minutes.length > 0 ? ":" : ""}`; // If only hours are present
    }
    return cleanedValue; // If no input, return cleaned value
  };

  useEffect(() => {
    const eventDate = watch("eventDate"); // This should be a Date object
    const eventTime = watch("eventTime"); // This should be in HH:mm format

    if (eventDate && eventTime) {
      // Format eventDate to YYYY-MM-DD
      const formattedEventDate = format(eventDate, "yyyy-MM-dd");

      const combinedDateTimeString = `${formattedEventDate}T${eventTime}:00`; // Add seconds for valid ISO format

      const combinedDateTime = new Date(combinedDateTimeString);

      // Check if the combinedDateTime is valid
      if (!isNaN(combinedDateTime.getTime())) {
        // Only update if the combined date/time is different from the current state
        if (
          combinedDateTime.getTime() !== new Date(watch("eventDate")).getTime()
        ) {
          setValue("eventDate", combinedDateTime); // Update only if valid
          console.log("DATE ",combinedDateTime)

        }
      }
    }
  }, [watch("eventDate"), watch("eventTime"), setValue]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-screen ">
        <DialogHeader>
          <DialogTitle>Etkinlik Oluştur</DialogTitle>
          <DialogDescription>
            Hemen yeni bir etkinlik oluşturun ve davet edin
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <Form {...formEvent}>
          <form className="space-y-6 flex">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-10 w-full">
              <div className="sm:col-span-3 space-y-6">
                <FormField
                  control={formEvent.control}
                  name="eventName"
                  render={({ field }: { field: any }) => (
                    <FormItem className="space-y-4">
                      <FormLabel>Başlık</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Etkinliğin ismini giriniz"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formEvent.control}
                  name="content"
                  render={({ field }: { field: any }) => (
                    <FormItem className="space-y-4">
                      <FormLabel>Açıklama</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Gerçekleştireceğiniz etkinlik ile ilgili açıklama giriniz."
                          {...field}
                          rows={5}
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-4">
                  <FormField
                    control={formEvent.control}
                    name="eventDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Tarih</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: tr })
                                ) : (
                                  <span>Tarihi seçiniz</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              locale={tr}
                              disabled={(date) => date <= new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Etkinliğin başlayacağı tarihi giriniz.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Saat Seçim Bileşeni */}
                  <FormField
                    control={formEvent.control}
                    name="eventTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Saat</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="HH:mm"
                            value={field.value ? field.value.toString() : ""} // Ensure value is a string
                            onChange={(e) => {
                              const formattedTime = formatTimeInput(
                                e.target.value
                              );
                              field.onChange(formattedTime);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          24 saat formatında saati giriniz.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={formEvent.control}
                  name="location"
                  render={({ field }: { field: any }) => (
                    <FormItem className="space-y-4">
                      <FormLabel>Adres</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Etkinliğin gerçekleşeceği adresi giriniz."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="sm:col-span-2 space-y-6 h-full">
                <div className="flex group justify-center w-full h-full rounded-lg border-none relative">
                  {file && (
                    <div
                      className="group absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 transform z-50 cursor-pointer"
                      onClick={() => handleDeleteFile(image)}
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
                    className="w-full h-full outline-none relative"
                    disabled={isSubbitted}
                    value={file}
                    onChange={async (file) => {
                      if (file) {
                        try {
                          // Dosyayı edgestore'a yükle
                          const res = await edgestore.publicFiles.upload({
                            file,
                            onProgressChange: async (progress) => {
                              // İsteğe bağlı olarak ilerleme durumunu burada yönetebilirsiniz
                              if (progress === 100) {
                                await new Promise((resolve) =>
                                  setTimeout(resolve, 1000)
                                );
                              }
                            },
                          });

                          // Yükleme tamamlandıktan sonra URL'yi form alanına ekle
                          setValue("attachments", [{ url: res.url }]);
                          setFile(file); // Gerekirse local state güncellemesi
                        } catch (error) {
                          console.error("Dosya yükleme hatası:", error);
                        }
                      }
                    }}
                  />
                </div>
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
            Etkinlik Oluştur
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
