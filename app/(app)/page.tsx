import getCurrentUser from "@/actions/getCurrentUser";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MessageSquareIcon, TrophyIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation"; 

export default async function Home() {
  const currentUser = await getCurrentUser();
  if (currentUser?.email) {
    redirect("/app")
  } 
  return (
    <div className="w-full h-full">
      <Navbar user={currentUser!} />
      <main className="flex-1">
        <section className=" relative w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          <div className="circlePosition w-[300px] h-[300px] bg-[#8c5cf2]/40 rounded-full absolute top-[30%] left-[35%] -translate-x-1/4 -translate-y-1/2 blur-[120px]"></div>
          <div className="circlePosition w-[300px] h-[300px] bg-[#ededed]/40 rounded-full absolute  top-[60%] right-[35%] -translate-x-1/4 -translate-y-1/2 blur-[120px]"></div>
          <div className="container px-4 md:px-6 z-40 relative">
            <div className="flex flex-col items-center space-y-4 text-center">
              <span className="bg-accent px-5 py-2 rounded-full text-sm border border-foreground/20 text-nowrap">
                Yeni oyun arkadaşlarıyla tanışmaya hazır olun 🎉
              </span>
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Oyuncuların Yeni Dünyası
                </h1>
                <p className="mx-auto max-w-[700px]  md:text-xl">
                  En büyük gaming sosyal ağına katılın. Zaferlerinizi paylaşın,
                  takımınızı kurun, oyun deneyiminizi bir üst seviyeye taşıyın
                  ve yeni oyun arkadaşları bulun.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Link
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "bg-purple-600 hover:bg-purple-700"
                  )}
                  href={"/authentication"}
                  type="submit"
                >
                  Hemen Katıl
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section
          className="w-full py-12 md:py-24 lg:py-32"
          style={{ backgroundImage: `url("/anasayfabg.png")` }}
        >
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 items-center justify-center">
              <div className="flex flex-col items-center space-y-3 text-center">
                <UsersIcon className="h-12 w-12 text-purple-500" />
                <h2 className="text-xl font-bold text-white">Takımını Bul</h2>
                <p className="text-sm text-gray-400">
                  Tutkunuzu ve oyun tarzınızı paylaşan oyuncularla bağlanın.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <MessageSquareIcon className="h-12 w-12 text-purple-500" />
                <h2 className="text-xl font-bold text-white">
                  Eş Zamanlı Sohbet
                </h2>
                <p className="text-sm text-gray-400">
                  Oyun sırasında ekibinizle sorunsuz bir şekilde iletişim kurun.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <TrophyIcon className="h-12 w-12 text-purple-500" />
                <h2 className="text-xl font-bold text-white">
                  Başarımlar Kazan
                </h2>
                <p className="text-sm text-gray-400">
                  Oyun yeteneğinizi sergileyin ve liderlik tablolarında
                  yükselin.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Level atlamaya hazır mısın?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-400 md:text-xl">
                  Codzillab'a bağlanan, rekabet eden ve zafer kazanan binlerce
                  oyuncuya katılın.
                </p>
              </div>
              <Link
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "bg-purple-600 hover:bg-purple-700"
                )}
                href={"/authentication"}
                type="submit"
              >
                Hemen Hesap Oluştur
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-700">
        <p className="text-xs text-gray-400">
          © 2024 Codzillab. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4 text-gray-400"
            href="#"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4 text-gray-400"
            href="#"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
