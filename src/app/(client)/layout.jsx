"use client";

import { Inter } from "next/font/google";
import { cn } from "../../lib/utils";
import Navbar from "../../components/navbar";
import Providers from "../../components/providers";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import SideMenu from "../../components/sideMenu";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  return (
    <ClerkProvider
      signInFallbackRedirectUrl={"/dashboard"}
      afterSignOutUrl={"/sign-in"}
    >
      <Providers>
        {!pathname.includes("/sign-in") &&
          !pathname.includes("/sign-up") && <Navbar />}
        
        <div className="grid-layout grid grid-cols-[256px_1fr] h-screen pt-16">
          {!pathname.includes("/sign-in") &&
            !pathname.includes("/sign-up") && <SideMenu />}
          <main className="main-content overflow-y-auto bg-white">
            {children}
          </main>
        </div>
        
        <Toaster
          toastOptions={{
            classNames: {
              toast: "bg-white",
              title: "text-black",
              description: "text-red-400",
              actionButton: "bg-indigo-400",
              cancelButton: "bg-orange-400",
              closeButton: "bg-white-400",
            },
          }}
        />
      </Providers>
    </ClerkProvider>
  );
}
