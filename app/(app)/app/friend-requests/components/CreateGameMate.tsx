"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { MdClose } from "react-icons/md";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UploadDropzone } from "@/utils/uploadthing";
import { useTheme } from "next-themes";
import { Separator } from "@/components/ui/separator";
import { Game, GameBody } from "@prisma/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SingleImageDropzone } from "@/components/SıngleImageDropzone";
import { useEdgeStore } from "@/lib/edgestore";

const gameFormSchema = z.object({
  title: z
    .string()
    .max(160, { message: "Başlık çok uzun." })
    .min(20, { message: "Başlık çok kısa" }),
  game: z.string(),
  type: z.string(),
  description: z
    .string()
    .max(460, { message: "Açıklama metni çok uzun." })
    .min(20, { message: "Açıklama metni çok kısa" }),
  image: z.string(),
  id: z.string().optional(),
});

type gameFormValues = z.infer<typeof gameFormSchema>;

interface CreateGameMateProps {
  isOpen: boolean;
  onClose: () => void;
  game?: GameBody | null;
  games: Game[];
}

export function CreateGameMate({
  isOpen,
  onClose,
  game,
  games,
}: CreateGameMateProps) {
  const defaultValues: Partial<gameFormValues> = {
    title: game ? game.title : "",
    game: game ? game.gameId : "",
    type: game ? game.type : "GAMEMATE",
    description: game ? game.description : "",
    image: game?.image ?? "",
    id: game ? game.id : "",
  };

  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File>();
  const [isSubbitted, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<string>("");

  const { edgestore } = useEdgeStore();
  const router = useRouter();
  const { theme } = useTheme();

  const form = useForm<gameFormValues>({
    resolver: zodResolver(gameFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);
      const res = await edgestore.publicFiles.upload({
        file,
      });
      setValue("image", res.url)
      setImageFile(res.url)
      setIsSubmitting(false);
    }
  };

  const handleDeleteFile = async (file: string) => {
    setIsSubmitting(true);
    if (file) {
      await edgestore.publicFiles.delete({
        url: file,
      });
      setValue("image", "");
      setFile(undefined);
      setImageFile("")
      setIsSubmitting(false);
    }
  }

  const { control, setValue, getValues, watch } = form;

  useEffect(() => {
    if (game) {
      setValue("title", game.title);
      setValue("game", game.id);
      setValue("description", game.description);
      setValue("image", game.image ?? "");
      setValue("id", game.id);
    }
  }, [game, setValue]);

  const imageUrlResponse = watch("image");

  function onSubmit(data: gameFormValues) {
    try {
      setIsLoading(true);
      axios
        .post("/api/gamebody/create", data)
        .then(() => {
          toast.success("Oyun başarıyla eklendi!");
          form.reset();
          setFile(undefined)
        })
        .finally(() => {
          setIsLoading(false);
          router.refresh();
          onClose();
        });
    } catch (error) {
      toast.error("An error occurred");
      console.log(error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>
            {game
              ? "İlan Bilgilerini Güncelle"
              : "Yeni Oyun Arkadaşı İlanı Oluştur"}
          </DialogTitle>
          <DialogDescription>
            {game
              ? "İlan biilgilerinizi güncelleyin"
              : "Yeni oyun arkadaşınızı bulmanıza yardımcı olacak bir ilan oluşturun ve oyun dünyasında yeni bağlantılar kurun."}
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <Form {...form}>
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-10">
              <div className="space-y-6 sm:col-span-3 col-span-1">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }: { field: any }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-primary">Başlık</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Aradığınız oyun arkadaşı için başlık giriniz"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between sm:flex-row flex-col sm:space-y-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }: { field: any }) => (
                      <FormItem className="space-y-4">
                        <FormLabel>Arkadaş Türü</FormLabel>
                        <FormControl>
                          <RadioGroup
                            value={field.value}
                            onValueChange={(value) => field.onChange(value)}
                            className="space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="GAMEMATE"
                                id="option-one"
                                defaultChecked
                              />
                              <Label htmlFor="option-one">
                                Oyun arkadaşı arıyorum
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="TEAMMATE"
                                id="option-two"
                              />
                              <Label htmlFor="option-two">
                                Takım Arkadaşı arıyorum
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="game"
                    render={({ field }) => (
                      <FormItem className="flex flex-col justify-end w-72">
                        <FormLabel>Oyun</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="justify-between"
                              >
                                {field.value ? field.value : "Oyun seçiniz"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0">
                            <Command>
                              <CommandInput placeholder="Tür ara..." />
                              <CommandList className="overflow-y-auto">
                                <CommandEmpty>Oyun bulunamadı.</CommandEmpty>
                                <CommandGroup className="overflow-y-auto">
                                  {games.map((gameItem) => (
                                    <CommandItem
                                      key={gameItem.id}
                                      value={gameItem.name}
                                      onSelect={() => {
                                        setValue("game", gameItem.name); // Tek seçim yapılacak
                                      }}
                                      className="justify-start flex"
                                    >
                                      <Check
                                        className={`mr-2 h-4 w-4 ${
                                          field.value === gameItem.name
                                            ? "opacity-100"
                                            : "opacity-0"
                                        }`}
                                      />
                                      <div className="flex items-center justify-start gap-2">
                                        <Image
                                          src={
                                            gameItem.image
                                              ? gameItem.image
                                              : "symbol.png"
                                          }
                                          alt="gameImage"
                                          width={30}
                                          height={30}
                                          unoptimized
                                        />
                                        {gameItem.name}
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Katılmak istediğiniz veya oynamak istediğiniz oyunu
                          seçiniz.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }: { field: any }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-primary">Açıklama</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Aradığınız oyun arkadaşıyla ilgili açıklama giriniz."
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
              <div className="sm:col-span-2 col-span-1">
                <div className="flex flex-col space-y-4">
                  <Label>İlan Görseli</Label>
                  <p className="text-xs text-muted-foreground">
                    Oynadığınız oyundaki derecenizi, başarınızı, ekip
                    arkadaşlarınızı ya da aradığınız oyun arkadaşıyla ilgili bir
                    görsel ekleyebilirsiniz.
                  </p>
                  <div className="flex group items-center justify-center w-full rounded-lg border-none relative">
                    {
                      file && (
                          <div
                            className="group absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 transform z-50 cursor-pointer"
                            onClick={() => handleDeleteFile(imageUrlResponse)}
                          >
                            <div className="flex h-5 w-5 items-center justify-center rounded-md border border-solid border-gray-500 bg-white transition-all duration-300 hover:h-6 hover:w-6 dark:border-gray-400 dark:bg-black">
                              <X
                                className="text-gray-500 dark:text-gray-400"
                                width={16}
                                height={16}
                              />
                            </div>
                          </div>
                      )
                    }
                    <SingleImageDropzone
                      className="w-full outline-none relative"
                      disabled={isSubbitted}
                      value={file}
                      onChange={onChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Kapat
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={isLoading}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {game ? "Güncelle" : "Oluştur"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
