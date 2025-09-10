import { NextRequest, NextResponse } from "next/server";
import { ResponseService } from "@/services/responses.service";
import { InterviewService } from "@/services/interviews.service";
import { getSession } from "@/config/withSession";
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

export async function GET(request: NextRequest) {
  try {
    // Get user session data
    const session = await getSession();
    const user = session.user;
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const callId = searchParams.get("callId");

    if (!callId) {
      return NextResponse.json({ error: "Call ID is required" }, { status: 400 });
    }

    const callDetails = await ResponseService.getResponseByCallId(callId, user.companyId || session.companyId);
    
    if (!callDetails) {
      return NextResponse.json({ error: "Call not found" }, { status: 404 });
    }

    return NextResponse.json(callDetails);
  } catch (error) {
    console.error("Error fetching call details:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id: callId } = body;

    // console.log("POST /api/get-call received with body:", body);

    if (!callId) {
      console.error("No call ID provided in request body");
      return NextResponse.json({ error: "Call ID is required" }, { status: 400 });
    }

    // console.log("Processing call analysis for call ID:", callId);

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

    // Get interview details for analytics
    const interview = await InterviewService.getInterviewById(response.interview_id, response.companyId);
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

        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an expert in analyzing interview transcripts. You must only use the main questions provided and not generate or infer additional questions.",
            },
            {
              role: "user",
              content: getInterviewAnalyticsPrompt(callResponse.transcript, mainQuestions),
            },
          ],
          response_format: { type: "json_object" },
        });

        analytics = JSON.parse(completion.choices[0]?.message?.content || "{}");
        // console.log("Generated analytics successfully");
      } catch (error) {
        console.error("Error generating analytics:", error);
        // Continue without analytics if generation fails
      }
    }

    // Fetch the latest response record to get the most current status
    const latestResponse = await ResponseService.getResponseByCallId(callId);
    
    // Update response record with complete call data and analytics
    // Only set candidate_status to "completed" if no meaningful status is already set
    const meaningfulStatuses = ["SELECTED", "NOT_SELECTED", "POTENTIAL", "NO_STATUS"];
    const shouldPreserveStatus = latestResponse.candidate_status && meaningfulStatuses.includes(latestResponse.candidate_status);
    
    // console.log("Status preservation check:", {
    //   originalStatus: response.candidate_status,
    //   latestStatus: latestResponse.candidate_status,
    //   isMeaningful: meaningfulStatuses.includes(latestResponse.candidate_status),
    //   shouldPreserve: shouldPreserveStatus
    // });
    
    const updateData = {
      duration,
      details: callResponse,
      analytics,
      is_analysed: true,
      ...(shouldPreserveStatus ? {} : { candidate_status: "completed" }),
    };

    // console.log("Updating response record with data:", {
    //   duration,
    //   hasDetails: !!callResponse,
    //   hasAnalytics: !!analytics,
    //   is_analysed: true,
    //   currentStatus: response.candidate_status,
    //   shouldPreserveStatus: shouldPreserveStatus,
    //   willSetStatus: !shouldPreserveStatus
    // });

    const updated = await ResponseService.saveResponse(updateData, callId);
    
    if (!updated) {
      console.error("Failed to update response record");
      return NextResponse.json({ error: "Failed to update response" }, { status: 500 });
    }

    // console.log("Successfully processed call analysis for call ID:", callId);
    // console.log("Response record updated with details and analytics");

    return NextResponse.json({
      success: true,
      callResponse,
      analytics,
      duration,
    });
  } catch (error) {
    console.error("Error processing call analysis:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
