import { NextRequest, NextResponse } from "next/server";
import { InterviewerService } from "@/services/interviewers.service";
import { getSession } from "@/config/withSession";

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
    // Get user session data
    const session = await getSession();
    const user = session.user;
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const interviewerData = {
      ...body,
      user: {
        id: user._id,
        email: user.email,
      },
      companyId: user.companyId || session.companyId,
    };
    
    const interviewer = await InterviewerService.createInterviewer(interviewerData);
    
    if (!interviewer) {
      return NextResponse.json({ error: 'Failed to create interviewer' }, { status: 500 });
    }

    return NextResponse.json(interviewer);
  } catch (error) {
    console.error('Error creating interviewer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
