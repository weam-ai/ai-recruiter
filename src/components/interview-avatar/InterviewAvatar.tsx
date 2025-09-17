"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  AvatarQuality,
  VoiceChatTransport,
  VoiceEmotion,
  StartAvatarRequest,
  STTProvider,
  ElevenLabsModel,
  StreamingEvents,
  TaskType,
  TaskMode,
} from "@heygen/streaming-avatar";
import { useMemoizedFn, useUnmount } from "ahooks";
import { toast } from "sonner";

import { Interview } from "@/types/interview";
import { INTERVIEW_AVATAR_CONFIG, INTERVIEW_AVATAR_BEHAVIOR, InterviewMode } from "@/lib/heygen-constants";
import { InterviewAvatarVideo } from "./InterviewAvatarVideo";
import { InterviewAvatarControls } from "./InterviewAvatarControls";
import { InterviewMessageHistory } from "./InterviewMessageHistory";
import { useStreamingAvatarSession } from "./hooks/useStreamingAvatarSession";
import { useVoiceChat } from "./hooks/useVoiceChat";
import { StreamingAvatarProvider, StreamingAvatarSessionState } from "./hooks/StreamingAvatarProvider";

interface InterviewAvatarProps {
  interview: Interview;
  onInterviewStart?: () => void;
  onInterviewEnd?: () => void;
  onQuestionAsked?: (question: string) => void;
  onResponseReceived?: (response: string) => void;
  mode?: InterviewMode;
  className?: string;
}

function InterviewAvatarComponent({
  interview,
  onInterviewStart,
  onInterviewEnd,
  onQuestionAsked,
  onResponseReceived,
  mode = "voice",
  className = "",
}: InterviewAvatarProps) {
  const { initAvatar, startAvatar, stopAvatar, sessionState, stream } = useStreamingAvatarSession();
  const { startVoiceChat, stopVoiceChat } = useVoiceChat();

  const [config, setConfig] = useState<StartAvatarRequest>({
    ...INTERVIEW_AVATAR_CONFIG,
    // Customize based on interview settings
    voice: {
      ...INTERVIEW_AVATAR_CONFIG.voice,
      rate: interview.time_duration ? Math.max(0.8, 1.2 - (interview.time_duration / 60)) : 1.0,
    },
  });

  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [interviewMessages, setInterviewMessages] = useState<Array<{
    role: "avatar" | "user";
    content: string;
    timestamp: Date;
  }>>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const mediaStream = useRef<HTMLVideoElement>(null);
  const interviewActiveRef = useRef(false);
  const avatarRef = useRef<any>(null);

  async function fetchAccessToken() {
    try {
      const basePath = process.env.NEXT_PUBLIC_API_BASE_PATH || '';
      const response = await fetch(`${basePath}/api/heygen/get-access-token`, {
        method: "POST",
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch access token: ${response.status}`);
      }
      
      const token = await response.text();
      return token;
    } catch (error) {
      console.error("Error fetching HeyGen access token:", error);
      throw error;
    }
  }

  const startInterviewSession = useMemoizedFn(async () => {
    try {
      console.log("Starting interview session...");
      
      const newToken = await fetchAccessToken();
      console.log("Access token received:", newToken.substring(0, 20) + "...");
      
      const avatar = initAvatar(newToken);
      console.log("Avatar initialized:", avatar);
      avatarRef.current = avatar;

      // Set up event listeners
      avatar.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
        console.log("Avatar started talking", e);
      });

      avatar.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
        console.log("Avatar stopped talking", e);
      });

      avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        console.log("Stream disconnected - checking if should end interview");
        console.log("interviewActiveRef.current:", interviewActiveRef.current);
        
        // Only call onInterviewEnd if the interview was actually active
        if (interviewActiveRef.current) {
          console.log("Interview was active - calling onInterviewEnd");
          onInterviewEnd?.();
        } else {
          console.log("Interview was not active - not calling onInterviewEnd");
        }
        
        setIsInterviewActive(false);
        interviewActiveRef.current = false;
      });

      avatar.on(StreamingEvents.STREAM_READY, (event) => {
        console.log("Stream ready:", event.detail);
        setIsInterviewActive(true);
        interviewActiveRef.current = true;
        onInterviewStart?.();
        
          // Wait a moment for avatar to be fully ready, then start greeting
          setTimeout(async () => {
            // Start with greeting and then ask first question
            const greeting = INTERVIEW_AVATAR_BEHAVIOR.greeting;
            console.log("About to speak greeting:", greeting);
            setCurrentQuestion(greeting);
            addMessage("avatar", greeting);
            
      // Trigger the avatar to speak the greeting
      if (avatarRef.current && !isSpeaking) {
        console.log("Speaking greeting:", greeting);
        setIsSpeaking(true);
        try {
          await avatarRef.current.speak({
            text: greeting,
            taskType: TaskType.TALK,
            taskMode: TaskMode.SYNC,
          });
          console.log("Greeting speech completed");
        } catch (error) {
          console.error("Error speaking greeting:", error);
        } finally {
          setIsSpeaking(false);
        }
      }
            
            // After greeting, start asking interview questions
            setTimeout(async () => {
              await startInterviewQuestions();
            }, 3000); // Wait 3 seconds after greeting
          }, 1000); // Wait 1 second for avatar to be fully ready
      });

      avatar.on(StreamingEvents.USER_START, (event) => {
        console.log("User started talking:", event);
        // User is now speaking - microphone is working
      });

      avatar.on(StreamingEvents.USER_STOP, (event) => {
        console.log("User stopped talking:", event);
        // User stopped speaking
      });

      avatar.on(StreamingEvents.USER_END_MESSAGE, (event) => {
        console.log("User end message:", event);
        if (event.detail?.message) {
          addMessage("user", event.detail.message);
          onResponseReceived?.(event.detail.message);
          
          // Move to next question after user responds
          if (isWaitingForResponse) {
            console.log("User responded, moving to next question");
            setIsWaitingForResponse(false);
            setCurrentQuestionIndex(prev => prev + 1);
            
            // Wait a bit then ask next question
            setTimeout(async () => {
              await startInterviewQuestions();
            }, 2000);
          }
        }
      });

      avatar.on(StreamingEvents.USER_TALKING_MESSAGE, (event) => {
        console.log("User talking message:", event);
      });

        avatar.on(StreamingEvents.AVATAR_TALKING_MESSAGE, (event) => {
          console.log("Avatar talking message event:", event);
          console.log("Avatar talking message detail:", event.detail);
          if (event.detail?.message) {
            setCurrentQuestion(event.detail.message);
            onQuestionAsked?.(event.detail.message);
          }
        });

      avatar.on(StreamingEvents.AVATAR_END_MESSAGE, (event) => {
        console.log("Avatar end message:", event);
        if (event.detail?.message) {
          addMessage("avatar", event.detail.message);
        }
      });

      console.log("Starting avatar with config:", config);
      console.log("Config details:", JSON.stringify(config, null, 2));
      await startAvatar(config);
      console.log("Avatar started successfully");

          if (mode === "voice" || mode === "mixed") {
            console.log("Starting voice chat...");
            await startVoiceChat();
            console.log("Voice chat started");
            
            // Ensure the avatar is ready for voice interaction
            console.log("Avatar ready for voice interaction");
          }
    } catch (error) {
      console.error("Error starting interview session:", error);
      console.error("Error details:", error.message, error.stack);
      toast.error(`Failed to start interview session: ${error.message}`);
    }
  });

  const stopInterviewSession = useMemoizedFn(async () => {
    try {
      console.log("stopInterviewSession called - interviewActiveRef.current:", interviewActiveRef.current);
      
      if (mode === "voice" || mode === "mixed") {
        await stopVoiceChat();
      }
      await stopAvatar();
      setIsInterviewActive(false);
      
      // Only call onInterviewEnd if the interview was actually active
      if (interviewActiveRef.current) {
        console.log("Interview was active - calling onInterviewEnd from stopInterviewSession");
        onInterviewEnd?.();
      } else {
        console.log("Interview was not active - not calling onInterviewEnd from stopInterviewSession");
      }
      
      interviewActiveRef.current = false;
    } catch (error) {
      console.error("Error stopping interview session:", error);
    }
  });

  const addMessage = (role: "avatar" | "user", content: string) => {
    setInterviewMessages(prev => [
      ...prev,
      {
        role,
        content,
        timestamp: new Date(),
      }
    ]);
  };

  const startInterviewQuestions = useMemoizedFn(async () => {
    if (currentQuestionIndex < interview.questions.length) {
      const question = interview.questions[currentQuestionIndex];
      console.log(`Asking question ${currentQuestionIndex + 1}:`, question.question);
      
      const questionText = `${INTERVIEW_AVATAR_BEHAVIOR.questionPrefix} ${question.question}`;
      setCurrentQuestion(questionText);
      addMessage("avatar", questionText);
      setIsWaitingForResponse(true);
      
      // Trigger the avatar to speak the question
      if (avatarRef.current && !isSpeaking) {
        console.log("Speaking question:", questionText);
        setIsSpeaking(true);
        try {
          await avatarRef.current.speak({
            text: questionText,
            taskType: TaskType.TALK,
            taskMode: TaskMode.SYNC,
          });
          console.log("Question speech completed");
        } catch (error) {
          console.error("Error speaking question:", error);
        } finally {
          setIsSpeaking(false);
        }
      }
    } else {
      // All questions asked, end interview
      console.log("All questions completed, ending interview");
      const closingText = INTERVIEW_AVATAR_BEHAVIOR.closingStatement;
      setCurrentQuestion(closingText);
      addMessage("avatar", closingText);
      
      // Trigger the avatar to speak the closing statement
      if (avatarRef.current && !isSpeaking) {
        console.log("Speaking closing statement:", closingText);
        setIsSpeaking(true);
        try {
          await avatarRef.current.speak({
            text: closingText,
            taskType: TaskType.TALK,
            taskMode: TaskMode.SYNC,
          });
          console.log("Closing statement speech completed");
        } catch (error) {
          console.error("Error speaking closing statement:", error);
        } finally {
          setIsSpeaking(false);
        }
      }
      
      // End interview after closing statement
      setTimeout(() => {
        onInterviewEnd?.();
      }, 5000);
    }
  });

  useUnmount(() => {
    console.log("InterviewAvatar component unmounting - calling stopInterviewSession");
    stopInterviewSession();
  });

  // Don't auto-start - let user click the start button

  useEffect(() => {
    console.log("InterviewAvatar component mounted");
  }, []);

  useEffect(() => {
    if (stream && mediaStream.current) {
      console.log("Setting video stream:", stream);
      console.log("Stream tracks:", stream.getTracks());
      
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        console.log("Video metadata loaded, starting playback");
        mediaStream.current!.play();
      };
    }
  }, [stream]);

  return (
    <div className={`w-full flex flex-col gap-4 ${className}`}>
      <div className="flex flex-col rounded-xl bg-white border-2 border-gray-200 overflow-hidden">
        <div className="relative w-full aspect-video overflow-hidden flex flex-col items-center justify-center bg-gray-50">
          {sessionState === StreamingAvatarSessionState.CONNECTED ? (
            <InterviewAvatarVideo 
              ref={mediaStream} 
              isActive={isInterviewActive}
              currentQuestion={currentQuestion}
            />
          ) : sessionState === StreamingAvatarSessionState.CONNECTING ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Connecting to AI Interviewer...
              </h3>
              <p className="text-sm text-gray-500">
                Please wait while we initialize your interview session
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">👤</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                AI Interviewer Ready
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Click start to begin your interview with our AI interviewer
              </p>
              <button
                onClick={startInterviewSession}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Interview
              </button>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-3 items-center justify-center p-4 border-t border-gray-200 w-full">
          {sessionState === StreamingAvatarSessionState.CONNECTED ? (
            <InterviewAvatarControls
              onEndInterview={stopInterviewSession}
              isInterviewActive={isInterviewActive}
              mode={mode}
            />
          ) : sessionState === StreamingAvatarSessionState.CONNECTING ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">Connecting to AI interviewer...</span>
            </div>
          ) : (
            <div className="flex flex-row gap-4">
              <button
                onClick={() => startInterviewSession()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Voice Interview
              </button>
              <button
                onClick={() => startInterviewSession()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Start Text Interview
              </button>
            </div>
          )}
        </div>
      </div>
      
      {sessionState === StreamingAvatarSessionState.CONNECTED && (
        <InterviewMessageHistory 
          messages={interviewMessages}
          interview={interview}
        />
      )}
    </div>
  );
}

export default function InterviewAvatar(props: InterviewAvatarProps) {
  return (
    <StreamingAvatarProvider basePath="https://api.heygen.com">
      <InterviewAvatarComponent {...props} />
    </StreamingAvatarProvider>
  );
}
