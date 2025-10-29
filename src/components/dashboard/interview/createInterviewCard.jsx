"use client";

import React from "react";
import { Plus } from "lucide-react";

function CreateInterviewCard() {
  return (
    
      <div className="flex flex-col items-center mr-3 justify-center p-6 bg-white cursor-pointer rounded-md shrink-0 overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all duration-200">
        <div className="text-center">
          <Plus size={36} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-700 font-medium text-base">Create an Interview</p>
        </div>
      </div>
    
  );
}

export default CreateInterviewCard;
