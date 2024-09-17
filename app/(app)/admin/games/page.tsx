import getCurrentUser from "@/actions/getCurrentUser";
import GamesComp from "./components/Games";
import getGames from "@/actions/getGames";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import Link from "next/link";
interface IParams {
  username: string;
}

const Games = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();

  const games = await getGames()

  return (
    <ContentLayout title="Oyunlar" currentUser={currentUser!}>
      <Breadcrumb className="pb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/dashboard">Admin</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Oyunlar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <GamesComp games={games}/>
    </ContentLayout>
  );
};

export default Games;
