import { Metadata } from "next";
import Image from "next/image";

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./components/sidebar-nav";
import Navbar from "@/components/Navbar";
import getCurrentUser from "@/actions/getCurrentUser";
import { CoinsIcon, Gamepad, Gamepad2Icon, KeyRound, SquareUserRound, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Codzillab | Ayarlar",
  description: "Profil Ayarları",
};

const sidebarNavItems = [
  {
    title: "Profil",
    href: "/settings",
    icon: <User size={20}/>
  },
  {
    title: "Hesap",
    href: "/settings/account",
    icon: <SquareUserRound size={20}/>
  },
  {
    title: "Şifre",
    href: "/settings/password",
    icon: <KeyRound size={20}/>
  },
  {
    title: "Favori Oyunlar",
    href: "/settings/favorite-games",
    icon: <Gamepad2Icon size={20}/>
  },
  {
    title: "Seviye ve Puanlar",
    href: "/settings/notifications",
    icon: <CoinsIcon size={20}/>
  },
  {
    title: "Display",
    href: "/settings/display",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const currentUser = await getCurrentUser();
  return (
    <>
      <Navbar user={currentUser!} />
      <div className="container space-y-6 p-10 pb-16">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Ayarlar</h2>
          <p className="text-muted-foreground">
            Hesap ayarlarınızı yönetin ve e-posta tercihlerinizi belirleyin.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  );
}
