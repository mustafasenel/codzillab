import { Metadata } from "next";

import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import getCurrentUser from "@/actions/getCurrentUser";



interface IParams {
  username: string;
}

export default async function SettingsLayout({
  children,
  params,
}: {
  params: IParams;
  children: React.ReactNode;
}) {

const currentUser = await getCurrentUser()
  return (
    <div className="w-full h-full">
      <Navbar user={currentUser!} />
      <div className="md:container mx-auto">

        {children}
      </div>
    </div>
  );
}
