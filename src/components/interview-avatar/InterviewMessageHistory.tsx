"use client";

import React, { useRef, useEffect } from "react";
import { Interview } from "@/types/interview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

interface Message {
  role: "avatar" | "user";
  content: string;
  timestamp: Date;
}

interface InterviewMessageHistoryProps {
  messages: Message[];
  interview: Interview;
  className?: string;
}

export function InterviewMessageHistory({
  messages,
  interview,
  className = "",
}: InterviewMessageHistoryProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Interview Conversation</h3>
        <p className="text-sm text-gray-600">
          {interview.name} • {interview.time_duration} minutes
        </p>
      </div>
      
      <ScrollArea ref={scrollAreaRef} className="h-64 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Bot className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">Conversation will appear here once the interview starts</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className={`${
                    message.role === "avatar" 
                      ? "bg-blue-100 text-blue-600" 
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {message.role === "avatar" ? (
                      <Bot className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`flex-1 ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}>
                  <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
                    message.role === "avatar"
                      ? "bg-blue-50 text-gray-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
