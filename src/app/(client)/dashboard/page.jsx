"use client";

import React, { useState, useEffect, useRef } from "react";
import { useOrganization, useUser } from "@/contexts/auth.context";
import { useInterviews } from "@/contexts/interviews.context";
import CreateInterviewCard from "@/components/dashboard/interview/createInterviewCard";
import InterviewCard from "@/components/dashboard/interview/interviewCard";
import CreateInterviewModal from "@/components/dashboard/interview/createInterviewModal";

function Interviews() {
  const { organization } = useOrganization();
  const { user, isLoaded } = useUser();
  const { interviews, getAllInterviews, interviewsLoading } = useInterviews();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const hasLoadedInterviews = useRef(false);

  // Fetch interviews when component mounts (only once)
  useEffect(() => {
    if (user?.companyId && !hasLoadedInterviews.current) {
      console.log("Fetching interviews for companyId:", user.companyId);
      getAllInterviews(user.companyId);
      hasLoadedInterviews.current = true;
    } else if (!user?.companyId) {
      console.log("Missing companyId:", { companyId: user?.companyId });
    }
  }, [user?.companyId]); // Removed getAllInterviews from dependencies

  // Show loading state while auth is loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to access the dashboard</p>
          <button 
            onClick={() => window.location.href = '/sign-in'}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

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
    id: "weam-ricky",
    name: "Ricky Sample Interview",
    response_count: 1,
    readable_slug: "weam-ricky",
    interviewer_id: 1, // Lisa's ID from constants
    is_active: true,
    description: "Assess your technical expertise and project experience in tackling complex challenges."
  };



  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Interviews
        </h1>
        <p className="text-gray-600">
          Start getting responses now!
        </p>
      </div>
      
      {/* Cards Section */}
      <div className="flex flex-wrap gap-0">
        {/* Create Interview Card */}
        <div onClick={handleCreateInterview} style={{ cursor: 'pointer' }} className="mr-4">
          <CreateInterviewCard />
        </div>
        
        {/* Existing Interviews */}
        {interviewsLoading ? (
          <div className="h-60 w-56 rounded-xl bg-gray-300 flex items-center justify-center ml-1 mr-3">
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
      
      <CreateInterviewModal 
        open={isCreateModalOpen} 
        setOpen={setIsCreateModalOpen} 
      />
    </div>
  );
}

export default Interviews;
