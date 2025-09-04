import { NextRequest, NextResponse } from "next/server";
import { InterviewerService } from "@/services/interviewers.service";
import { getSession } from "@/config/withSession";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user session data
    const session = await getSession();
    const user = session.user;
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const interviewer = await InterviewerService.getInterviewerById(params.id, user.companyId || session.companyId);
    
    if (!interviewer) {
      return NextResponse.json({ error: 'Interviewer not found' }, { status: 404 });
    }

    return NextResponse.json(interviewer);
  } catch (error) {
    console.error('Error fetching interviewer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
