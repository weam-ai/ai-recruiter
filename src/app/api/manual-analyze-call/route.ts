import { NextRequest, NextResponse } from "next/server";
import { ResponseService } from "@/services/responses.service";
import { InterviewService } from "@/services/interviews.service";
import Retell from "retell-sdk";
import { OpenAI } from "openai";
import { getInterviewAnalyticsPrompt } from "@/lib/prompts/analytics";
const config = require('../../../config/config');

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

const retellClient = new Retell({
  apiKey: config.RETELL.API_KEY,
});

const openai = new OpenAI({
  apiKey: config.OPENAI.API_KEY,
  maxRetries: 5,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { callId } = body;

    if (!callId) {
      return NextResponse.json({ error: "Call ID is required" }, { status: 400 });
    }

    console.log("Manual analysis triggered for call ID:", callId);

    // Get the response record
    const response = await ResponseService.getResponseByCallId(callId);
    if (!response) {
      console.error("Response not found for call ID:", callId);
      return NextResponse.json({ error: "Response not found" }, { status: 404 });
    }

    console.log("Found response:", {
      call_id: response.call_id,
      interview_id: response.interview_id,
      is_analysed: response.is_analysed
    });

    // Get call details from Retell API
    const callResponse = await retellClient.call.retrieve(callId);
    console.log("Retrieved call details from Retell:", {
      call_id: callResponse.call_id,
      transcript_length: callResponse.transcript?.length || 0,
      has_transcript: !!callResponse.transcript
    });

    // Calculate duration
    const duration = callResponse.end_timestamp 
      ? Math.floor((callResponse.end_timestamp - callResponse.start_timestamp) / 1000)
      : 0;

    // Get interview details
    const interview = await InterviewService.getInterviewById(response.interview_id);
    if (!interview) {
      console.error("Interview not found for ID:", response.interview_id);
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    console.log("Found interview:", {
      id: interview.id,
      name: interview.name,
      questions_count: interview.questions?.length || 0
    });

    // Generate analytics using OpenAI
    let analytics = null;
    if (callResponse.transcript) {
      try {
        const mainQuestions = interview.questions 
          ? interview.questions.map((q: any) => q.question).join("\n")
          : "No specific questions provided";

        const prompt = getInterviewAnalyticsPrompt(
          callResponse.transcript,
          mainQuestions,
          interview.objective || "General interview assessment"
        );

        console.log("Generating analytics with prompt length:", prompt.length);

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        });

        analytics = JSON.parse(completion.choices[0].message.content || "{}");
        console.log("Generated analytics successfully:", analytics);
      } catch (error) {
        console.error("Error generating analytics:", error);
        analytics = {
          overall_score: 0,
          strengths: ["Analysis failed"],
          areas_for_improvement: ["Analysis failed"],
          key_insights: ["Analysis failed"]
        };
      }
    } else {
      console.log("No transcript available for analysis");
      analytics = {
        overall_score: 0,
        strengths: ["No transcript available"],
        areas_for_improvement: ["No transcript available"],
        key_insights: ["No transcript available"]
      };
    }

    // Update response with call details and analytics
    const updateData = {
      transcript: callResponse.transcript || "",
      duration: duration,
      analytics: analytics,
      is_analysed: true,
      candidate_status: "completed",
      call_quality_score: callResponse.call_quality_score || 0,
      end_timestamp: callResponse.end_timestamp,
      start_timestamp: callResponse.start_timestamp,
      details: {
        call_analysis: {
          call_summary: analytics?.key_insights?.[0] || "No summary available",
          user_sentiment: analytics?.overall_score > 7 ? "Positive" : analytics?.overall_score > 4 ? "Neutral" : "Negative",
          agent_sentiment: "Neutral",
          agent_task_completion_rating: "Complete",
          agent_task_completion_rating_reason: "Interview completed successfully",
          call_completion_rating: "Complete",
          call_completion_rating_reason: "Interview completed successfully"
        }
      }
    };

    console.log("Updating response with analysis data:", updateData);
    const updateSuccess = await ResponseService.saveResponse(updateData, callId);
    
    if (!updateSuccess) {
      console.error("Failed to update response with analysis data");
      return NextResponse.json({ error: "Failed to update response" }, { status: 500 });
    }

    console.log("Successfully completed manual analysis for call ID:", callId);

    return NextResponse.json({
      success: true,
      message: "Analysis completed successfully",
      callId: callId,
      analytics: analytics
    });
  } catch (error) {
    console.error("Error in manual analysis:", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error.message 
    }, { status: 500 });
  }
}
