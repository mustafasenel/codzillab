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
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import {
  MdAdminPanelSettings,
  MdLogout,
  MdMoney,
  MdPerson,
  MdSettings,
} from "react-icons/md";
import { IoNotifications, IoPersonAddSharp } from "react-icons/io5";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserPlus2 } from "lucide-react";
import { FullFriendRequestType, FullUserType } from "@/types";
import FriendRequests from "../NavbarComponents/FriendRequests";
import { SheetMenu } from "./sheet-menu";

interface NavbarProps {
  user?: FullUserType;
  title?: string
}

const Navbar: React.FC<NavbarProps> = ({ user, title }) => {
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();

  const [friendRequests, setFriendRequests] = useState<number>(0);

  useEffect(() => {
    if (user?.id) {
      const pendingRequests =
        user.friendRequestReceived?.filter(
          (request) => request.status === "PENDING"
        ) || [];
      setFriendRequests(pendingRequests.length);
    } else {
      setFriendRequests(0);
    }
  }, [user]);

  return (
    <header
      className={cn(
        "sticky top-0 z-10 w-full border-border/40 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 border-b"
      )}
    >
      <div className={cn("flex h-16 items-center gap-4 mx-4 sm:mx-8")}>
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold">{title}</h1>
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
                <div className="relative">
                  <IoPersonAddSharp className="h-[1.2rem] w-[1.2rem] transition-all " />
                  <span className="sr-only">user request</span>
                  {friendRequests > 0 && (
                    <span className="absolute w-4 h-4 rounded-full text-xs -top-2 -right-2 bg-red-500 ring-1 dark:ring-black ring-white text-white flex items-center justify-center">
                      {friendRequests}
                    </span>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-80 h-80">
              <DropdownMenuLabel>
                <div className="flex items-center gap-4">
                  <UserPlus2 />
                  <span>Arkadaşlık İstekleri</span>
                </div>
              </DropdownMenuLabel>
              <Separator />
              {/* İstekler burada listelenecek */}
              <FriendRequests currentUser={user!} />
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
                      {/* <DropdownMenuItem>
                        <Link
                          href={
                            !pathname.includes("/admin") ? "/admin" : "/app"
                          }
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <MdAdminPanelSettings />
                          <span>
                            {!pathname.includes("/admin")
                              ? "Admin Sayfası"
                              : "Uygulama Sayfası"}
                          </span>
                        </Link>
                      </DropdownMenuItem> */}
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
