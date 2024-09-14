"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { User } from "@prisma/client";
import toast from "react-hot-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { FullUserType } from "@/types";
import { IoIosLink } from "react-icons/io";
import { FaGithub, FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Kullanıcı adı en az 3 karakter uzunluğunda olmalıdır.",
    })
    .max(30, {
      message: "Kullanıcı adı en az 30 karakterden uzun olamaz.",
    }),
  email: z
    .string({
      required_error: "Lütfen e-mail giriniz.",
    })
    .email(),
  bio: z.string().max(300).min(4).optional(),
  name: z.string().max(160).min(2),
  surname: z.string().max(160).min(2),
  links: z
    .array(
      z.object({
        value: z
          .string()
          .optional()
          .refine(
            (val) =>
              !val ||
              val.trim() === "" ||
              z.string().url().safeParse(val).success,
            {
              message: "Please enter a valid URL.",
            }
          ),
      })
    )
    .optional(),
});

function getIconForUrl(url: string) {
  if (url) {
    if (url.includes("twitter.com") || url.includes("x.com")) {
      return <FaXTwitter />;
    } else if (url.includes("github.com")) {
      return <FaGithub />;
    } else if (url.includes("facebook.com")) {
      return <FaFacebook />;
    } else if (url.includes("linkedin.com")) {
      return <FaLinkedin />;
    } else if (url.includes("instagram.com")) {
      return <FaInstagram />;
    } else {
      return <IoIosLink />;
    }
  } else {
    return <IoIosLink />;
  }
}

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormTypes {
  user: FullUserType;
}

export function ProfileForm({ user }: ProfileFormTypes) {
  const defaultValues: Partial<ProfileFormValues> = {
    bio: user?.bio || "",
    username: user?.username || "",
    email: user?.email || "",
    name: user?.name || "",
    surname: user?.surname || "",
    links: user?.links?.map((link) => ({ value: link })) || [],
  };

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [usernameAvailable, setUsernameAvailable] =
    useState<boolean>(true);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append } = useFieldArray({
    name: "links",
    control: form.control,
  });

  const { control, setValue, getValues, watch, setError, clearErrors } = form;

  const username = watch("username");
  useEffect(() => {
    if (username) {
      const checkUsername = async () => {
        try {
          const response = await axios.get(
            `/api/user/check-username?username=${username}`
          );
          if (!response.data.isAvailable) {
            setError("username", {
              type: "manual",
              message: "Kullanıcı adı alınmış",
            });
            setUsernameAvailable(false);
          } else {
            clearErrors("username");
            setUsernameAvailable(true);
          }
        } catch (error) {
          toast.error("Error checking username availability");
        }
      };

      // Bir debounce etkisi yaratmak için kullanıcı yazmayı bitirene kadar kısa bir bekleme süresi
      const timeoutId = setTimeout(checkUsername, 500);
      return () => clearTimeout(timeoutId); // Her kullanıcı girişi olduğunda önceki timeout'u iptal ediyoruz
    }
  }, [username, setError, clearErrors]);

  function onSubmit(data: ProfileFormValues) {
    try {
      setIsLoading(true);
      axios
        .post("/api/settings/profile", data)
        .then(() => {
          toast.success("Profile updated successfully!");
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

  const urls = [0, 1, 2, 3];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Kullanıcı Adı</FormLabel>
              <FormControl>
                <Input
                  placeholder="Kullanıcı adını giriniz"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Bu, herkese açık görünen adınızdır. Gerçek adınız veya bir takma
                ad olabilir. Bunu her 30 günde bir kez değiştirebilirsiniz.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className=" flex justify-between gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Ad</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Adınızı giriniz"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Bu, profilinizde ve e-postalarda görüntülenecek addır.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="surname"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Soyad</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Soyadınızı giriniz"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Bu, profilinizde ve e-postalarda görüntülenecek soyaddır.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Email giriniz"
                  {...field}
                  disabled={!!user?.account?.length}
                />
              </FormControl>
              <FormDescription>
                Doğrulanmış e-posta adreslerinizi e-posta ayarlarından
                yönetebilirsiniz.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Kendiniz hakkında bahsedin"
                  className="resize-none"
                  cols={4}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Diğer kullanıcıları ve organizasyonları <span>@mention</span>{" "}
                onlara bağlantı verebilirsiniz.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {urls.map((index) => (
            <FormField
              control={form.control}
              key={index}
              name={`links.${index}.value`}
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    URLs
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && "sr-only")}>
                    Web sitenize, blogunuza veya sosyal medya profillerinize
                    bağlantılar ekleyin.
                  </FormDescription>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center text-lg">
                        {getIconForUrl(field.value)}
                      </div>
                      <Input
                        {...field}
                        placeholder="Sosyal profilinize bağlantı ekleyin."
                        className="py-0.5 text-xs"
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Güncelle
        </Button>
      </form>
    </Form>
  );
}
