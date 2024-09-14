import getCurrentUser from "@/actions/getCurrentUser";

import { Separator } from "@/components/ui/separator";

import { MdPerson } from "react-icons/md";
import { IoIosLink } from "react-icons/io";
import { FaGithub, FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import MainComp from "./components/MainComp";

interface IParams {
  username: string;
}

const App = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();
  return (
    <div>
      <MainComp user={currentUser!}/>
    </div>
  );
};

export default App;
