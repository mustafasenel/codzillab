import getCurrentUser from "@/actions/getCurrentUser";
import GamesComp from "./components/Games";
import getGames from "@/actions/getGames";

interface IParams {
  username: string;
}

const Games = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();

  const games = await getGames()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium">Oyunlar</h3>
      </div>
      <GamesComp games={games!}/>
    </div>
  );
};

export default Games;
