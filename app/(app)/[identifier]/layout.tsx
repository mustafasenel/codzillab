import Navbar from "@/components/Navbar";
import getCurrentUser from "@/actions/getCurrentUser";
import Cover from "./components/Cover";
import ProfileDetails from "./components/ProfileDetails";
import getUserById from "@/actions/getUserById";
import RightSide from "./components/RightSide";
import { Gamepad2, SquarePen, User, Users, UsersRound } from "lucide-react";
import { MenuNav } from "./components/menu-nav";
import Link from "next/link";
import getOrganizationBySlug from "@/actions/getOrganizationBySlug";
import getOrganizationsByUserById from "@/actions/getOrganizationsByUserId";
import { Suspense } from "react";
import LoadingModal from "@/components/LoadingModal";

interface IParams {
  identifier: string;
}

export default async function ProfilePageLayout({
  children,
  params,
}: {
  params: IParams;
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  const user = await getUserById(params.identifier);
  const organization = await getOrganizationBySlug(params.identifier);

  let organizations;
  if(currentUser) {
    organizations = await getOrganizationsByUserById(currentUser.id);
  }

  const sidebarNavItems = user
    ? [
        {
          title: "Gönderiler",
          href: `/${user.username}`,
          icon: <SquarePen className="h-6 w-6" />,
        },
        {
          title: "Oyun Arkadaşları",
          href: `/${user.username}/gamebody`,
          icon: <Users className="h-6 w-6" />,
        },
        {
          title: "Favori Oyunlar",
          href: `/${user.username}/favorite-games`,
          icon: <Gamepad2 className="h-6 w-6" />,
        },
        {
          title: "Takipçiler",
          href: `/${user.username}/followers`,
          icon: <UsersRound className="h-6 w-6" />,
        },
        {
          title: "Takip Edilenler",
          href: `/${user.username}/followings`,
          icon: <UsersRound className="h-6 w-6" />,
        },
      ]
    : organization
    ? [
      {
        title: "Gönderiler",
        href: `/${organization.slug}`,
        icon: <SquarePen className="h-6 w-6" />,
      },
      {
        title: "Takipçiler",
        href: `/${organization.slug}/followers`,
        icon: <UsersRound className="h-6 w-6" />,
      }
      ]
    : []; 

  if (!user && !organization) {
    return (
      <div className="w-full h-full">
        <Navbar user={currentUser!} organizations={organizations}/>
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 text-6xl font-bold tracking-tight text-foreground sm:text-7xl">404</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Oops, it looks like the page you're looking for doesn't exist.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                prefetch={false}
              >
                Ana Sayfaya git
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const profileUser = user || organization; // Use user if available, otherwise organization
  

  return (
    <Suspense fallback={<LoadingModal />}>

    <div className="w-full h-full">
      <Navbar user={currentUser!} organizations={organizations}/>
      <div className="md:container mx-auto">
        <div className="w-full flex-col py-2 md:px-0 px-2">
          <Cover user={profileUser} currentUser={currentUser} />
          <ProfileDetails user={profileUser} currentUser={currentUser} identifier={params.identifier}/>
          <div className="flex gap-4 pt-4">
            <MenuNav items={sidebarNavItems} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 pt-4">
            <div className="md:col-span-4 order-2 md:order-1">
              {children}
            </div>
            <div className="md:col-span-2 order-1 md:order-2">
              <RightSide user={profileUser!} currentUser={currentUser!} />
            </div>
          </div>
        </div>
      </div>
    </div>
    </Suspense>
  );
}
