import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { getOrCreateConversation } from "@/lib/conversation";
import ChatHeader from "@/app/(chat)/chat/components/chat/ChatHeader";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string
  }
}

const ChannelIdPage = async({ params }: MemberIdPageProps) => {
  
  const profile = await getCurrentUser();

  if (!profile) {
    return redirect("/authentication")
  }
  
  const currentMember = await prismadb.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id
    },
    include: {
      profile: true
    }
  });
  
  if (!currentMember) {
    return redirect(`/chat`)
  }

  const conversation = await getOrCreateConversation(currentMember.id, params.memberId);

  if (!conversation) {
    return redirect(`/chat/servers/${params.serverId}`)
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
      <div className="flex flex-col h-full">
        <ChatHeader 
          imageUrl={otherMember.profile.image ? otherMember.profile.image : "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E"}
          name={`${otherMember.profile.name} ${otherMember.profile.surname}`}
          serverId={params.serverId}
          type="conversation"
        />
      </div>
    )
  }
  
  export default ChannelIdPage
  