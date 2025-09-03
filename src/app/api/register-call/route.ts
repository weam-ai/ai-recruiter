import { InterviewerService } from "@/services/interviewers.service";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/config/withSession";
import Retell from "retell-sdk";

const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    // Get user session data
    const session = await getSession();
    const user = session.user;
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const interviewerId = body.interviewer_id;
    
    console.log("Registering call for interviewer ID:", interviewerId);
    
    // Check if Retell API key is configured
    if (!process.env.RETELL_API_KEY) {
      console.error("RETELL_API_KEY is not configured");
      return NextResponse.json(
        { error: "Retell API key is not configured. Please set RETELL_API_KEY in your environment variables." },
        { status: 500 }
      );
    }
    
    const interviewer = await InterviewerService.getInterviewerById(interviewerId, user.companyId || session.companyId);
    console.log("Found interviewer:", interviewer ? "Yes" : "No");
    
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

    console.log("Successfully registered call with Retell:", registerCallResponse.call_id);
    return NextResponse.json({
      registerCallResponse: registerCallResponse
    });
  } catch (error) {
    console.error("Error registering call:", error);
    return NextResponse.json(
      { error: "Failed to register call with Retell API. Please check your configuration." },
      { status: 500 }
    );
  }
}
