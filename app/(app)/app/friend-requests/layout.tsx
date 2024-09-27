import getCurrentUser from "@/actions/getCurrentUser";
import getGames from "@/actions/getGames";
import getGameBodyByUserId from "@/actions/getGameBodyByUserId";
import MainComp from "./components/MainComp";


export default async function FriendRequestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return <div>Kullanıcı bulunamadı</div>;
  }

  const games = await getGames();
  const userGameBodyAdverts = await getGameBodyByUserId(currentUser.id);



  return (
    <div className="w-full h-[calc(100vh-76px)] overflow-hidden">
      <div className="flex flex-col w-full h-screen space-y-4">
        <div className="sticky top-0">
          <MainComp games={games} userGameBodyAdverts={userGameBodyAdverts!} user={currentUser}/>
        </div>
        <div className="h-[calc(100vh-150px)] md:pb-20 pb-16">{children}</div>
      </div>
    </div>
  );
}