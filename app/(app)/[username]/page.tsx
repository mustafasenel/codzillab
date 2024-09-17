import getCurrentUser from "@/actions/getCurrentUser";
import getUserById from "@/actions/getUserById";
import MainProfileComponent from "./components/MainProfileComponent";
import getGameBodyByUserId from "@/actions/getGameBodyByUserId";

interface IParams {
  username: string;
}

const UserDetail = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();
  const user = await getUserById(params.username);

  const userGameBodyAdverts = await getGameBodyByUserId(user?.id);

  return (
    <div className="w-full pb-20">
      <MainProfileComponent user={user!} currentUser={currentUser!} userGameBodyAdverts={userGameBodyAdverts!}/>
    </div>
  );
};

export default UserDetail;
