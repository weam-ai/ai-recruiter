"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ArrowUp, Copy } from "lucide-react";
import Image from "next/image";

function InterviewCard({ interview }) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/interviews/${interview.id || interview._id}`);
  };

  return (
    <Card
      className="h-60 w-56 rounded-xl overflow-hidden shadow-md border-0 cursor-pointer hover:scale-105 transition-all duration-200"
      onClick={handleCardClick}
    >
      <CardContent className="p-0 h-full flex flex-col">
        {/* Purple top section - exact color from screenshot */}
        <div className="w-full h-32 bg-purple-400 flex items-center justify-center relative">
          {/* Top-right icons */}
          <div className="absolute top-2 right-2 flex gap-1">
            <button 
              className="p-1 text-white hover:bg-purple-500 rounded transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Handle expand/duplicate
                console.log("Expand/duplicate clicked");
              }}
            >
              <ArrowUp size={14} />
            </button>
            <button 
              className="p-1 text-white hover:bg-purple-500 rounded transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Handle copy
                navigator.clipboard.writeText(interview.name || "Interview");
                console.log("Copied to clipboard");
              }}
            >
              <Copy size={14} />
            </button>
          </div>
          
          {/* Interview name */}
          <span className="text-white text-lg font-semibold text-center px-2 truncate">
            {interview.name || "Untitled Interview"}
          </span>
        </div>
        
        {/* White bottom section */}
        <div className="flex-1 p-4 bg-white flex items-center">
          {/* Left side - Avatar and response count */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image
                src="/user-icon.png"
                alt="User avatar"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm text-gray-700 font-medium">
              Responses: {interview.response_count || 0}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default InterviewCard;
