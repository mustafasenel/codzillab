import getCurrentUser from '@/actions/getCurrentUser'
import { redirect } from 'next/navigation'
import prismadb from "@/lib/prismadb"

interface InviteCodePageProps {
    params: {
        inviteCode: string
    }
}

const InviteCodePage = async({ params }: InviteCodePageProps) => {

    const profile = await getCurrentUser();

    if (!profile) {
        return redirect("/authentication")
    }
    if (!params.inviteCode) {
        return redirect("/chat")
    }

    const exixtingServer = await prismadb.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    id: profile.id
                }
            }
        }
    });
    
    if (exixtingServer) {
        return redirect(`/chat/servers/${exixtingServer.id}`)
    }

    const server = await prismadb.server.update({
        where: {
            inviteCode: params.inviteCode
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id
                    }
                ]
            }
        }
    })

    if (server) {
        return redirect(`/chat/servers/${server.id}`)
    }
  return (
    <div>
      
    </div>
  )
}

export default InviteCodePage
