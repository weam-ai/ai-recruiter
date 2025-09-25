import { InterviewerService } from "@/services/interviewers.service";
import { NextRequest, NextResponse } from "next/server";
import Retell from "retell-sdk";
const config = require('../../../../config/config');

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

const retellClient = new Retell({
  apiKey: config.RETELL.API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // This is a public route - no authentication required
    const body = await request.json();
    const interviewerId = body.interviewer_id;
    
    // console.log("Registering public call for interviewer ID:", interviewerId);
    
    // Check if Retell API key is configured
    if (!config.RETELL.API_KEY) {
      console.error("RETELL_API_KEY is not configured");
      return NextResponse.json(
        { error: "Retell API key is not configured. Please set RETELL_API_KEY in your environment variables." },
        { status: 500 }
      );
    }

    console.log("body", body);
    
    // Log API key info for debugging (first 8 chars only for security)
    console.log("Using Retell API key:", config.RETELL.API_KEY ? `${config.RETELL.API_KEY.substring(0, 8)}...` : "NOT SET");
    
    // Get interviewer without companyId filter for public access
    const interviewer = await InterviewerService.getInterviewerById(interviewerId);
    // console.log("Found interviewer:", interviewer ? "Yes" : "No");
    
    if (!interviewer || !interviewer.agent_id) {
      console.error("No interviewer found or no agent_id configured");
      return NextResponse.json(
        { error: "Interviewer not found or not properly configured with Retell agent" },
        { status: 404 }
      );
    }
    
    const registerCallResponse = await retellClient.call.createWebCall({
      agent_id: interviewer.agent_id,
      retell_llm_dynamic_variables: body.dynamic_data || {},
    });

    // console.log("Successfully registered public call with Retell:", registerCallResponse.call_id);
    return NextResponse.json({
      registerCallResponse: registerCallResponse
    });
  } catch (error) {
    console.error("Error registering public call:", error);
    console.error("Error details:", {
      message: error.message,
      status: error.status,
      response: error.response?.data,
      
    });
    return NextResponse.json(
      { 
        error: "Failed to register call with Retell API. Please check your configuration.",
        details: error.message
      },
      { status: 500 }
    );
  }
}
