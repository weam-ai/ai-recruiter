import { ObjectId } from 'mongodb';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Plan = 'free' | 'pro' | 'free_trial_over';

export interface Organization {
  _id?: ObjectId;
  id: string;
  created_at: Date;
  name: string | null;
  image_url: string | null;
  allowed_responses_count: number | null;
  plan: Plan | null;
}

export interface User {
  _id?: ObjectId;
  id: string;
  created_at: Date;
          email: string | null;
  organization_id: string | null;
}

export interface Interviewer {
  _id?: ObjectId;
          id: number;
  created_at: Date;
  agent_id: string;
  name: string;
  description: string;
  image: string;
  audio: string | null;
  empathy: number;
  exploration: number;
  rapport: number;
  speed: number;
  user: {
    id: string;
    email: string;
  } | null;
  companyId: string | null;
}

export interface Interview {
  _id?: ObjectId;
  id: string;
  created_at: Date;
  name: string | null;
          description: string | null;
  objective: string | null;
  organization_id: string | null;
  user_id: string | null;
  interviewer_id: any; // Changed from number | null to any
          is_active: boolean;
          is_anonymous: boolean;
          is_archived: boolean;
          logo_url: string | null;
  theme_color: string | null;
  url: string | null;
  readable_slug: string | null;
  questions: any; // Changed from Json | null to any
  quotes: any; // Changed from Json[] | null to any
  insights: any; // Changed from string[] | null to any
  respondents: any; // Changed from string[] | null to any
          question_count: number | null;
          response_count: number | null;
  time_duration: any; // Changed from string | null to any
}

export interface Response {
  _id?: ObjectId;
  id: any; // Changed from number to any
  created_at: Date;
  interview_id: string | null;
          name: string | null;
  email: string | null;
          call_id: string | null;
          candidate_status: string | null;
          duration: number | null;
  details: any; // Changed from Json | null to any
  analytics: any; // Changed from Json | null to any
  is_analysed: boolean;
  is_ended: boolean;
  is_viewed: boolean;
  is_deleted: boolean;
          tab_switch_count: number | null;
  user: {
    id: string;
    email: string;
  } | null;
  companyId: string | null;
}

export interface Feedback {
  _id?: ObjectId;
  id?: any; // Changed from number to any
  created_at: Date;
  interview_id: string | null;
  email: string | null;
  feedback: string | null;
  satisfaction: number | null;
  user: {
    id: string;
    email: string;
  } | null;
  companyId: string | null;
}

export interface Database {
  organization: Organization;
  user: User;
  interviewer: Interviewer;
  interview: Interview;
  response: Response;
  feedback: Feedback;
}
