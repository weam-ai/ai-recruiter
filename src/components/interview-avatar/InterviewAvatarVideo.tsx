"use client";

import React, { forwardRef, useEffect, useRef } from "react";
import { Interview } from "@/types/interview";

interface InterviewAvatarVideoProps {
  isActive: boolean;
  currentQuestion: string;
  className?: string;
}

const InterviewAvatarVideo = forwardRef<HTMLVideoElement, InterviewAvatarVideoProps>(
  ({ isActive, currentQuestion, className = "" }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      if (ref) {
        if (typeof ref === "function") {
          ref(videoRef.current);
        } else {
          ref.current = videoRef.current;
        }
        console.log("Video element ref set:", videoRef.current);
      }
    }, [ref]);

    useEffect(() => {
      const video = videoRef.current;
      if (video) {
        console.log("Video element mounted:", video);
      }
    }, []);

    return (
      <div className={`relative w-full h-full ${className}`}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        >
          <track kind="captions" />
        </video>
        
        {/* Overlay with current question */}
        {currentQuestion && (
          <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0">
                <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">AI Interviewer</p>
                <p className="text-xs text-gray-300 mt-1">{currentQuestion}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Connection status indicator */}
        <div className="absolute top-4 right-4">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {isActive ? 'Live' : 'Connecting...'}
          </div>
        </div>
        
        {/* Question status indicator */}
        {currentQuestion && (
          <div className="absolute top-4 left-4">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              currentQuestion.includes('My next question is:') 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-purple-100 text-purple-800'
            }`}>
              {currentQuestion.includes('My next question is:') ? 'Asking Question' : 'Speaking'}
            </div>
          </div>
        )}
        
      </div>
    );
  }
);

InterviewAvatarVideo.displayName = "InterviewAvatarVideo";

export { InterviewAvatarVideo };
