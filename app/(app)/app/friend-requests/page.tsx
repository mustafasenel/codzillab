import getCurrentUser from "@/actions/getCurrentUser";
import getGames from "@/actions/getGames";
import BrowseContent from "./components/BrowseContent";

interface IParams {
  username: string;
}

const FeriendRequest = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return <div>Kullanıcı bulunamadı</div>;
  }

  const games = await getGames();

  return (
    <div className="space-y-6 h-[calc(100vh-150px)]">
      <BrowseContent games={games} user={currentUser} />
    </div>
  );
};

export default FeriendRequest;
