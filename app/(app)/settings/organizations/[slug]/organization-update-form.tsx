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
import { FullOrganizationType, FullUserType } from "@/types";
import { IoIosLink } from "react-icons/io";
import { FaGithub, FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const OrganizationFormSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .max(30, { message: "Organizasyon adı çok uzun." })
    .min(2, { message: "Organizasyon adı çok kısa" }),
  slug: z
    .string()
    .max(60, { message: "Slug çok uzun." })
    .min(2, { message: "Slug çok kısa." })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug sadece küçük harfler, sayılar ve tire içermelidir.",
    }), // Ensures slug format
  contactEmail: z
    .string({
      required_error: "Lütfen e-mail giriniz.",
    })
    .email(),
  description: z
    .string()
    .max(260, { message: "Açıklama metni çok uzun." })
    .min(20, { message: "Açıklama metni çok kısa" }),
  logo: z.string().optional(),
  location: z.string().optional(),
  contactPhone: z.string().optional(),
  type: z.string().optional(),
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
              message: "Lütfen geçerli URL giriniz.",
            }
          ),
      })
    )
    .optional(),
});

type OrganizationFormValues = z.infer<typeof OrganizationFormSchema>;

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

interface OrganizationUpdateFormTypes {
  organization: FullOrganizationType | null;
}

export function OrganizationUpdateForm({
  organization,
}: OrganizationUpdateFormTypes) {
  const defaultValues: Partial<OrganizationFormValues> = {
    id: organization?.id,
    name: organization?.name || "",
    slug: organization?.slug || "",
    description: organization?.description || "",
    logo: organization?.logo || "",
    location: organization?.location || "",
    contactEmail: organization?.contactEmail || "",
    contactPhone: organization?.contactPhone || "",
    links: organization?.socialLinks?.map((link) => ({ value: link })) || [],
  };

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(OrganizationFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { control, setValue, getValues, watch, setError, clearErrors } = form;

  const newSlug = watch("slug")
  function onSubmit(data: OrganizationFormValues) {
    try {
      setIsLoading(true);
      axios
        .post("/api/organization/update", data)
        .then(() => {
          toast.success("Organizasyon bilgileri başarıyla güncellendi!");
        })
        .finally(() => {
          setIsLoading(false);
          router.replace(`/settings/organizations/${newSlug}`);
        });
    } catch (error) {
      toast.error("Hata oluştu");
      console.log(error);
    }
  }

  const urls = [0, 1, 2, 3];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className=" flex justify-between gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Ad</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Organizasyon adını giriniz"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Bu, organizasyonunuzun profilinizde ve e-postalarda
                  görüntülenecek addır.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Organizasyon URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Organizasyon url değerini giriniz"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Bu, URL'de görünecek olan slug ifadesidir. Türkçe karakter ve
                  noktalama işareti kullanmayınız.
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
            <FormItem>
              <FormLabel>Hakkında</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Açıklama giriniz"
                  className="resize-none"
                  cols={4}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Organizasyonunuzu tanıtan kısa bir açıklama girebilirsiniz.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email giriniz" {...field} />
              </FormControl>
              <FormDescription>Organizasyonun iletişim emaili.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactPhone"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Telefon</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="İletişim numarası giriniz"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Organizasyonun iletişim numarası.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Adres</FormLabel>
              <FormControl>
                <Input
                  type="address"
                  placeholder="Adres giriniz"
                  className="resize-none"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Organizasyonunuzu adresini giriniz.
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
