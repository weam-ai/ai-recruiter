"use client";

import React from "react";
import { PlayCircle, Headphones, ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

function SideMenu() {
  const pathname = usePathname();
  const router = useRouter();

    return (
    <aside className="sidebar bg-white w-64 h-full border-r border-gray-200 flex flex-col">
      {/* Header Section */}
      
      
      {/* Menu Section */}
      <div className="flex-1 p-4">
        <div className="flex flex-col space-y-1">
          <div
            className={`flex flex-row items-center p-3 rounded-md cursor-pointer transition-colors ${
              pathname.endsWith("/dashboard") ||
              pathname.includes("/interviews")
                ? "bg-gray-100"
                : "hover:bg-gray-50"
            }`}
            onClick={() => router.push("/dashboard")}
          >
            <PlayCircle className="w-5 h-5 mr-3 text-gray-700" />
            <span className={`font-medium ${
              pathname.endsWith("/dashboard") ||
              pathname.includes("/interviews")
                ? "text-gray-900 font-semibold"
                : "text-gray-700"
            }`}>
              Interviews
            </span>
          </div>
          <div
            className={`flex flex-row items-center p-3 rounded-md cursor-pointer transition-colors ${
              pathname.endsWith("/interviewers")
                ? "bg-gray-100"
                : "hover:bg-gray-50"
            }`}
            onClick={() => router.push("/dashboard/interviewers")}
          >
            <Headphones className="w-5 h-5 mr-3 text-gray-700" />
            <span className={`font-medium ${
              pathname.endsWith("/interviewers")
                ? "text-gray-900 font-semibold"
                : "text-gray-700"
            }`}>
              Interviewers
            </span>
          </div>
          
          {/* Back to App Button */}
          <div className="mt-4">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => {
                const currentUrl = window.location.href;
                const url = new URL(currentUrl);
                const mainDomain = `${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}`;
                window.location.href = mainDomain;
              }}
              className="w-full text-xs"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to App
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default SideMenu;
