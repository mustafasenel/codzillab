import getCurrentUser from "@/actions/getCurrentUser";
import MainComp from "./components/MainComp";

interface IParams {
  username: string;
}

const AdminApp = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();
  return (
    <div>
      <MainComp user={currentUser!}/>
    </div>
  );
};

export default AdminApp;
