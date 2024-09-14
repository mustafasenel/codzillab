import getCurrentUser from "@/actions/getCurrentUser";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";

export default async function Home() {

  const currentUser = await getCurrentUser()
  return (
    <main className="w-full h-full">
      <Navbar user={currentUser!}/>
      <Header/>
      <div className="container w-full flex">

      </div>
    </main>
  );
}
