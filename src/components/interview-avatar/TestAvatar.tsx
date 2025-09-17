"use client";

import React, { useState } from "react";
import { InterviewAvatar } from "./InterviewAvatar";
import { Interview } from "@/types/interview";

// Mock interview data for testing
const mockInterview: Interview = {
  id: "test-interview",
  name: "Test Interview",
  description: "This is a test interview to verify the HeyGen avatar integration.",
  objective: "Test the avatar functionality",
  time_duration: "5",
  theme_color: "#6637EC",
  is_anonymous: false,
  questions: [
    { question: "Tell me about yourself." },
    { question: "What are your strengths?" },
    { question: "Why do you want this position?" }
  ],
  interviewer_id: "test-interviewer",
  user: {
    id: "test-user",
    email: "test@example.com"
  },
  companyId: "test-company",
  createdAt: new Date(),
  updatedAt: new Date()
};

export function TestAvatar() {
  const [isTestMode, setIsTestMode] = useState(false);

  if (!isTestMode) {
    return (
      <div className="p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">HeyGen Avatar Test</h2>
        <p className="mb-4 text-gray-600">
          This is a test component to verify the HeyGen avatar integration works correctly.
        </p>
        <button
          onClick={() => setIsTestMode(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Start Avatar Test
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <button
          onClick={() => setIsTestMode(false)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Back to Test Menu
        </button>
      </div>
      <InterviewAvatar
        interview={mockInterview}
        onInterviewStart={() => console.log("Interview started")}
        onInterviewEnd={() => console.log("Interview ended")}
        onQuestionAsked={(question) => console.log("Question asked:", question)}
        onResponseReceived={(response) => console.log("Response received:", response)}
        mode="voice"
      />
    </div>
  );
}
