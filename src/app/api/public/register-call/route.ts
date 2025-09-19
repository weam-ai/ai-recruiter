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
    
    // Check if Retell API key is configured
    if (!config.RETELL.API_KEY) {
      return NextResponse.json(
        { error: "Retell API key is not configured. Please set RETELL_API_KEY in your environment variables." },
        { status: 500 }
      );
    }
    
    // Test MongoDB connection
    try {
      const db = await import("@/lib/mongodb").then(m => m.getDb());
      console.log("MongoDB connection successful");
    } catch (dbError) {
      console.error("MongoDB connection failed:", dbError);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }
    
    // Get interviewer without companyId filter for public access
    const interviewer = await InterviewerService.getInterviewerById(interviewerId);
    
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

    return NextResponse.json({
      registerCallResponse: registerCallResponse
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: "Failed to register call with Retell API. Please check your configuration.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
