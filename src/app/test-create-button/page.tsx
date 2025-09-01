"use client";

import React, { useState } from "react";
import CreateInterviewCard from "@/components/dashboard/interview/createInterviewCard";
import CreateInterviewModal from "@/components/dashboard/interview/createInterviewModal";

export default function TestCreateButton() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateInterview = () => {
    console.log("Create interview clicked");
    setIsCreateModalOpen(true);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Create Button</h1>
      <div className="flex items-center space-x-4">
        <div onClick={handleCreateInterview}>
          <CreateInterviewCard />
        </div>
      </div>
      
      <CreateInterviewModal 
        open={isCreateModalOpen} 
        setOpen={setIsCreateModalOpen} 
      />
    </div>
  );
}
