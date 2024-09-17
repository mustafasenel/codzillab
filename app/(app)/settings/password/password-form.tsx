"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/icons";
import { FullUserType } from "@/types";
import { Input } from "@/components/ui/input";

// Zod schema for the form
const passwordFormSchema = z.object({
  oldPassword: z.string().min(1, "Eski şifre alanı doldurulması zorunlu"),
  password: z.string().min(1, "Yeni şifre alanı doldurulması zorunlu"),
  passwordAgain: z.string().min(1, "Yeni şifre alanı doldurulması zorunlu"),
});

// Types for form values
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

// Default values for the form

interface PasswordFormProps {
  user: FullUserType;
}

export function PasswordForm({ user }: PasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const defaultValues: Partial<PasswordFormValues> = {};

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues,
  });

  // Function to handle form submission
  function onSubmit(data: PasswordFormValues) {
    setIsLoading(true);
    
    axios
      .post("/api/settings/password", data)
      .then(() => {
        toast.success("Şifreniz başarıyla güncellendi!");
        router.refresh();
      })
      .catch((error) => {
        const errorMessage = error.response?.data || "Bir hata oluştu. Lütfen tekrar deneyin.";
        toast.error(errorMessage);
        console.error("Password update error:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  const { control, setValue, getValues, watch, setError, clearErrors } = form;

  const password = watch("password");
  const passwordAgain = watch("passwordAgain");

  useEffect(() => {
    if ( passwordAgain) {
      if (password !== passwordAgain) {
        setError("passwordAgain", {
          type: "manual",
          message: "Şifreler eşleşmiyor",
        });
      } else {
        clearErrors("passwordAgain"); // Hata yoksa hatayı temizliyoruz
      }
    }
  }, [password, passwordAgain, setError, clearErrors]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Eski Şifre</FormLabel>
              <FormControl>
                <Input
                  placeholder="Eski şifrenizi giriniz"
                  {...field}
                  disabled={isLoading || !!user?.account?.length}
                  type="password"
                />
              </FormControl>
              <FormDescription>
                Halihazırda kullanmış olduğunuz hesabınızın şifresini giriniz.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Yeni Şifre</FormLabel>
              <FormControl>
                <Input
                  placeholder="Yeni Şifrenizi giriniz"
                  {...field}
                  disabled={isLoading || !!user?.account?.length}
                  type="password"
                />
              </FormControl>
              <FormDescription>
                Değiştirmek istediğiniz şifreyi giriniz
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordAgain"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel className="text-primary">Yeni Şifre Tekrar</FormLabel>
              <FormControl>
                <Input
                  placeholder="Yeni Şifrenizi giriniz"
                  {...field}
                  disabled={isLoading || !!user?.account?.length}
                  type="password"
                />
              </FormControl>
              <FormDescription>
                Değiştirmek istediğiniz şifreyi giriniz
              </FormDescription>
              <FormMessage className="text-red-500 text-xs"/>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading || !!user?.account?.length}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Güncelle
        </Button>
      </form>
    </Form>
  );
}
