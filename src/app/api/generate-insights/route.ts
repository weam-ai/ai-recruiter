import { NextRequest, NextResponse } from "next/server";
import { ResponseService } from "@/services/responses.service";
import { InterviewService } from "@/services/interviews.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { callId, transcript } = body;

    if (!callId) {
      return NextResponse.json({ error: "Call ID is required" }, { status: 400 });
    }

    const response = await ResponseService.getResponseByCallId(callId);
    if (!response) {
      return NextResponse.json({ error: "Response not found" }, { status: 404 });
    }

    let callSummaries = "";
    if (response.details && typeof response.details === 'object' && 'call_analysis' in response.details) {
      const details = response.details as any;
      if (details.call_analysis?.call_summary) {
        callSummaries += details.call_analysis.call_summary;
      }
    }

    const interview = await InterviewService.getInterviewById(response.interview_id || "", response.companyId);
    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    const prompt = `
      Generate insights for the following interview:
      
      Interview: ${interview.name || "Unknown"}
      Objective: ${interview.objective || "Not specified"}
      Description: ${interview.description || "Not specified"}
      
      Call Summary: ${callSummaries}
      Transcript: ${transcript || "Not available"}
      
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
    if (response._id) {
      await ResponseService.updateResponse(response._id.toString(), { insights: mockInsights });
    }

    return NextResponse.json({ insights: mockInsights });
  } catch (error) {
    console.error("Error generating insights:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
