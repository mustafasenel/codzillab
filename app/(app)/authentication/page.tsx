import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { UserAuthForm } from "./components/UserAuthForm";

const AuthPage = async () => {
  return (
    <>
      <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/"
          className={cn("absolute right-4 top-4 md:right-8 md:top-8")}
        >
          <Button>Ana Sayfa</Button>
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute top-48 inset-0 bg-contain bg-no-repeat" style={{
            backgroundImage: `url("/register-bg.jpg")`

          }}/>
          <div className="relative z-20 flex items-center gap-4 text-lg font-medium">
            <a href="/" className="mr-4 flex items-center lg:mr-6">
              <Image
                src={"/symbol.png"}
                alt="logo"
                width={100}
                height={50}
              />
            </a>
          </div>
        </div>
        <div className="lg:p-8 p-10">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Hesap Oluştur
              </h1>
              <p className="text-sm text-muted-foreground">
                Hemen yeni bir hesap oluştur ve kullanmaya başla
              </p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
