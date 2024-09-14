import getCurrentUser from "@/actions/getCurrentUser";
import { Separator } from "@/components/ui/separator";
import MainComp from "./components/MainComp";
import getGames from "@/actions/getGames";
import getGameBodyByUserId from "@/actions/getGameBodyByUserId";

interface IParams {
  username: string;
}

const FeriendRequest = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return <div>Kullanıcı bulunamadı</div>;
  }

  const games = await getGames();
  const userGameBodyAdverts = await getGameBodyByUserId(currentUser.id);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium">Oyun Arkadaşları</h3>
      </div>
      <Separator />
      <MainComp user={currentUser} games={games} userGameBodyAdverts={userGameBodyAdverts!}/>
    </div>
  );
};

export default FeriendRequest;
