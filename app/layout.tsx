import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import "./prosemirror.css";
import { ThemeProvider } from "@/context/ThemeProvider";
import ToasterContext from "@/context/ToasterContext";
import AuthContext from "@/context/AuthContext";
import { EdgeStoreProvider } from "@/lib/edgestore";
import TanstackProvider from "@/context/QueryClientProvider";
import ModalProvider from "./(chat)/chat/components/providers/modal-provider";
import { SocketProvider } from "@/context/socket-provider";
import { PusherProvider } from "@/context/PusherProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Levelhaus",
  description: "Levelhaus",
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
                <TanstackProvider>
                  {children}
                  {/* Modal Provider Chat bölümü için */}
                  <ModalProvider />
                </TanstackProvider>
              </EdgeStoreProvider>
          </AuthContext>
          <ToasterContext />
        </ThemeProvider>
      </body>
    </html>
  );
}
