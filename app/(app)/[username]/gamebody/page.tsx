import getCurrentUser from "@/actions/getCurrentUser";
import getUserById from "@/actions/getUserById";
import GameBodyContent from "../components/GameBodyContent";
import getGameBodyByUserId from "@/actions/getGameBodyByUserId";

interface IParams {
  username: string;
}

const GameBody = async ({ params }: { params: IParams }) => {
  const user = await getUserById(params.username);
  const userGameBodyAdverts = await getGameBodyByUserId(user?.id);

  return (
    <div className="w-full pb-20">
      <GameBodyContent user={user!} userGameBodyAdverts={userGameBodyAdverts!}/>
    </div>
  );
};

export default GameBody;
