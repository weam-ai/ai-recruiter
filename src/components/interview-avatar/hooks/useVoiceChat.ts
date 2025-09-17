"use client";

import { useCallback, useRef } from "react";
import { StreamingAvatar } from "@heygen/streaming-avatar";

export function useVoiceChat() {
  const voiceChatRef = useRef<any>(null);

  const startVoiceChat = useCallback(async () => {
    try {
      console.log("Starting voice chat...");
      
      // Initialize audio context for better audio handling
      if (typeof window !== 'undefined' && window.AudioContext) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        if (audioContext.state === 'suspended') {
          console.log("Resuming audio context...");
          await audioContext.resume();
        }
        console.log("Audio context ready, state:", audioContext.state);
      }

      // HeyGen handles microphone access internally
      // We just need to ensure audio context is ready
      console.log("Voice chat started successfully");
    } catch (error) {
      console.error("Error starting voice chat:", error);
      throw error;
    }
  }, []);

  const stopVoiceChat = useCallback(async () => {
    try {
      // Clean up any voice chat resources
      if (voiceChatRef.current) {
        voiceChatRef.current = null;
      }
      console.log("Voice chat stopped");
    } catch (error) {
      console.error("Error stopping voice chat:", error);
    }
  }, []);

  return {
    startVoiceChat,
    stopVoiceChat,
  };
}
