import { Separator } from "@/components/ui/separator";
import getCurrentUser from "@/actions/getCurrentUser";
import getOrganizationsByUserById from "@/actions/getOrganizationsByUserId";
import MyOrganizations from "./my-organizations";

export default async function OrganizationPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return (
      <div className="text-center">
        <h3 className="text-lg font-medium">Erişim Reddedildi</h3>
        <p className="text-sm text-muted-foreground">
          Organizasyon ayarlarına erişim için giriş yapmalısınız.
        </p>
      </div>
    );
  }

  const myOrganizations = await getOrganizationsByUserById(currentUser.id);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Organizasyon Ayarları</h3>
        <p className="text-sm text-muted-foreground">
          Bir organizasyon oluşturun veya organizasyonlarınızı yönetin.
        </p>
      </div>
      <Separator />
      <MyOrganizations organizations={myOrganizations}/>
    </div>
  );
}
