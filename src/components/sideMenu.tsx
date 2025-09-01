"use client";

import React from "react";
import { PlayCircle, Headphones } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

function SideMenu() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="sidebar bg-gray-100 p-6 w-64 h-full border-r border-gray-200">
      <div className="flex flex-col gap-1">
        <div className="flex flex-col justify-between gap-2">
          <div
            className={`flex flex-row p-3 rounded-md hover:bg-gray-200 cursor-pointer transition-colors ${
              pathname.endsWith("/dashboard") ||
              pathname.includes("/interviews")
                ? "bg-purple-100 text-purple-800 border border-purple-200"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => router.push("/dashboard")}
          >
            <PlayCircle className="w-5 h-5 mr-2" />
            <p className="font-medium">Interviews</p>
          </div>
          <div
            className={`flex flex-row p-3 rounded-md hover:bg-gray-200 cursor-pointer transition-colors ${
              pathname.endsWith("/interviewers")
                ? "bg-purple-100 text-purple-800 border border-purple-200"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => router.push("/dashboard/interviewers")}
          >
            <Headphones className="w-5 h-5 mr-2" />
            <p className="font-medium">Interviewers</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default SideMenu;
