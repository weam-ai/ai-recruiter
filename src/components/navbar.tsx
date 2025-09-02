"use client";

import Link from "next/link";
import React, { useState } from "react";
import { ChevronDown, Building2, User, LogOut } from "lucide-react";
import { useAuth, useOrganization } from "@/contexts/auth.context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Navbar() {
  const { user, signOut } = useAuth();
  const { organization } = useOrganization();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
  };

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
            <span className="text-sm font-medium text-gray-700">
              {organization?.name || "Organization"}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
        <div className="flex items-center">
          <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || "User"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="flex items-center gap-2 text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
