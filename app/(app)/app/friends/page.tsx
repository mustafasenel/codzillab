import getCurrentUser from "@/actions/getCurrentUser";
import FriendsExplore from "./components/FriendsExplore";

interface IParams {
  username: string;
}

const Friends = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();
  return (
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-xl font-medium">Arkadaş Bul</h3>
      </div>
      <FriendsExplore currentUser={currentUser!}/>
    </div>
  );
};

export default Friends;
