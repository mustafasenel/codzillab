import getCurrentUser from "@/actions/getCurrentUser";
import getGames from "@/actions/getGames";
import getGameBodyByUserId from "@/actions/getGameBodyByUserId";
import MyRequests from "../components/MyRequests";

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
      <MyRequests user={currentUser} games={games} userGameBodyAdverts={userGameBodyAdverts!}/>
    </div>
  );
};

export default FeriendRequest;
