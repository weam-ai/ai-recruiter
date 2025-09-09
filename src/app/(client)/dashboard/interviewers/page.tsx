"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useInterviewers } from "@/contexts/interviewers.context";
import { useClerk } from "@/contexts/auth.context";
import createInterviewerCard from "@/components/dashboard/interviewer/createInterviewerCard";
import { default as InterviewerDetailsModal } from "@/components/dashboard/interviewer/interviewerDetailsModal";
import { Interviewer } from "@/types/interviewer";
import { getImageUrl } from "@/lib/utils";

function Interviewers() {
  const { interviewers, getAllInterviewers, interviewersLoading } = useInterviewers();
  const { user } = useClerk();
  const [selectedInterviewer, setSelectedInterviewer] = useState<Interviewer | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      getAllInterviewers(user.companyId || "");
    }
  }, [user, getAllInterviewers]);

  // Refresh interviewers when the context changes
  useEffect(() => {
    if (user && interviewers.length === 0 && !interviewersLoading) {
      getAllInterviewers(user.companyId || "");
    }
  }, [user, interviewers.length, interviewersLoading, getAllInterviewers]);

  const handleInterviewerClick = (interviewer: Interviewer) => {
    setSelectedInterviewer(interviewer);
    setIsModalOpen(true);
  };

  const CreateInterviewerCard = createInterviewerCard;

  return (
    <div className="p-8">
      <div className="flex flex-col">
        <div className="flex flex-col mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Interviewers
          </h2>
          <h3 className="text-base text-gray-600 font-medium">
            Get to know them by clicking the profile.
          </h3>
        </div>
        
        <div className="flex gap-8 flex-wrap">
          {/* Create Interviewer Button */}
          <div className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-200 p-4 rounded-lg hover:bg-gray-50">
            <div className="w-24 h-24 mb-4 flex items-center justify-center">
              <CreateInterviewerCard />
            </div>
            <p className="text-base font-semibold text-center text-gray-800">
              Add Interviewer
            </p>
          </div>

          {/* Existing Interviewers */}
          {interviewersLoading ? (
            <div className="flex items-center justify-center">
              <div className="text-gray-500">Loading interviewers...</div>
            </div>
          ) : (
            interviewers.map((interviewer) => (
              <div 
                key={interviewer._id || interviewer.id} 
                className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-200 p-4 rounded-lg hover:bg-gray-50 border-2 border-gray-200"
                onClick={() => handleInterviewerClick(interviewer)}
              >
                <div className="w-24 h-24 mb-4 flex items-center justify-center">
                  <Image
                    src={interviewer.image || getImageUrl("/avatars/7.png")}
                    alt={interviewer.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-base font-semibold text-center text-gray-800">
                  {interviewer.name}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Interviewer Details Modal */}
      {selectedInterviewer && (
        <InterviewerDetailsModal 
          interviewer={selectedInterviewer}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Interviewers;
