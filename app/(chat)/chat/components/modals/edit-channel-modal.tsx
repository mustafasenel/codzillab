"use client";

import qs from "query-string"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useModal } from "@/hooks/use-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChanelType } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Kanal ismi gerekli",
  }).refine(
    name => name !== "general",
    {
      message: "'general' ismi alamazsınız.",
    }
  ),
  type: z.nativeEnum(ChanelType)
});

const EditChannelModal = () => {

  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type ==  "editChannel";
  const { server, channel } = data;

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: channel?.type || ChanelType.TEXT
    },
  });

  useEffect(() => {
    if (channel) {
      form.setValue("name", channel.name)
      form.setValue("type", channel.type)
    }
  }, [form, channel])

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        const url = qs.stringifyUrl({
          url: `/api/chat/channels/${channel?.id}`,
          query: {
            serverId: server?.id
          }
        });

        await axios.patch(url, values);

        form.reset();
        router.refresh();
        onClose();
    } catch (error) {
        console.log(error)
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-semibold">
            Kanalı Düzenle
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-muted-foreground">
                      Kanal Adı
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 dark:bg-gray-900 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                        placeholder="Kanal adını giriniz"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kanal Türü</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 dark:bg-gray-900 border-0 focus:ring-0 ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Kanal türünü seçiniz"/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChanelType).map((type) => (
                          <SelectItem key={type} value={type} className="capitalize">
                            { type.toLowerCase() }
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              
              />
            </div>
            <DialogFooter className="px-6 py-4 flex items-center gap-2">
              <Button disabled={isLoading} variant="primary">
                Kaydet
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditChannelModal;
