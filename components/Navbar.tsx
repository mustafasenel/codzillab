"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { MdAdminPanelSettings, MdLogout, MdMoney, MdPerson, MdSettings } from "react-icons/md";
import { IoNotifications, IoPersonAddSharp } from "react-icons/io5";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavbarProps {
  user?: User;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();
  return (
    <header className={cn("sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 border-b pr-10 pl-12",

    )}>
      <div
        className={cn(
          "flex h-16 items-center gap-4 ",
        )}
      >
        <div className="mr-4 hidden md:flex md:items-center space-x-6">
          <a href="/" className="mr-4 flex items-center lg:mr-6 py-2">
            <Image
              src={theme == "light" ? "/codzillab-logo.png" : "/codzillab-logo.png"}
              alt="logo"
              width={25}
              height={25}
            />
          </a>
          <nav className="flex items-center gap-4 text-sm lg:gap-6">
            {/* NAV LİNKS */}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end"></div>
        <nav className="flex items-center gap-4">
          {/* NOTIFICATIONS */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <IoNotifications className="h-[1.2rem] w-[1.2rem] transition-all" />
                <span className="sr-only">notifications</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="min-w-80 h-80">
              <DropdownMenuLabel className="text-lg">
                Bildirimler
              </DropdownMenuLabel>
              <Separator />
              {/* Bildirimler burada listelenecek */}
              <div className="flex items-center justify-center w-full h-full">
                <p className="text-muted-foreground text-sm">
                  Henüz bildiriminiz yok
                </p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* USER REQUESTS */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <IoPersonAddSharp className="h-[1.2rem] w-[1.2rem] transition-all " />
                <span className="sr-only">user request</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="min-w-80 h-80">
              <DropdownMenuLabel>Arkadaşlık İstekleri</DropdownMenuLabel>
              <Separator />
              {/* İstekler burada listelenecek */}
              <div className="flex items-center justify-center w-full h-full">
                <p className="text-muted-foreground text-sm">
                  Henüz arkadaşlık isteğin yok
                </p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar>
                    <AvatarImage
                      src={
                        user?.image
                          ? user?.image
                          : "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E"
                      }
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>@{user?.username}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link
                        href={`/${user.username}`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <MdPerson />
                        <span>Profilim</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        href={"/settings"}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <MdSettings />
                        <span>Ayarlar</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  {user?.role === "ADMIN" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link
                          href={!pathname.includes("/admin")  ? "/admin" : "/app"}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <MdAdminPanelSettings />
                          <span>{!pathname.includes("/admin") ? "Admin Sayfası" : "Uygulama Sayfası"}</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <MdLogout />
                      <span>Çıkış</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href={"/authentication"}>
              <Button>Giriş yap</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
