import { Separator } from "@/components/ui/separator";
import { FavoriteGamesForm } from "./favorite-games-form";
import getCurrentUser from "@/actions/getCurrentUser";
import getGames from "@/actions/getGames";

export default async function SettingsAccountPage() {
  const currentUser = await getCurrentUser()
  const games = await getGames()
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Favori Oyunları</h3>
        <p className="text-sm text-muted-foreground">
          Sevdiğiniz ve oynamaktan keyif aldığınız oyunları oyun türlerini ve platformu ekleyebilirsiniz.
        </p>
      </div>
      <Separator />
      <FavoriteGamesForm user={currentUser!} systemGames={games!}/>
    </div>
  );
}
