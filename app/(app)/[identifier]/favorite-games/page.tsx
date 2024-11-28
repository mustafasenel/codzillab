import getUserById from "@/actions/getUserById";
import FavoriteGames from "../components/FavoriteGames";

interface IParams {
  identifier: string;
}

const FavoriteGamesPage = async ({ params }: { params: IParams }) => {
  const user = await getUserById(params.identifier);

  return (
    <div className="w-full pb-20">
      <FavoriteGames user={user} /> 
    </div>
  );
};

export default FavoriteGamesPage;
