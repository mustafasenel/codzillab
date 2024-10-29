import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Codzillab | Giriş Yap",
  description: "Codzillab | Giriş Yap",
};

export default async function Authlayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <main className="h-full w-full">
      { children }
    </main>
  );
}
