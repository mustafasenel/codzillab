"use client";

import { SingleImageDropzone } from "@/components/SıngleImageDropzone";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEdgeStore } from "@/lib/edgestore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Sunucu ismi gerekli",
  }),
  imageUrl: z.string().min(1, {
    message: "Sunucu resmi gerekli",
  }),
});

const InitialModal = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [file, setFile] = useState<File>();
  const [isSubbitted, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { edgestore } = useEdgeStore();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const imageUrl = form.watch("imageUrl")

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);
      const res = await edgestore.publicFiles.upload({
        file,
      });
      form.setValue("imageUrl", res.url)
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
      form.setValue("imageUrl", "")
      setIsSubmitting(false);
    }
  };

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        await axios.post("/api/chat/servers", values);

        form.reset();
        router.refresh();
        window.location.reload();
    } catch (error) {
        console.log(error)
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open>
      <DialogContent className="p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-semibold">
            Kendine ait sunucu oluştur
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Sunucunuza bir kişilik kazandırmak için bir ad ve bir görsel
            ekleyin. Bunları her zaman daha sonra değiştirebilirsiniz.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <div className="flex group items-center justify-center w-full rounded-lg border-none relative">
                  {file && (
                    <div
                      className="group absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 transform z-50 cursor-pointer"
                      onClick={() => handleDeleteFile(form.getValues("imageUrl"))}
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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Sunucu Adı
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Sunucu adını giriniz"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="px-6 py-4 flex items-center gap-2">
              <Button type="button" disabled={isLoading} variant="outline">
                Ana Sayfaya Dön
              </Button>
              <Button disabled={isLoading} variant="primary">
                Oluştur
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InitialModal;
