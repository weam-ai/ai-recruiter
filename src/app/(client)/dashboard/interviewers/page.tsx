"use client";

import React from "react";
import Image from "next/image";

function Interviewers() {
  // Static interviewer data to match the design
  const staticInterviewers = [
    {
      id: "lisa",
      name: "Explorer Lisa",
      image: "/interviewers/Lisa.png",
      description: "AI Interviewer"
    },
    {
      id: "bob", 
      name: "Empathetic Bob",
      image: "/interviewers/Bob.png",
      description: "AI Interviewer"
    }
  ];

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
        
        <div className="flex gap-8">
          {staticInterviewers.map((interviewer) => (
            <div 
              key={interviewer.id} 
              className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-200 p-4 rounded-lg hover:bg-gray-50"
            >
              <div className="w-24 h-24 mb-4 flex items-center justify-center">
                <Image
                  src={interviewer.image}
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
          ))}
        </div>
      </div>
    </div>
  );
}

export default Interviewers;
