import { Metadata } from "next";

import Navbar from "@/components/Navbar";
import getCurrentUser from "@/actions/getCurrentUser";
import { AiFillHome } from "react-icons/ai";
import { IoGameController } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { SidebarNav } from "./components/sidebar-nav";
import {
  Building,
  Gamepad,
  Gamepad2,
  Home,
  UserPlus2,
  Users,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const user = await getCurrentUser();

  return {
    title: `Codzillab | ${user?.name || "Profile"}`,
    description: `Explore the profile of ${user?.name || "this user"}`,
  };
}

export default async function TimelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  const sidebarNavItems = [
    {
      title: "Ana Sayfa",
      href: `/app`,
      icon: <Home className="h-6 w-6 text-[#E7243A]" />
    },
    {
      title: "Oyunlar",
      href: `/app/games`,
      icon: <Gamepad2 className="h-6 w-6 text-[#E7243A]" />,
    },
    {
      title: "Oyun Arkadaşı",
      href: `/app/friend-requests`,
      icon: <Users className="h-6 w-6 text-[#E7243A]" />,
    },
    {
      title: "Sayfalar",
      href: `/app/organizations`,
      icon: <Building className="h-6 w-6 text-[#E7243A]" />,
    },
    {
      title: "Arkadaş Bul",
      href: `/app/friends`,
      icon: <UserPlus2 className="h-6 w-6 text-[#E7243A]" />,
    },
  ];

  return (
<div className="w-full h-screen overflow-y-auto ">
  <Navbar user={currentUser!} />
  <div className="md:container mx-auto w-full h-full flex md:flex-row flex-col pt-6">
    <aside className="md:w-60 w-fit md:fixed sticky top-[90px] self-start h-full">
      <SidebarNav items={sidebarNavItems} />
    </aside>
    <main className="flex-1 md:ml-60 px-2 md:px-4 mb-10 h-screen">
      {children}
    </main>
  </div>
</div>
  );
}
