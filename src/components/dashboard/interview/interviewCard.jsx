"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/utils";
import { useInterviews } from "@/contexts/interviews.context";
import { toast } from "sonner";
const config = require('../../../config/config');

function InterviewCard({ interview }) {
  const router = useRouter();
  const { generateSecureUrl } = useInterviews();
  const [isCopied, setIsCopied] = useState(false);

  const handleCardClick = () => {
    router.push(`/interviews/${interview.id || interview._id}`);
  };

  const handleShareClick = async (e) => {
    e.stopPropagation();
    
    try {
      // Generate secure URL with token
      const secureUrl = await generateSecureUrl(interview.id || interview._id);
      
      if (secureUrl) {
        window.open(secureUrl, '_blank');
      } else {
        // Fallback to regular URL if token generation fails
        const baseUrl = window.location.origin;
        const callUrl = `${baseUrl}` + config.APP.API_BASE_PATH + `/call/${interview.id || interview._id}`;
        window.open(callUrl, '_blank');
      }
    } catch (error) {
      console.error('Error generating secure URL:', error);
      // Fallback to regular URL
      const baseUrl = window.location.origin;
      const callUrl = `${baseUrl}` + config.APP.API_BASE_PATH + `/call/${interview.id || interview._id}`;
      window.open(callUrl, '_blank');
    }
  };

  const handleCopyClick = async (e) => {
    e.stopPropagation();
    
    // Set copied state immediately for visual feedback
    setIsCopied(true);
    
    try {
      // Generate secure URL with token
      const secureUrl = await generateSecureUrl(interview.id || interview._id);
      
      if (secureUrl) {
        navigator.clipboard.writeText(secureUrl);
        toast.success("Secure link copied to clipboard!", {
          position: "bottom-right",
          duration: 3000,
        });
      } else {
        // Fallback to regular URL if token generation fails
        const baseUrl = window.location.origin;
        const callUrl = `${baseUrl}` + config.APP.API_BASE_PATH + `/call/${interview.id || interview._id}`;
        navigator.clipboard.writeText(callUrl);
        toast.warning("Regular link copied to clipboard (secure link generation failed)", {
          position: "bottom-right",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error generating secure URL:', error);
      // Fallback to regular URL
      const baseUrl = window.location.origin;
      const callUrl = `${baseUrl}` + config.APP.API_BASE_PATH + `/call/${interview.id || interview._id}`;
      navigator.clipboard.writeText(callUrl);
      toast.error("Regular link copied to clipboard (error occurred)", {
        position: "bottom-right",
        duration: 3000,
      });
    }
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };


  return (
    <div className="bg-white relative p-0 mt-4 inline-block cursor-pointer h-60 w-56 ml-1 mr-3 rounded-xl shrink-0 overflow-hidden shadow-md">
      <div className="p-0 h-full" onClick={handleCardClick}>
        {/* Top purple section with interview name */}
        <div className="w-full h-36 bg-brand flex items-center justify-center relative">
          <h3 className="font-semibold tracking-tight text-white text-lg px-2 text-center">
            {interview.name || "Untitled Interview"}
          </h3>
        </div>
        
        {/* Bottom white section with avatar and response count */}
        <div className="flex flex-row items-center justify-between p-4 h-15">
          <div className="flex-shrink-0">
            <Image
              alt="Picture of the interviewer"
              width={60}
              height={60}
              className="object-cover object-center rounded-full"
              src={interview.interviewer?.image || getImageUrl("/interviewers/Lisa.png")}
              loading="lazy"
            />
          </div>
          <div className="text-black text-sm font-semibold ml-3">
            Responses: <span className="font-normal">{interview.response_count || 0}</span>
          </div>
        </div>
        
        {/* Top-right action buttons */}
        <div className="absolute top-2 right-2 flex gap-1">
          {/* <Button 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-white hover:bg-gray-50 text-gray-700 border-0 shadow-sm py-1 px-1 h-6 w-6"
            onClick={handleShareClick}
            title="Open interview"
          >
            <ArrowUpRight className="w-3 h-3" />
          </Button> */}
          <Button 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-white hover:bg-gray-50 text-gray-700 border-0 shadow-sm py-1 px-1 h-6 w-6"
            onClick={handleCopyClick}
            title={isCopied ? "Copied!" : "Copy current link"}
          >
            {isCopied ? (
              <Check className="w-3 h-3 text-green-600" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InterviewCard;
