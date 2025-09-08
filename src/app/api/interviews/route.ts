import { NextRequest, NextResponse } from "next/server";
import { InterviewService } from "@/services/interviews.service";
import { getSession } from "@/config/withSession";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json({ error: 'Missing companyId' }, { status: 400 });
    }

    const interviews = await InterviewService.getAllInterviews(companyId);
    return NextResponse.json(interviews);
  } catch (error) {
    console.error('Error fetching interviews:', error);
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
    const interviewData = {
      ...body,
      user_id: user._id,
      organization_id: user.companyId || session.companyId,
    };
    
    const interview = await InterviewService.createInterview(interviewData);
    
    if (!interview) {
      return NextResponse.json({ error: 'Failed to create interview' }, { status: 500 });
    }

    return NextResponse.json(interview);
  } catch (error) {
    console.error('Error creating interview:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
