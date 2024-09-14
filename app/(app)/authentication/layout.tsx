import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pulse | Login",
  description: "Pulse | Login",
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
