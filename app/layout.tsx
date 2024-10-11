import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./prosemirror.css";
import { ThemeProvider } from "@/context/ThemeProvider";
import ToasterContext from "@/context/ToasterContext";
import AuthContext from "@/context/AuthContext";
import { EdgeStoreProvider } from "@/lib/edgestore";
import TanstackProvider from "@/context/QueryClientProvider";
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
            <EdgeStoreProvider>
              <TanstackProvider>{children}</TanstackProvider>
            </EdgeStoreProvider>
          </AuthContext>
          <ToasterContext />
        </ThemeProvider>
      </body>
    </html>
  );
}
