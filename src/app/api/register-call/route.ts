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
    const interviewer = await InterviewerService.getInterviewerById(interviewerId);
    const registerCallResponse = await retellClient.call.createWebCall({
      agent_id: interviewer?.agent_id || "",
      retell_llm_dynamic_variables: body.dynamic_data || {},
    });

    return NextResponse.json(registerCallResponse);
  } catch (error) {
    console.error("Error registering call:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
