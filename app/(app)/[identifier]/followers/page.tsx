import getCurrentUser from "@/actions/getCurrentUser";
import getUserById from "@/actions/getUserById";
import FollowersComp from "../components/FollowersComp";

interface IParams {
  identifier: string;
}

const FollowersPage = async ({ params }: { params: IParams }) => {
  const user = await getUserById(params.identifier);
  const currentUser = await getCurrentUser()
  return (
    <div className="w-full pb-20">
      <FollowersComp userId={user?.id!} currentUser={currentUser!} /> 
    </div>
  );
};

export default FollowersPage;
