"use client";

import Link from "next/link";
import React, { useState } from "react";
import { ChevronDown, User, LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/auth.context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Navbar() {
  const { user, signOut } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="navbar fixed inset-x-0 top-0 bg-white border-b border-gray-200 z-50 h-16 py-4 shadow-sm">
      <div className="flex items-center justify-between h-full gap-2 px-8 mx-auto">
        <div className="flex flex-row gap-3 justify-center items-center">
          <Link href={"/dashboard"} className="flex items-center gap-2">
            {/* <p className="px-2 py-1 text-2xl font-bold text-black">
              Weam AI
            </p> */}
            <svg
              width={32}
              height={32}
              className={'fill-white'}
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
          >
              <circle cx="25" cy="25" r="25" fill="#6336e8" />
              <path
                  d="M34.6609 25.3958C34.9992 25.3958 35.242 25.4693 35.3891 25.6163C35.5509 25.7633 35.6318 25.9544 35.6318 26.1897C35.6318 26.5719 35.5141 26.91 35.2787 27.2041C35.0581 27.4981 34.705 27.6525 34.2195 27.6672C33.0574 27.6819 32.0129 27.5937 31.0861 27.4025C30.0563 29.5931 28.8132 31.4161 27.3568 32.8715C25.9151 34.3123 24.4881 35.0327 23.0759 35.0327C21.7813 35.0327 20.8104 34.349 20.1631 32.9818C19.5158 31.5998 19.148 29.7548 19.0597 27.4466C18.1771 30.0047 17.1767 31.9086 16.0587 33.1582C14.9553 34.4078 13.7784 35.0327 12.528 35.0327C11.1157 35.0327 10.0492 34.1579 9.32834 32.4084C8.60749 30.6442 8.24707 28.2773 8.24707 25.3076C8.24707 23.1464 8.43831 20.7721 8.8208 18.1846C8.92378 17.4496 9.10767 16.9424 9.37247 16.663C9.65198 16.369 10.086 16.222 10.6744 16.222C11.1157 16.222 11.4541 16.3175 11.6895 16.5087C11.9396 16.6998 12.0646 17.0526 12.0646 17.5672C12.0646 17.6701 12.0499 17.8686 12.0205 18.1626C11.5791 21.1764 11.3585 23.7418 11.3585 25.8589C11.3585 27.8289 11.5276 29.3505 11.866 30.4237C12.2044 31.4969 12.6604 32.0335 13.2341 32.0335C13.749 32.0335 14.3669 31.4969 15.0877 30.4237C15.8233 29.3358 16.5515 27.7333 17.2723 25.6163C17.9932 23.4846 18.6037 20.9485 19.1039 18.0082C19.2216 17.3319 19.4349 16.8688 19.7438 16.6189C20.0674 16.3543 20.5014 16.222 21.0457 16.222C21.5018 16.222 21.8328 16.3249 22.0387 16.5307C22.2594 16.7218 22.3697 17.0159 22.3697 17.4128C22.3697 17.648 22.355 17.8318 22.3256 17.9641C21.9137 20.3605 21.7077 22.7568 21.7077 25.1532C21.7077 26.7851 21.7592 28.0862 21.8622 29.0565C21.9799 30.0268 22.1932 30.7692 22.5021 31.2838C22.8258 31.7836 23.2892 32.0335 23.8923 32.0335C24.5985 32.0335 25.3855 31.5043 26.2535 30.4458C27.1214 29.3725 27.9158 28.0421 28.6367 26.4543C27.7393 25.8956 27.0626 25.1752 26.6065 24.2932C26.1505 23.3964 25.9225 22.3672 25.9225 21.2058C25.9225 20.0444 26.099 19.0667 26.4521 18.2728C26.8198 17.4643 27.3127 16.8615 27.9305 16.4646C28.5631 16.0676 29.2619 15.8691 30.0269 15.8691C30.9684 15.8691 31.7113 16.2073 32.2556 16.8836C32.8146 17.5598 33.0941 18.486 33.0941 19.6621C33.0941 21.3234 32.7337 23.1685 32.0129 25.1973C32.7631 25.3296 33.6458 25.3958 34.6609 25.3958ZM28.1512 21.0515C28.1512 22.4922 28.6146 23.5581 29.5414 24.249C30.1151 22.6025 30.402 21.2426 30.402 20.1694C30.402 19.5519 30.3211 19.1035 30.1593 18.8242C29.9974 18.5301 29.7768 18.3831 29.4973 18.3831C29.1001 18.3831 28.7764 18.6183 28.5263 19.0888C28.2762 19.5445 28.1512 20.1988 28.1512 21.0515Z"
                  className={'fill-white'}
              />
              <path
                  d="M42.0001 26.7819C42.0001 27.981 41.041 28.953 39.858 28.953C38.6749 28.953 37.7158 27.981 37.7158 26.7819C37.7158 25.5829 38.6749 24.6108 39.858 24.6108C41.041 24.6108 42.0001 25.5829 42.0001 26.7819Z"
                  className={'fill-white'}
              
              />
          </svg>
            <span className="font-semibold text-gray-900 dark:text-white">Weam AI</span>
          </Link>

        </div>
        
        {/* Back to App Button */}
        <div className="flex items-center">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => {
              const currentUrl = window.location.href;
              const url = new URL(currentUrl);
              const mainDomain = `${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}`;
              window.location.href = mainDomain;
            }}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to App
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
