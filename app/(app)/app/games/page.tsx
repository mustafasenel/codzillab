import getCurrentUser from "@/actions/getCurrentUser";

import { Separator } from "@/components/ui/separator";

import { MdPerson } from "react-icons/md";
import { IoIosLink } from "react-icons/io";
import { FaGithub, FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";

interface IParams {
  username: string;
}

const Games = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium">Oyunlar</h3>
      </div>
      
    </div>
  );
};

export default Games;
