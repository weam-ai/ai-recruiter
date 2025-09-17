"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { StreamingAvatar } from "@heygen/streaming-avatar";

// Define the session state enum locally as a fallback
export enum StreamingAvatarSessionState {
  INACTIVE = "inactive",
  CONNECTING = "connecting", 
  CONNECTED = "connected",
  ERROR = "error"
}

interface StreamingAvatarContextType {
  basePath: string;
}

const StreamingAvatarContext = createContext<StreamingAvatarContextType | undefined>(undefined);

interface StreamingAvatarProviderProps {
  children: ReactNode;
  basePath: string;
}

export function StreamingAvatarProvider({ children, basePath }: StreamingAvatarProviderProps) {
  return (
    <StreamingAvatarContext.Provider value={{ basePath }}>
      {children}
    </StreamingAvatarContext.Provider>
  );
}

export function useStreamingAvatarContext() {
  const context = useContext(StreamingAvatarContext);
  if (context === undefined) {
    throw new Error("useStreamingAvatarContext must be used within a StreamingAvatarProvider");
  }
  return context;
}
