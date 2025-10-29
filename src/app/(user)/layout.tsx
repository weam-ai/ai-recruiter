import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Providers from "@/components/providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Recruiter",
  description: "AI powered Interviews",
  openGraph: {
    title: "AI Recruiter",
    description: "AI-powered Interviews",
    siteName: "AI Recruiter",
    images: [
      {
        url: "/ai-recruiter.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <head>
        <link rel="icon" href="/browser-user-icon.ico" />
      </head>
      <Providers>
        {children}
        <Toaster
          toastOptions={{
            classNames: {
              toast: "bg-white border-2 border-indigo-400",
              title: "text-black",
              description: "text-red-400",
              actionButton: "bg-indigo-400",
              cancelButton: "bg-orange-400",
              closeButton: "bg-lime-400",
            },
          }}
        />
      </Providers>
    </>
  );
}
