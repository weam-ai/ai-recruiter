"use server";

import { ResponseService } from "@/services/responses.service";
import { InterviewService } from "@/services/interviews.service";

interface Analytics {
  overallScore: number;
  overallFeedback: string;
  communication: number;
  generalIntelligence: number;
  problemSolving: number;
  technicalSkills: number;
}

interface Question {
  question: string;
  answer: string;
}

const analyzeCommunication = async (callId: string, transcript?: string) => {
  try {
    const response = await ResponseService.getResponseByCallId(callId);

    if (response?.analytics) {
      return { analytics: response.analytics as any, status: 200 };
    }

    const interviewTranscript = transcript || response?.details?.transcript;
    const questions = response?.details?.questions;

    if (!interviewTranscript || !questions) {
      return { error: "Missing transcript or questions", status: 400 };
    }

    const questionList = Array.isArray(questions) 
      ? questions.map((q: any, index: number) => `${index + 1}. ${q.question}`)
      : [];

    const prompt = `
      Analyze the following interview transcript and provide communication insights:
      
      Transcript: ${interviewTranscript}
      
      Questions: ${questionList.join('\n')}
      
      Please provide:
      1. Overall communication score (1-10)
      2. Specific feedback on communication skills
      3. Areas for improvement
      4. Strengths demonstrated
    `;

    // Here you would call your AI service to analyze the transcript
    // For now, returning a mock response
    const mockAnalytics: any = {
      overallScore: 7,
      overallFeedback: "Good communication skills with room for improvement",
      communication: 7,
      generalIntelligence: 8,
      problemSolving: 6,
      technicalSkills: 7,
    };

    return { analytics: mockAnalytics, status: 200 };
  } catch (error) {
    console.error("Error analyzing communication:", error);
    return { error: "Failed to analyze communication", status: 500 };
  }
};

const generateInsights = async (callId: string, transcript?: string) => {
  try {
    const response = await ResponseService.getResponseByCallId(callId);
    const interview = await InterviewService.getInterviewById(response?.interview_id || "");

    if (!interview) {
      return { error: "Interview not found", status: 404 };
    }

    const interviewTranscript = transcript || response?.details?.transcript;
    const questions = response?.details?.questions;

    if (!interviewTranscript || !questions) {
      return { error: "Missing transcript or questions", status: 400 };
    }

    const questionList = Array.isArray(questions) 
      ? questions.map((q: any, index: number) => `${index + 1}. ${q.question}`)
      : [];

    const prompt = `
      Generate insights for the following interview:
      
      Interview: ${interview.name}
      Objective: ${interview.objective}
      Description: ${interview.description}
      
      Transcript: ${interviewTranscript}
      
      Questions: ${questionList.join('\n')}
      
      Please provide:
      1. Key insights about the candidate
      2. Strengths and weaknesses
      3. Recommendations
      4. Overall assessment
    `;

    // Here you would call your AI service to generate insights
    // For now, returning a mock response
    const mockInsights = {
      keyInsights: ["Good technical knowledge", "Needs improvement in communication"],
      strengths: ["Technical skills", "Problem-solving approach"],
      weaknesses: ["Communication clarity", "Time management"],
      recommendations: ["Practice explaining technical concepts", "Work on presentation skills"],
      overallAssessment: "Promising candidate with room for growth"
    };

    // Update the response with insights
    if (response) {
      await ResponseService.updateResponse(response._id?.toString() || "", { insights: mockInsights });
    }

    return { insights: mockInsights, status: 200 };
  } catch (error) {
    console.error("Error generating insights:", error);
    return { error: "Failed to generate insights", status: 500 };
  }
};

export const AnalyticsService = {
  analyzeCommunication,
  generateInsights,
};
