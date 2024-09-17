import { FullUserType } from "@/types";
import Navbar from "./admin-navbar";

interface ContentLayoutProps {
  title: string;
  currentUser: FullUserType;
  children: React.ReactNode;
}

export function ContentLayout({ title, children, currentUser }: ContentLayoutProps) {
  return (
    <div>
      <Navbar user={currentUser} title={title}/>
      <div className="pt-8 pb-8 px-4 sm:px-8">{children}</div>
    </div>
  );
}
