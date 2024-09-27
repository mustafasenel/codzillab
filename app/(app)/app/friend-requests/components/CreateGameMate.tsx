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
import { Check, ChevronsUpDown, Gamepad2, X } from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import { Separator } from "@/components/ui/separator";
import { Game, GameBody } from "@prisma/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEdgeStore } from "@/lib/edgestore";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const router = useRouter();

  const form = useForm<gameFormValues>({
    resolver: zodResolver(gameFormSchema),
    defaultValues,
    mode: "onChange",
  });

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

  const selectedGame = watch("game");

  function onSubmit(data: gameFormValues) {
    try {
      setIsLoading(true);
      axios
        .post("/api/gamebody/create", data)
        .then(() => {
          toast.success("Oyun başarıyla eklendi!");
          form.reset();
          setFile(undefined);
          setImageFile("")
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
        <DialogContent className="sm:max-w-5xl max-h-screen ">
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
            <form className="space-y-6 flex">
              <div className="flex flex-col sm:flex-row gap-10 w-full">
                <div className="space-y-6 flex-1">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }: { field: any }) => (
                      <FormItem className="space-y-4">
                        <FormLabel>Başlık</FormLabel>
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
                            <PopoverContent className="p-0 z-10">
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
                                          setImageFile(gameItem?.image!);
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
                        <FormLabel>Açıklama</FormLabel>
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
                <div className="max-w-80">
                  <div className="flex flex-col justify-center space-y-4">
                    <Label>Seçilen Oyun</Label>
                    {imageFile ? (
                      <Image
                        src={imageFile}
                        alt="game"
                        width={280}
                        height={300}
                        quality={100}
                        className="w-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center sm:w-[285px] sm:h-[380px] w-full h-full border rounded-2xl shadow-sm">
                        <Gamepad2 size={40}/>
                      </div>
                      
                    )}
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
