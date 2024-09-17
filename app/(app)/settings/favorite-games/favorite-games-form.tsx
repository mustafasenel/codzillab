"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { countries } from "@/utils/countryNames";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/icons";
import { FullUserType } from "@/types";
import { months } from "@/utils/months";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, ChevronsUpDown } from "lucide-react";
import { genres } from "@/utils/genres";
import { Game } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { platforms } from "@/utils/platforms";

// Zod schema for the form
const favoriteGamesFormSchema = z.object({
  genres: z.array(z.string()).max(5),
  games: z.array(z.string()).max(5),
  platforms: z.array(z.string()).max(2),
});

// Types for form values
type FavoriteGamesFormValues = z.infer<typeof favoriteGamesFormSchema>;

// Default values for the form

interface FavoriteGamesFormProps {
  user: FullUserType;
  systemGames: Game[];
}

export function FavoriteGamesForm({
  user,
  systemGames,
}: FavoriteGamesFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const defaultValues: Partial<FavoriteGamesFormValues> = {
    genres: user?.genres || [], // Kullanıcı türlerini kontrol et ve varsa ayarla
    platforms: user?.platforms || [], // Kullanıcı platformlarını kontrol et ve varsa ayarla
    games: user?.UserGames
      ? user.UserGames.map((userGame) => userGame.game?.name || "")
      : [], // Kullanıcının oyunlarını kontrol et ve varsa isimlerini ayarla
  };

  const form = useForm<FavoriteGamesFormValues>({
    resolver: zodResolver(favoriteGamesFormSchema),
    defaultValues,
  });
  const { control, setValue, getValues, watch } = form;

  useEffect(() => {
    if (user) {
      if (user.genres) {
        setValue("genres", user.genres);
      }
  
      if (user.platforms) {
        setValue("platforms", user.platforms);
      }
  
      if (user.UserGames && user.UserGames.length > 0) {
        const gameNames = user.UserGames.map((userGame) => userGame.game?.name || "");
        setValue("games", gameNames); // Oyun isimlerini ayarla
      }
    }
  }, [user, setValue]);


  // Function to handle form submission
  function onSubmit(data: FavoriteGamesFormValues) {
    try {
      setIsLoading(true);
      axios
        .post("/api/settings/favorite-games", data)
        .then(() => {
          toast.success("Fovori oyunlar başarıyla güncellendi!");
        })
        .finally(() => {
          setIsLoading(false);
          router.refresh();
        });
    } catch (error) {
      toast.error("An error occurred");
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="genres"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-end">
              <FormLabel>Favori Türler</FormLabel>
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
                                genres.find((genre) => genre.value === value)
                                  ?.label
                            )
                            .join(", ")
                        : "Tür seçin (max 5)"}
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
                              const selectedGenres = getValues("genres");
                              if (selectedGenres.includes(genre.value)) {
                                setValue(
                                  "genres",
                                  selectedGenres.filter(
                                    (val) => val !== genre.value
                                  )
                                );
                              } else if (selectedGenres.length < 5) {
                                setValue("genres", [
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
              {/* Seçilen türleri Badge içerisinde listele */}
              {!!field.value.length && (
                <div className="mt-4 flex flex-wrap gap-2 pt-4">
                  {field.value.map((value) => {
                    const genreLabel = genres.find(
                      (genre) => genre.value === value
                    )?.label;
                    return (
                      <Badge key={value} variant="secondary">
                        {genreLabel}
                      </Badge>
                    );
                  })}
                </div>
              )}
              <FormDescription>
                5 taneye kadar tür ekleyebilirsiniz.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
                <FormField
          control={form.control}
          name="platforms"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-end">
              <FormLabel>Favori Platformlar</FormLabel>
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
                                platforms.find((platform) => platform.value === value)
                                  ?.label
                            )
                            .join(", ")
                        : "Platform seçin (max 2)"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Tür ara..." />
                    <CommandList className="overflow-y-auto">
                      <CommandEmpty>Platform bulunamadı.</CommandEmpty>
                      <CommandGroup>
                        {platforms.map((platform) => (
                          <CommandItem
                            key={platform.value}
                            value={platform.value}
                            onSelect={() => {
                              const selectedGenres = getValues("platforms");
                              if (selectedGenres.includes(platform.value)) {
                                setValue(
                                  "platforms",
                                  selectedGenres.filter(
                                    (val) => val !== platform.value
                                  )
                                );
                              } else if (selectedGenres.length < 2) {
                                setValue("platforms", [
                                  ...selectedGenres,
                                  platform.value,
                                ]);
                              }
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                field.value.includes(platform.value)
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />
                            {platform.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {/* Seçilen türleri Badge içerisinde listele */}
              {!!field.value.length && (
                <div className="mt-4 flex flex-wrap gap-2 pt-4">
                  {field.value.map((value) => {
                    const genreLabel = platforms.find(
                      (genre) => genre.value === value
                    )?.label;
                    return (
                      <Badge key={value} variant="secondary">
                        {genreLabel}
                      </Badge>
                    );
                  })}
                </div>
              )}
              <FormDescription>
               2 taneye kadar platform ekleyebilirsiniz.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* OYUNLAR */}
        <FormField
          control={form.control}
          name="games"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-end">
              <FormLabel>Oyunlar</FormLabel>
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
                            .map((value) => {
                              const game = systemGames.find(
                                (game) => game.name === value
                              );
                              return game ? game.name : ""; // game varsa adını döndür
                            })
                            .join(", ") // adları virgülle ayır
                        : "Favori Oyununlarınızı Seçin (max 5)"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Oyun ara..." />
                    <CommandList className="overflow-y-auto">
                      <CommandEmpty>Oyun bulunamadı</CommandEmpty>
                      <CommandGroup>
                        {systemGames.map((game) => (
                          <CommandItem
                            key={game.name}
                            value={game.name}
                            onSelect={() => {
                              const selectedGames = getValues("games");
                              // Eğer oyun zaten seçiliyse, çıkartıyoruz
                              if (selectedGames.includes(game.name)) {
                                setValue(
                                  "games",
                                  selectedGames.filter(
                                    (val) => val !== game.name
                                  )
                                );
                              }
                              // Eğer oyun seçili değilse ve 5'ten az seçim varsa ekliyoruz
                              else if (selectedGames.length < 5) {
                                setValue("games", [
                                  ...selectedGames,
                                  game.name,
                                ]);
                              }
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                field.value.includes(game.name)
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />
                            {game.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {!!field.value.length && (
                <div className="mt-4 flex flex-wrap gap-4 pt-4">
                  {field.value.map((value) => {
                    const game = systemGames.find(
                      (game) => game.name === value
                    );
                    return (
                      game && (
                        <div key={game.name} className="space-y-2">
                          <Image
                            src={game.image ? game.image : "/codzillab.png"} // Oyunun resmini alıyoruz
                            alt={game.name}
                            width={100}
                            height={100}
                            className="rounded-md"
                          />
                        </div>
                      )
                    );
                  })}
                </div>
              )}
              <FormDescription>
                5 taneye kadar oyun ekleyebilirsiniz.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Güncelle
        </Button>
      </form>
    </Form>
  );
}
