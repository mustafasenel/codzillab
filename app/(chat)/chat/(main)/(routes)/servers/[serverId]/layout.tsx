import getCurrentUser from "@/actions/getCurrentUser";
import ServerSidebar from "@/app/(chat)/chat/components/server/ServerSidebar";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";

const ServerIdLayot = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await getCurrentUser();
  if (!profile) {
    return redirect("/authentication");
  }

  const server = await prismadb.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return redirect("/chat")
  }

  return (
  <div className="h-full">
    <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={params.serverId}/>
    </div>
    <main className="h-full md:pl-60">

    {children}
    </main>
    </div>);
};

export default ServerIdLayot;
