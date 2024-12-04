import getCurrentUser from '@/actions/getCurrentUser';
import { redirect } from 'next/navigation';
import prismadb from "@/lib/prismadb";

interface ServerIdPageProps {
  params: {
    serverId: string;
  }
}

const ServerIdPage = async({ params }: ServerIdPageProps) => {
  const profile = await getCurrentUser();

  if (!profile) {
    return redirect("/authentication");
  }

  const server = await prismadb.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id
        }
      }
    },
    include: {
      channels: {
        where: {
          name: "general"
        },
        orderBy: {
          createdAd: "asc"
        }
      }
    }
  })

  const initialChannel = server?.channels[0];

  if (initialChannel?.name !== "general") {
    return null;
  }

  return redirect(`/chat/servers/${params.serverId}/channels/${initialChannel?.id}`);
}

export default ServerIdPage
