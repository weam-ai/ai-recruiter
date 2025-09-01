"use client";

import React, { useState, useEffect, useRef } from "react";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useInterviews } from "@/contexts/interviews.context";
import CreateInterviewCard from "@/components/dashboard/interview/createInterviewCard";
import InterviewCard from "@/components/dashboard/interview/interviewCard";
import CreateInterviewModal from "@/components/dashboard/interview/createInterviewModal";

function Interviews() {
  const { organization } = useOrganization();
  const { user } = useUser();
  const { interviews, getAllInterviews, interviewsLoading } = useInterviews();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const hasLoadedInterviews = useRef(false);

  // Fetch interviews when component mounts (only once)
  useEffect(() => {
    if (organization?.id && user?.id && !hasLoadedInterviews.current) {
      console.log("Fetching interviews for:", { userId: user.id, orgId: organization.id });
      getAllInterviews(user.id, organization.id);
      hasLoadedInterviews.current = true;
    } else if (!organization?.id || !user?.id) {
      console.log("Missing organization or user:", { organization: organization?.id, user: user?.id });
    }
  }, [organization?.id, user?.id]); // Removed getAllInterviews from dependencies

  const handleCreateInterview = () => {
    console.log("Create interview clicked - handleCreateInterview called");
    console.log("Current modal state:", isCreateModalOpen);
    setIsCreateModalOpen(true);
    console.log("Modal state set to true");
  };

  console.log("Dashboard render - modal state:", isCreateModalOpen);
  console.log("Interviews data:", { interviews, interviewsLoading, count: interviews?.length });

  // Sample interview for demonstration (remove this in production)
  const sampleInterview = {
    id: "sample",
    name: "Similique beatae nih",
    response_count: 1
  };



  return (
    <div className="p-8">
      <div className="flex flex-col">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            My Interviews
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Start getting responses now!
          </p>
        </div>
        
        {/* Cards Section */}
        <div className="flex gap-8">
          {/* Create Interview Card */}
          <div onClick={handleCreateInterview} style={{ cursor: 'pointer' }}>
            <CreateInterviewCard />
          </div>
          
          {/* Existing Interviews */}
          {interviewsLoading ? (
            <div className="h-60 w-56 rounded-xl bg-gray-300 flex items-center justify-center">
              <p className="text-gray-600">Loading interviews...</p>
            </div>
          ) : interviews && interviews.length > 0 ? (
            interviews.map((interview) => (
              <InterviewCard key={interview.id || interview._id} interview={interview} />
            ))
          ) : (
            // Show sample interview for demonstration
            <InterviewCard interview={sampleInterview} />
          )}
        </div>
      </div>
      
      <CreateInterviewModal 
        open={isCreateModalOpen} 
        setOpen={setIsCreateModalOpen} 
      />
    </div>
  );
}

export default Interviews;
