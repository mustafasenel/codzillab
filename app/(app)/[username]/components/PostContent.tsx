import { FullUserType } from "@/types";
import CreatePost from "../../app/components/CreatePost";
import { Card } from "@/components/ui/card";

interface PostContentProps {
  user?: FullUserType | null;
  currentUser?: FullUserType | null;
}

const PostContent: React.FC<PostContentProps> = ({ user, currentUser }) => {
  return (
    <div className="flex flex-col gap-4">
      {user?.id == currentUser?.id && <CreatePost user={currentUser!} />}
      <div className="flex flex-col space-y-4">
        <Card className="w-full h-60 flex items-center justify-center">
          Post 1
        </Card>
        <Card className="w-full h-60 flex items-center justify-center">
          Post 2
        </Card>
        <Card className="w-full h-60 flex items-center justify-center">
          Post 3
        </Card>
        <Card className="w-full h-60 flex items-center justify-center">
          Post 4
        </Card>
      </div>
    </div>
  );
};

export default PostContent;
