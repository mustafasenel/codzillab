import { Metadata } from "next";

import Navbar from "@/components/Navbar";
import getCurrentUser from "@/actions/getCurrentUser";
import { AiFillHome } from "react-icons/ai";
import { IoGameController } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { SidebarNav } from "./components/sidebar-nav";

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
      title: "Zaman Akışı",
      href: `/app`,
      icon: <AiFillHome className="h-6 w-6" />,
    },
    {
      title: "Oyunlar",
      href: `/app/games`,
      icon: <IoGameController className="h-6 w-6" />,
    },
    {
      title: "Oyun Arkadaşı",
      href: `/app/friend-requests`,
      icon: <FaUserFriends className="h-6 w-6" />,
    },
  ];

  return (
    <div className="w-full h-screen overflow-hidden">
      <Navbar user={currentUser!} />
      <div className="md:container mx-auto w-full h-screen flex pt-6">
        <aside className="md:w-60 w-fit sticky top-0 h-screen">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <main className="flex-1 overflow-y-auto px-2 md:px-6 mb-10 hidden-scrollbar ">{children}</main>
      </div>
    </div>
  );
}
