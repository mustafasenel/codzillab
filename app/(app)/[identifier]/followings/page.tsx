import getCurrentUser from "@/actions/getCurrentUser";
import getUserById from "@/actions/getUserById";
import FollowingsComp from "../components/FollowingsComp";

interface IParams {
  identifier: string;
}

const FollowingsPage = async ({ params }: { params: IParams }) => {
  const user = await getUserById(params.identifier);
  const currentUser = await getCurrentUser()
  return (
    <div className="w-full pb-20">
      <FollowingsComp userId={user?.id!} currentUser={currentUser!} /> 
    </div>
  );
};

export default FollowingsPage;
