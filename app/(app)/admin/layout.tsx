import { Metadata } from "next";

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./components/sidebar-nav";
import Navbar from "@/components/Navbar";
import getCurrentUser from "@/actions/getCurrentUser";
import { AiFillHome } from "react-icons/ai";
import { IoGameController } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const user = await getCurrentUser();

  return {
    title: `Codzillab | Admin`,
    description: `Explore the admin`,
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
      title: "Dashboard",
      href: `/admin`,
      icon: <AiFillHome className="h-6 w-6" />,
    },
    {
      title: "Oyunlar",
      href: `/admin/games`,
      icon: <IoGameController className="h-6 w-6" />,
    },
    {
      title: "Kullanıcılar",
      href: `/admin/users`,
      icon: <FaUserFriends className="h-6 w-6" />,
    },
  ];

  return (
    <div className="w-full h-screen overflow-hidden">
      <Navbar user={currentUser!} />
      <div className="px-10 w-full h-screen flex pt-6">
        <aside className="w-72 sticky top-0 h-screen">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <main className="flex-1 overflow-y-auto pl-6 mb-10 hidden-scrollbar ">{children}</main>
      </div>
    </div>
  );
}
