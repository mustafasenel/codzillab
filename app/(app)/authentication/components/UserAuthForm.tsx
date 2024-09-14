"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isCreateAccount, setIsCreateAccount] = React.useState<boolean>(false);
  const [usernameAvailable, setUsernameAvailable] =
    React.useState<boolean>(true);


  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
  ? "Email başka bir hesapta kullanılıyor!"
  : ""
  

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      surname: "",
      username: "",
      email: "",
      password: "",
      passwordAgain: "",
    },
  });
  const password = watch("password");
  const username = watch("username");
  const passwordAgain = watch("passwordAgain");
  React.useEffect(() => {
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
  // Şifre eşleşme kontrolünü useEffect ile anlık olarak yapıyoruz
  React.useEffect(() => {
    if (isCreateAccount && passwordAgain) {
      if (password !== passwordAgain) {
        setError("passwordAgain", {
          type: "manual",
          message: "Passwords do not match",
        });
      } else {
        clearErrors("passwordAgain"); // Hata yoksa hatayı temizliyoruz
      }
    }
  }, [password, passwordAgain, isCreateAccount, setError, clearErrors]);
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (isCreateAccount) {
      axios
        .post("/api/register", data)
        .then(() => {
          signIn("credentials", data);
          router.push("/app");
        })
        .catch(() => toast.error("Sometihing went wrong!"))
        .finally(() => setIsLoading(false));
    }
    if (!isCreateAccount) {
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error("Invalid credentials!");
          }
          if (callback?.ok && !callback?.error) {
            toast.success("Successfully logged in!");
            router.push("/timeline");
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);
    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Something went wrong!");
        }
        if (callback?.ok && !callback?.error) {
          toast.success("Logged in!");
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          {isCreateAccount && (
            <>
              <div className="flex items-center justify-between gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Ad</Label>
                  <Input
                    id="name"
                    placeholder="John"
                    type="text"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...register("name", { required: true })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Soyad</Label>
                  <Input
                    id="surname"
                    placeholder="Doe"
                    type="text"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...register("surname", { required: true })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Kullanıcı Adı</Label>
                <Input
                  id="username"
                  placeholder="John"
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  disabled={isLoading}
                  {...register("username", {
                    required: true,
                    pattern: {
                      value: /^[a-zA-Z0-9_]{3,20}$/, // Kullanıcı adı deseni
                      message:
                        "Kullanıcı adı 3-20 karakter olmalı ve sadece harf, rakam veya alt çizgi içermelidir",
                    },
                  })}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs">
                    {typeof errors.username.message === "string" &&
                      errors.username.message}
                  </p>
                )}
              </div>
            </>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email", { required: true })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Şifre</Label>
            <Input
              id="password"
              placeholder=""
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              {...register("password", { required: true })}
            />
          </div>
          {isCreateAccount && (
            <div className="grid gap-2">
              <Label htmlFor="passwordAgain">Şifre Tekrar</Label>
              <Input
                id="passwordAgain"
                placeholder=""
                type="password"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isLoading}
                {...register("passwordAgain", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Şifreler eşleşmiyor",
                })}
              />
              {errors.passwordAgain && (
                <p className="text-red-500 text-xs">
                  {typeof errors.passwordAgain.message === "string" &&
                    errors.passwordAgain.message}
                </p>
              )}
            </div>
          )}
          {
            urlError && (
              <Card className="bg-red-200">
                  <CardContent>
                    <p className="text-red-700">{urlError}</p>
                  </CardContent>
              </Card>
            )
          }
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isCreateAccount ? "Hesap oluştur" : "Giriş yap"}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Veya</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={() => socialAction("google")}
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}{" "}
          Google
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={() => socialAction("discord")}
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.discord className="mr-2 h-4 w-4s" />
          )}{" "}
          Discord
        </Button>
      </div>
      <Button
        type="button"
        variant="link"
        onClick={() => setIsCreateAccount(!isCreateAccount)}
      >
        {isCreateAccount
          ? "Zaten bir hesabın var mı? Giriş yap"
          : "Yeni hesap oluştur"}
      </Button>
    </div>
  );
}
