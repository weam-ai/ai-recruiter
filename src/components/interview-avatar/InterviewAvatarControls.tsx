"use client";

import React from "react";
import { Mic, MicOff, MessageSquare, PhoneOff, Pause, Play } from "lucide-react";
import { InterviewMode } from "@/lib/heygen-constants";

interface InterviewAvatarControlsProps {
  onEndInterview: () => void;
  isInterviewActive: boolean;
  mode: InterviewMode;
  onModeChange?: (mode: InterviewMode) => void;
  onPause?: () => void;
  onResume?: () => void;
  isPaused?: boolean;
  className?: string;
}

export function InterviewAvatarControls({
  onEndInterview,
  isInterviewActive,
  mode,
  onModeChange,
  onPause,
  onResume,
  isPaused = false,
  className = "",
}: InterviewAvatarControlsProps) {
  return (
    <div className={`flex flex-col gap-3 w-full ${className}`}>
      {/* Mode indicator and controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            isInterviewActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
          }`}></div>
          <span className="text-sm font-medium text-gray-700">
            {isInterviewActive ? 'Interview Active' : 'Interview Inactive'}
          </span>
        </div>
        
        {isPaused ? (
          <button
            onClick={onResume}
            className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <Play className="w-4 h-4" />
            Resume
          </button>
        ) : (
          <button
            onClick={onPause}
            className="flex items-center gap-2 px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
          >
            <Pause className="w-4 h-4" />
            Pause
          </button>
        )}
      </div>

      {/* Mode selection */}
      {onModeChange && (
        <div className="flex gap-2">
          <button
            onClick={() => onModeChange('voice')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              mode === 'voice' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Mic className="w-4 h-4" />
            Voice
          </button>
          <button
            onClick={() => onModeChange('text')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              mode === 'text' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Text
          </button>
          <button
            onClick={() => onModeChange('mixed')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              mode === 'mixed' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Mic className="w-4 h-4" />
            <MessageSquare className="w-4 h-4" />
            Mixed
          </button>
        </div>
      )}

      {/* Main control buttons */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={onEndInterview}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          <PhoneOff className="w-4 h-4" />
          End Interview
        </button>
      </div>

      {/* Status messages */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          {mode === 'voice' && 'Speak naturally - the AI will listen and respond'}
          {mode === 'text' && 'Type your responses in the chat below'}
          {mode === 'mixed' && 'Use voice or text - whatever feels most comfortable'}
        </p>
      </div>
    </div>
  );
}
