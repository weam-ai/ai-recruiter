"use client";

import React from "react";
import { Plus } from "lucide-react";

function CreateInterviewCard() {
  return (
    <div className="bg-white relative p-0 mt-4 inline-block cursor-pointer h-60 w-56 ml-1 mr-3 rounded-xl shrink-0 overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all duration-200">
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <Plus size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-700 font-medium text-base">Create an Interview</p>
        </div>
      </div>
    </div>
  );
}

export default CreateInterviewCard;
