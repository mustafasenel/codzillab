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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Game } from "@prisma/client";
import { SingleImageDropzone } from "@/components/SıngleImageDropzone";
import { useEdgeStore } from "@/lib/edgestore";

const gameFormSchema = z.object({
  name: z.string().max(160).min(2),
  genre: z.array(z.string()).max(3),
  platform: z.string().max(160).min(2),
  image: z.string(),
  id: z.string().optional()
});

const genres = [
  { value: "FPS", label: "FPS" },
  { value: "MOBA", label: "MOBA" },
  { value: "Simulasyon", label: "Simulasyon" },
  { value: "MMORPG", label: "MMORPG" },
  { value: "MMO", label: "MMO" },
  { value: "Macera", label: "Macera" },
  { value: "Aksiyon", label: "Aksiyon" },
  { value: "Korku", label: "Korku" },
  { value: "Açık Dünya", label: "Açık Dünya" },
  { value: "Rol Yapma", label: "Rol Yapma" },
  { value: "Battle Royale", label: "Battle Royale" },
  { value: "Yarış", label: "Yarış" },
  { value: "Strateji", label: "Strateji" },
  { value: "Mobil", label: "Mobil" },
  { value: "Spor", label: "Spor" },
  { value: "Hayatta Kalma", label: "Hayatta Kalma" },
] as const;

const platforms = [
  { value: "pc", label: "PC" },
  { value: "mobile", label: "Mobil" },
  { value: "nintendo", label: "Nintendo" },
  { value: "xbox", label: "XBOX" },
  { value: "ps4", label: "PS4" },
  { value: "ps5", label: "PS5" },
] as const;
type gameFormValues = z.infer<typeof gameFormSchema>;

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  game?: Game | null;
}

export function AddGame({ isOpen, onClose, game }: AddGameModalProps) {
  const defaultValues: Partial<gameFormValues> = {
    name: game ? game.name :"",
    genre: game ? game.genre : [],
    platform: game ? game.platform : "",
    image: game?.image ?? "",
    id: game ? game.id : ""
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

  const { control, setValue, getValues, watch } = form;

  useEffect(() => {
    if (game) {
      setValue("name", game.name);
      setValue("genre", game.genre);
      setValue("platform", game.platform);
      setValue("image", game.image ?? "");
      setValue("id", game.id);
    }
  }, [game, setValue]);

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
    if (file) {
      await edgestore.publicFiles.delete({
        url: file,
      });
      setValue("image", "");
      setFile(undefined);
      setImageFile("")
    }
  }

  const imageUrlResponse = watch("image");
  function onSubmit(data: gameFormValues) {
    try {
      setIsLoading(true);
      axios
        .post("/api/admin/game", data)
        .then(() => {
          toast.success("Oyun başarıyla eklendi!");
          form.reset()
        })
        .finally(() => {
          setIsLoading(false);
          router.refresh();
          onClose()
        });
    } catch (error) {
      toast.error("An error occurred");
      console.log(error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{game ? "Oyun Bilgilerini Güncelle" :"Yeni Oyun Ekle"}</DialogTitle>
          <DialogDescription>
            Sitede görünecek oyun.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <Form {...form}>
          <form className="space-y-6">
            <div className="grid grid-cols-5 sm:grid-cols-5 gap-10">
              <div className="space-y-6 col-span-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Oyun Adı</FormLabel>
                      <FormControl>
                        <Input placeholder="Oyun adını giriniz" {...field} />
                      </FormControl>
                      <FormDescription>
                        Oyunun sitede görünecek adını giriniz.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <FormField
                    control={form.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem className="flex flex-col justify-end">
                        <FormLabel>Türler</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="justify-between"
                              >
                                {field.value.length > 0
                                  ? field.value
                                      .map(
                                        (value) =>
                                          genres.find(
                                            (genre) => genre.value === value
                                          )?.label
                                      )
                                      .join(", ")
                                  : "Tür seçin (max 3)"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0">
                            <Command>
                              <CommandInput placeholder="Tür ara..." />
                              <CommandList className="overflow-y-auto">
                                <CommandEmpty>Tür bulunamadı.</CommandEmpty>
                                <CommandGroup>
                                  {genres.map((genre) => (
                                    <CommandItem
                                      key={genre.value}
                                      value={genre.value}
                                      onSelect={() => {
                                        const selectedGenres =
                                          getValues("genre");
                                        if (
                                          selectedGenres.includes(genre.value)
                                        ) {
                                          setValue(
                                            "genre",
                                            selectedGenres.filter(
                                              (val) => val !== genre.value
                                            )
                                          );
                                        } else if (selectedGenres.length < 3) {
                                          setValue("genre", [
                                            ...selectedGenres,
                                            genre.value,
                                          ]);
                                        }
                                      }}
                                    >
                                      <Check
                                        className={`mr-2 h-4 w-4 ${
                                          field.value.includes(genre.value)
                                            ? "opacity-100"
                                            : "opacity-0"
                                        }`}
                                      />
                                      {genre.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          3 taneye kadar tür ekleyebilirsiniz.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) =>
                            form.setValue("platform", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Platform seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {platforms.map((platform) => (
                              <SelectItem
                                key={platform.value}
                                value={platform.value}
                              >
                                {platform.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Oyun platformunu seçin
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
              <div className="col-span-2">
                <div className="flex flex-col space-y-4">
                  <Label>Oyun Görseli</Label>
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
          <Button type="submit" disabled={isLoading} onClick={form.handleSubmit(onSubmit)}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {game ? "Güncelle" :"Yeni Oyun Ekle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
