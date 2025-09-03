"use client";

import { Inter } from "next/font/google";
import { cn } from "../../lib/utils";
import Navbar from "../../components/navbar";
import Providers from "../../components/providers";
import { AuthProvider } from "../../contexts/auth.context";
import { Toaster } from "sonner";
import SideMenu from "../../components/sideMenu";
import { usePathname } from "next/navigation";
import ProtectedRoute from "../../components/ProtectedRoute";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isProtectedRoute = pathname.includes("/dashboard") || pathname.includes("/interviews");

  return (
    <AuthProvider>
      <Providers>
        <div className="h-screen">
          {isProtectedRoute ? (
            <ProtectedRoute>
              <Navbar />
              <div className="grid-layout grid grid-cols-[256px_1fr] h-screen pt-16">
                <SideMenu />
                <main className="main-content overflow-y-auto bg-white">
                  {children}
                </main>
              </div>
            </ProtectedRoute>
          ) : (
            <main className="h-screen bg-white">
              {children}
            </main>
          )}
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
    </AuthProvider>
  );
}
