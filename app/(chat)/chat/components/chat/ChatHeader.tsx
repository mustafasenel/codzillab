import { Hash, Menu } from "lucide-react";
import MobileToggle from "../mobile-toggle";
import UserAvatar from "../user-avatar";
import SocketIndicator from "../socket-indicator";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

const ChatHeader = ({ serverId, name, type, imageUrl }: ChatHeaderProps) => {
  return (
    <div className="text-base font-semibold px-3 flex items-center h-12 border-b-2">
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <Hash className="w-5 h-5 text-muted-foreground mr-2" />
      )}
      {type === "conversation" && (
        <UserAvatar src={imageUrl} className="h-8 w-8 md:w-8 md:h-8 mr-2" />
      )}
      <p className="font-semibold text-base ">{name}</p>
      <div className="ml-auto flex items-center">
        <SocketIndicator />
      </div>
    </div>
  );
};

export default ChatHeader;
