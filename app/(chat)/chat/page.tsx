import getCurrentUser from "@/actions/getCurrentUser"
import prismadb from "@/lib/prismadb"
import { redirect } from "next/navigation";
import InitialModal from "./components/initial-modal";
import Link from "next/link";

const SetupPage = async () => {
    const currentUser = await getCurrentUser()

    const server = await prismadb.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: currentUser?.id
                }
            }
        }
    });
    
    if (server) {
        return redirect(`/chat/${server.id}`)
    }

    return <div>

        <InitialModal />
        
        </div>
}

export default SetupPage;

