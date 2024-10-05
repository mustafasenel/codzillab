import getCurrentUser from "@/actions/getCurrentUser";

import MainComp from "./components/MainComp";
import getOrganizationsByUserById from "@/actions/getOrganizationsByUserId";

const App = async () => {
  const currentUser = await getCurrentUser();
  let organizations;
  
  if (currentUser?.id) {
    organizations = await getOrganizationsByUserById(currentUser?.id);
  }
  return (
    <div>
      <MainComp user={currentUser!} organizations={organizations}/>
    </div>
  );
};

export default App;
