import {
  AvatarQuality,
  VoiceEmotion,
  ElevenLabsModel,
  VoiceChatTransport,
  STTProvider,
  StartAvatarRequest,
} from "@heygen/streaming-avatar";

// Interview-specific avatar configuration
export const INTERVIEW_AVATAR_CONFIG: StartAvatarRequest = {
  avatarName: "Bryan_FitnessCoach_public", // Professional male avatar
  quality: AvatarQuality.Low, // Use Low quality like reference
  voice: {
    rate: 1.0, // Normal rate
    emotion: VoiceEmotion.NEUTRAL, // Neutral emotion for interviews
    model: ElevenLabsModel.eleven_flash_v2_5,
  },
  language: "en", // English for interviews
  voiceChatTransport: VoiceChatTransport.WEBSOCKET,
  sttSettings: {
    provider: STTProvider.DEEPGRAM,
  },
  // No knowledge base - avatar should only speak what we tell it to
  knowledgeId: "QA Interview",
};

// Available avatars for interview context
export const INTERVIEW_AVATARS = [
  {
    avatar_id: "Dexter_Doctor_Standing2_public",
    name: "Dexter Doctor (Professional)",
    description: "Professional male avatar suitable for interviews",
  },
  {
    avatar_id: "Ann_Therapist_public",
    name: "Ann Therapist",
    description: "Professional female avatar for interviews",
  },
  {
    avatar_id: "Shawn_Therapist_public",
    name: "Shawn Therapist",
    description: "Professional male avatar for interviews",
  },
  {
    avatar_id: "Bryan_FitnessCoach_public",
    name: "Bryan Coach",
    description: "Professional male avatar for interviews",
  },
  {
    avatar_id: "Elenora_IT_Sitting_public",
    name: "Elenora Tech Expert",
    description: "Professional female avatar for technical interviews",
  },
];

// Interview-specific avatar behavior settings
export const INTERVIEW_AVATAR_BEHAVIOR = {
  greeting: "Hello! Welcome to your interview. I'm your AI interviewer today.",
  questionPrefix: "My next question is:",
  followUpPrompt: "Could you elaborate on that?",
  closingStatement: "Thank you for your time. The interview is now complete.",
  interruptionHandling: "I understand you'd like to add something. Please go ahead.",
  encouragement: "That's a good point. Please continue.",
  clarification: "I'd like to understand better. Could you provide more details?",
};

// Interview modes
export const INTERVIEW_MODES = {
  VOICE_ONLY: "voice",
  TEXT_ONLY: "text", 
  MIXED: "mixed",
} as const;

export type InterviewMode = typeof INTERVIEW_MODES[keyof typeof INTERVIEW_MODES];
