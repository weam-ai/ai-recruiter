import { NextRequest, NextResponse } from "next/server";
import { InterviewerService } from "@/services/interviewers.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId') || '';
    
    const interviewers = await InterviewerService.getAllInterviewers(clientId);
    return NextResponse.json(interviewers);
  } catch (error) {
    console.error('Error fetching interviewers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const interviewer = await InterviewerService.createInterviewer(body);
    
    if (!interviewer) {
      return NextResponse.json({ error: 'Failed to create interviewer' }, { status: 500 });
    }

    return NextResponse.json(interviewer);
  } catch (error) {
    console.error('Error creating interviewer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
