"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Organization, User } from "@prisma/client";
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
import { Separator } from "./ui/separator";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Bell, UserPlus, UserPlus2 } from "lucide-react";
import { FullFriendRequestType, FullUserType } from "@/types";
import FriendRequests from "./NavbarComponents/FriendRequests";
import Notification from "./NavbarComponents/Notification";
import { ModeToggle } from "./mode-toggle";

interface NavbarProps {
  user?: FullUserType;
  organizations?: Organization[] | [];
}

const Navbar: React.FC<NavbarProps> = ({ user, organizations }) => {
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
        "sticky top-0 z-10 w-full border-border/40 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 border-b pr-10 pl-12"
      )}
    >
      <div className={cn("flex h-16 items-center gap-4 ")}>
        <div className="mr-4 hidden md:flex md:items-center space-x-6">
          <a href="/" className="mr-4 flex items-center lg:mr-6 py-2">
            <Image
              src={
                theme == "light" ? "/codzillab-logo.png" : "/codzillab-logo.png"
              }
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
                <Bell className="h-5 w-5 transition-all" />
                <span className="sr-only">notifications</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80 p-0">
              <DropdownMenuLabel>
              <div className="flex items-center gap-4">
                  <Bell />
                  <span>Bildirimler</span>
                </div>
              </DropdownMenuLabel>
              <Separator />
              {/* Bildirimler burada listelenecek */}
              <div className="flex w-full p-0 overflow-y-auto h-80 ">
              <Notification />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* USER REQUESTS */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <div className="relative">
                  <UserPlus className=" h-5 w-5 transition-all " />
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
                  <UserPlus />
                  <span>Arkadaşlık İstekleri</span>
                </div>
              </DropdownMenuLabel>
              <Separator />
              {/* İstekler burada listelenecek */}
              <FriendRequests currentUser={user!} />
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />

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
                <DropdownMenuContent className="w-60">
                  <DropdownMenuItem>
                    <Link
                      className="flex items-center space-x-4 cursor-pointer"
                      href={`/${user.username}`}
                    >
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
                      <div className="flex flex-col justify-between py-1">
                        <span className="text-sm font-semibold truncate">
                          {user.name} {user.surname}
                        </span>
                        <span className="text-xs font-light truncate">
                          @{user.username}
                        </span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  {/* {organizations &&
                    !!organizations.length &&
                    organizations.map((organization, index) => (
                      <DropdownMenuItem key={index}>
                        <Link
                          className="flex items-center space-x-4 cursor-pointer"
                          href={`/${organization.slug}`}
                        >
                          <Avatar>
                            <AvatarImage
                              src={
                                organization?.logo
                                  ? organization?.logo
                                  : "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E"
                              }
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col justify-between py-1">
                            <span className="text-sm font-semibold truncate">
                              {organization.name}
                            </span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))} */}
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
                          href={ pathname ? (

                            !pathname.includes("/admin")
                              ? "/admin/dashboard"
                              : "/app"
                          ) : "/app"
                          }
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <MdAdminPanelSettings />
                          <span>
                            { pathname ? (

                              !pathname.includes("/admin")
                                ? "Admin Sayfası"
                                : "Uygulama Sayfası"
                            ) : (
                              "Admin Sayfası"
                            )
                            }
                          </span>
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
