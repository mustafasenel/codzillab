import Link from "next/link";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import getCurrentUser from "@/actions/getCurrentUser";
import MainComp from "../components/MainComp";

export default async function DashboardPage() {

  const user = await getCurrentUser();

  const currentUser = await getCurrentUser()
  return (
    <ContentLayout title="Dashboard" currentUser={currentUser!}>
      <Breadcrumb className="pb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/dashboard">Admin</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <MainComp user={user!}/>
    </ContentLayout>
  );
}
