import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "./profile-form"
import getCurrentUser from "@/actions/getCurrentUser"

export default async function SettingsProfilePage() {
  const currentUser = await getCurrentUser()
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profil Ayarları</h3>
        <p className="text-sm text-muted-foreground">
          Diğer kullanıcıların sizi göreceği biçim budur.
        </p>
      </div>
      <Separator />
      <ProfileForm user={currentUser!}/>
    </div>
  )
}
