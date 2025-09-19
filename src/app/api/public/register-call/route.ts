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
    
    console.log("=== PUBLIC REGISTER CALL DEBUG ===");
    console.log("Environment:", process.env.NODE_ENV);
    console.log("Registering public call for interviewer ID:", interviewerId);
    console.log("Request body:", JSON.stringify(body, null, 2));
    
    // Check if Retell API key is configured
    console.log("Checking Retell API key...");
    console.log("RETELL_API_KEY exists:", !!config.RETELL.API_KEY);
    console.log("RETELL_API_KEY length:", config.RETELL.API_KEY ? config.RETELL.API_KEY.length : 0);
    
    if (!config.RETELL.API_KEY) {
      console.error("RETELL_API_KEY is not configured");
      return NextResponse.json(
        { error: "Retell API key is not configured. Please set RETELL_API_KEY in your environment variables." },
        { status: 500 }
      );
    }
    
    // Test MongoDB connection
    console.log("Testing MongoDB connection...");
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
    console.log("Fetching interviewer from database...");
    const interviewer = await InterviewerService.getInterviewerById(interviewerId);
    console.log("Found interviewer:", interviewer ? "Yes" : "No");
    console.log("Interviewer data:", interviewer ? {
      id: interviewer._id || interviewer.id,
      agent_id: interviewer.agent_id,
      name: interviewer.name
    } : null);
    
    if (!interviewer || !interviewer.agent_id) {
      console.error("No interviewer found or no agent_id configured");
      return NextResponse.json(
        { error: "Interviewer not found or not properly configured with Retell agent" },
        { status: 404 }
      );
    }
    
    console.log("Creating Retell web call...");
    const registerCallResponse = await retellClient.call.createWebCall({
      agent_id: interviewer.agent_id,
      retell_llm_dynamic_variables: body.dynamic_data || {},
    });

    console.log("Successfully registered public call with Retell:", registerCallResponse.call_id);
    console.log("=== END DEBUG ===");
    
    return NextResponse.json({
      registerCallResponse: registerCallResponse
    });
  } catch (error) {
    console.error("=== ERROR IN PUBLIC REGISTER CALL ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    console.error("=== END ERROR DEBUG ===");
    
    return NextResponse.json(
      { 
        error: "Failed to register call with Retell API. Please check your configuration.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
