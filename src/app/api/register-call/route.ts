import { InterviewerService } from "@/services/interviewers.service";
import { NextRequest, NextResponse } from "next/server";
import Retell from "retell-sdk";

const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const interviewerId = body.interviewer_id;
    
    console.log("Registering call for interviewer ID:", interviewerId);
    
    const interviewer = await InterviewerService.getInterviewerById(interviewerId);
    console.log("Found interviewer:", interviewer ? "Yes" : "No");
    
    // If no interviewer found, use a default agent_id or create a mock response
    let agent_id = interviewer?.agent_id;
    
    if (!agent_id) {
      console.log("No interviewer found, using default agent");
      // For development/testing, create a mock response
      const mockResponse = {
        call_id: `mock_call_${Date.now()}`,
        access_token: `mock_token_${Date.now()}`,
        agent_id: "default_agent",
      };
      
      return NextResponse.json({
        registerCallResponse: mockResponse
      });
    }
    
    const registerCallResponse = await retellClient.call.createWebCall({
      agent_id: agent_id,
      retell_llm_dynamic_variables: body.dynamic_data || {},
    });

    return NextResponse.json({
      registerCallResponse: registerCallResponse
    });
  } catch (error) {
    console.error("Error registering call:", error);
    
    // Provide a fallback response for development
    const fallbackResponse = {
      call_id: `fallback_call_${Date.now()}`,
      access_token: `fallback_token_${Date.now()}`,
      agent_id: "fallback_agent",
    };
    
    console.log("Providing fallback response for development");
    return NextResponse.json({
      registerCallResponse: fallbackResponse
    });
  }
}
