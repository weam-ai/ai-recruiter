"use client";

import { useState, useRef, useCallback } from "react";
import StreamingAvatar, { StreamingEvents } from "@heygen/streaming-avatar";
import { useStreamingAvatarContext } from "./StreamingAvatarProvider";
import { StreamingAvatarSessionState } from "./StreamingAvatarProvider";

export function useStreamingAvatarSession() {
  const { basePath } = useStreamingAvatarContext();
  const [sessionState, setSessionState] = useState<StreamingAvatarSessionState>(
    StreamingAvatarSessionState.INACTIVE
  );
  const [stream, setStream] = useState<MediaStream | null>(null);
  const avatarRef = useRef<StreamingAvatar | null>(null);

  const initAvatar = useCallback((token: string) => {
    console.log("Initializing avatar with token:", token.substring(0, 20) + "...");
    console.log("Base path:", basePath);
    
    if (avatarRef.current) {
      console.log("Destroying existing avatar");
      avatarRef.current.destroy();
    }

    try {
      console.log("Creating new StreamingAvatar instance...");
      const avatar = new StreamingAvatar({
        baseUrl: basePath,
        token,
      });

      console.log("StreamingAvatar created successfully:", avatar);
      avatarRef.current = avatar;

      // Set up event listeners
      avatar.on(StreamingEvents.STREAM_READY, (event) => {
        console.log("Stream ready:", event);
        console.log("Stream detail:", event.detail);
        setSessionState(StreamingAvatarSessionState.CONNECTED);
        
        // event.detail IS the MediaStream object itself, not an object containing a stream
        if (event.detail && event.detail instanceof MediaStream) {
          console.log("Setting stream directly from event.detail:", event.detail);
          console.log("Stream tracks:", event.detail.getTracks());
          setStream(event.detail);
        } else {
          console.log("event.detail is not a MediaStream:", typeof event.detail);
        }
      });

      avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        console.log("Stream disconnected");
        setSessionState(StreamingAvatarSessionState.INACTIVE);
        setStream(null);
      });

      avatar.on("error", (error) => {
        console.error("Avatar error:", error);
        setSessionState(StreamingAvatarSessionState.ERROR);
        setStream(null);
      });

      return avatar;
    } catch (error) {
      console.error("Error initializing avatar:", error);
      setSessionState(StreamingAvatarSessionState.ERROR);
      throw error;
    }
  }, [basePath]);

  const startAvatar = useCallback(async (config: any) => {
    if (!avatarRef.current) {
      throw new Error("Avatar not initialized");
    }

    setSessionState(StreamingAvatarSessionState.CONNECTING);
    
    try {
      console.log("Calling createStartAvatar with config:", config);
      
      // First try to create a session if needed
      try {
        await avatarRef.current.createStartAvatar(config);
        console.log("createStartAvatar completed successfully");
      } catch (sessionError) {
        console.error("createStartAvatar failed:", sessionError);
        // Try alternative method
        console.log("Trying alternative startAvatar method...");
        await avatarRef.current.startAvatar(config);
        console.log("startAvatar completed successfully");
      }
    } catch (error) {
      console.error("Error starting avatar:", error);
      setSessionState(StreamingAvatarSessionState.ERROR);
      throw error;
    }
  }, []);

  const stopAvatar = useCallback(async () => {
    if (avatarRef.current) {
      try {
        await avatarRef.current.stopAvatar();
      } catch (error) {
        console.error("Error stopping avatar:", error);
      }
      avatarRef.current.destroy();
      avatarRef.current = null;
    }
    setSessionState(StreamingAvatarSessionState.INACTIVE);
    setStream(null);
  }, []);

  return {
    initAvatar,
    startAvatar,
    stopAvatar,
    sessionState,
    stream,
  };
}
