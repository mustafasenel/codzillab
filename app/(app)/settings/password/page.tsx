import { Separator } from "@/components/ui/separator";
import { PasswordForm } from "./password-form";
import getCurrentUser from "@/actions/getCurrentUser";
import { FaDiscord, FaGithub, FaGoogle } from "react-icons/fa";

export default async function SettingsAccountPage() {
  const currentUser = await getCurrentUser()
  const userAccount = currentUser?.account?.find(
    (account) => currentUser.id === account.userId
  );

  const authMethod = userAccount ? userAccount.provider : "Not Connected";
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>

        {userAccount && (
          <div className="flex items-center w-fit mt-2 border-2 rounded-md py-4 px-4">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">
                {authMethod == "discord" ? <FaDiscord /> : <FaGoogle />}
                </div>
                <p className="text-sm text-muted-foreground">
                  {authMethod== 'discord' ? 'Discord' : 'Google' } ile bağlısınız
                </p>
              </div>
          </div>
        )}
      </div>
      <Separator />
      <PasswordForm user={currentUser!}/>
    </div>
  );
}
