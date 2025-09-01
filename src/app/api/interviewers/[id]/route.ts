import { NextRequest, NextResponse } from "next/server";
import { InterviewerService } from "@/services/interviewers.service";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const interviewer = await InterviewerService.getInterviewerById(params.id);
    
    if (!interviewer) {
      return NextResponse.json({ error: 'Interviewer not found' }, { status: 404 });
    }

    return NextResponse.json(interviewer);
  } catch (error) {
    console.error('Error fetching interviewer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
