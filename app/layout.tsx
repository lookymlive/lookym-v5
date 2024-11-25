import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Providers from "@/app/providers";
import Navbar from "@/app/components/Navbar";
import VerificationStatus from "@/app/components/VerificationStatus";
import { auth } from "@/auth";
import { ThemeProvider } from "@/app/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lookym App",
  description: "Una aplicación moderna para subir videos de tiendas",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
              <VerificationStatus
                visible={session && !session?.user.verified ? true : false}
              />
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                {children}
              </main>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}