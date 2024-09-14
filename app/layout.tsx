import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./prosemirror.css";
import { ThemeProvider } from "@/context/ThemeProvider";
import ToasterContext from "@/context/ToasterContext";
import AuthContext from "@/context/AuthContext";
import { EdgeStoreProvider } from "@/lib/edgestore";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Codzillab",
  description: "Codzillab",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthContext>
            <EdgeStoreProvider>{children}</EdgeStoreProvider>
          </AuthContext>
          <ToasterContext />
        </ThemeProvider>
      </body>
    </html>
  );
}
