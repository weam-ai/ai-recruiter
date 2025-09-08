import { NextRequest, NextResponse } from "next/server";
import { ResponseService } from "@/services/responses.service";
import { InterviewService } from "@/services/interviews.service";
import Retell from "retell-sdk";
import { OpenAI } from "openai";
import { getInterviewAnalyticsPrompt } from "@/lib/prompts/analytics";
const config = require('../../../../config/config');

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
    const { id: callId } = body;

    // console.log("POST /api/public/get-call received with body:", body);

    if (!callId) {
      console.error("No call ID provided in request body");
      return NextResponse.json({ error: "Call ID is required" }, { status: 400 });
    }

    // console.log("Processing public call analysis for call ID:", callId);

    // Get the response record to find interview details
    const response = await ResponseService.getResponseByCallId(callId);
    if (!response) {
      console.error("Response not found for call ID:", callId);
      return NextResponse.json({ error: "Response not found" }, { status: 404 });
    }
    
    // console.log("Fetched response record:", {
    //   call_id: response.call_id,
    //   candidate_status: response.candidate_status,
    //   is_analysed: response.is_analysed
    // });

    // Get call details from Retell API
    const callResponse = await retellClient.call.retrieve(callId);
    // console.log("Retrieved call details from Retell");

    // Calculate duration
    const duration = callResponse.end_timestamp 
      ? Math.floor((callResponse.end_timestamp - callResponse.start_timestamp) / 1000)
      : 0;

    // Get interview details for analytics (without companyId filter for public access)
    const interview = await InterviewService.getInterviewById(response.interview_id);
    if (!interview) {
      console.error("Interview not found for ID:", response.interview_id);
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

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

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        });

        analytics = JSON.parse(completion.choices[0].message.content || "{}");
        // console.log("Generated analytics successfully");
      } catch (error) {
        console.error("Error generating analytics:", error);
        analytics = {
          overall_score: 0,
          strengths: ["Analysis unavailable"],
          areas_for_improvement: ["Analysis unavailable"],
          key_insights: ["Analysis unavailable"]
        };
      }
    }

    // Update response with call details and analytics
    const updateData = {
      transcript: callResponse.transcript || "",
      duration: duration,
      analytics: analytics,
      is_analysed: true,
      candidate_status: "completed",
      call_quality_score: 0, // Default value since call_quality_score is not available in Retell SDK
      end_timestamp: callResponse.end_timestamp,
      start_timestamp: callResponse.start_timestamp,
    };

    // console.log("Updating response with call details:", updateData);
    const updateSuccess = await ResponseService.saveResponse(updateData, callId);
    
    if (!updateSuccess) {
      console.error("Failed to update response with call details");
      return NextResponse.json({ error: "Failed to update response" }, { status: 500 });
    }

    // console.log("Successfully processed call analysis for call ID:", callId);

    return NextResponse.json({
      callResponse: {
        call_id: callId,
        transcript: callResponse.transcript || "",
        duration: duration,
        call_quality_score: 0, // Default value since call_quality_score is not available in Retell SDK
        end_timestamp: callResponse.end_timestamp,
        start_timestamp: callResponse.start_timestamp,
      },
      analytics: analytics
    });
  } catch (error) {
    console.error("Error processing public call analysis:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
