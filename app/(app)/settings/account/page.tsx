import { Separator } from "@/components/ui/separator";
import { AccountForm } from "./account-form";
import getCurrentUser from "@/actions/getCurrentUser";

export default async function SettingsAccountPage() {
  const currentUser = await getCurrentUser()
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Hesap Ayarları</h3>
        <p className="text-sm text-muted-foreground">
          Hesap ayarlarınızı güncelleyebilir, şehir ve doğum tarihi
          bilgilerinizi ekleyebilirsiniz.
        </p>
      </div>
      <Separator />
      <AccountForm user={currentUser!}/>
    </div>
  );
}
