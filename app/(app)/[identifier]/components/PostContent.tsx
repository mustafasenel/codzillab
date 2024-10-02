import { FullOrganizationType, FullUserType } from "@/types";
import CreatePost from "../../app/components/CreatePost";
import { Card } from "@/components/ui/card";

interface PostContentProps {
  user?: FullUserType | FullOrganizationType | null;
  currentUser?: FullUserType | null;
}

const PostContent: React.FC<PostContentProps> = ({ user, currentUser }) => {
  return (
    <div className="flex flex-col gap-4">
      {(user?.id === currentUser?.id || (user as FullOrganizationType)?.ownerId === currentUser?.id) && <CreatePost user={currentUser!} />}
      <div className="flex flex-col space-y-4">
        <Card className="w-full h-60 flex items-center justify-center bg-muted" >
          Post 1
        </Card>
        <Card className="w-full h-60 flex items-center justify-center bg-muted">
          Post 2
        </Card>
        <Card className="w-full h-60 flex items-center justify-center bg-muted">
          Post 3
        </Card>
        <Card className="w-full h-60 flex items-center justify-center bg-muted">
          Post 4
        </Card>
      </div>
    </div>
  );
};

export default PostContent;
