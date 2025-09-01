import Link from "next/link";
import React from "react";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { ChevronDown, Building2 } from "lucide-react";

function Navbar() {
  return (
    <div className="navbar fixed inset-x-0 top-0 bg-white border-b border-gray-200 z-50 h-16 py-4 shadow-sm">
      <div className="flex items-center justify-between h-full gap-2 px-8 mx-auto">
        <div className="flex flex-row gap-3 justify-center items-center">
          <Link href={"/dashboard"} className="flex items-center gap-2">
            <p className="px-2 py-1 text-2xl font-bold text-black">
              FoloUp
            </p>
            <span className="text-sm font-normal text-gray-500">Beta</span>
          </Link>
          <p className="my-auto text-xl text-gray-400">/</p>
          <div className="my-auto flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Weam</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
        <div className="flex items-center">
          <UserButton afterSignOutUrl="/sign-in" signInUrl="/sign-in" />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
