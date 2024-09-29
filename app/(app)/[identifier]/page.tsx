import getCurrentUser from "@/actions/getCurrentUser";
import getUserById from "@/actions/getUserById";
import PostContent from "./components/PostContent";

interface IParams {
  username: string;
}

const UserDetail = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();
  const user = await getUserById(params.username);

  return (
    <div className="w-full pb-20">
      <PostContent user={user} currentUser={currentUser}/>
    </div>
  );
};

export default UserDetail;
