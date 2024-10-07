import getCurrentUser from "@/actions/getCurrentUser";
import OrganizationExplore from "./components/OrganizationExplore";
import getOrganizations from "@/actions/getOrganizations";

interface IParams {
  username: string;
}

const Organizations = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();
  const organizations = await getOrganizations()
  return (
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-xl font-medium">Sayfalar</h3>
      </div>
      <OrganizationExplore organizations={organizations} currentUser={currentUser!}/>
    </div>
  );
};

export default Organizations;
