"use client";

import React from "react";
import { PlayCircle, Headphones } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

function SideMenu() {
  const pathname = usePathname();
  const router = useRouter();

    return (
    <aside className="sidebar bg-white w-full md:w-64 h-auto md:h-full border-b md:border-r border-gray-200 flex flex-col">
      {/* Header Section */}
      
      
      {/* Menu Section */}
        <div className="flex flex-row md:flex-col gap-2 md:gap-0 md:space-y-1 flex-1 p-2 md:p-4">
          <div
            className={`flex flex-row items-center py-1.5 px-2 md:p-3 rounded-md cursor-pointer transition-colors ${
              pathname.endsWith("/dashboard") ||
              pathname.includes("/interviews")
                ? "bg-gray-100"
                : "hover:bg-gray-50"
            }`}
            onClick={() => router.push("/dashboard")}
          >
            <PlayCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-gray-700" />
            <span className={`font-medium leading-tight ${
              pathname.endsWith("/dashboard") ||
              pathname.includes("/interviews")
                ? "text-gray-900 font-semibold"
                : "text-gray-700"
            }`}>
              Interviews
            </span>
          </div>
          <div
            className={`flex flex-row items-center py-1.5 px-2 md:p-3 rounded-md cursor-pointer transition-colors ${
              pathname.endsWith("/interviewers")
                ? "bg-gray-100"
                : "hover:bg-gray-50"
            }`}
            onClick={() => router.push("/dashboard/interviewers")}
          >
            <Headphones className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-gray-700" />
            <span className={`font-medium leading-tight ${
              pathname.endsWith("/interviewers")
                ? "text-gray-900 font-semibold"
                : "text-gray-700"
            }`}>
              Interviewers
            </span>
          </div>
        </div>
    </aside>
  );
}

export default SideMenu;
