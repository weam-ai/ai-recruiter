import { NextRequest, NextResponse } from "next/server";
import { ResponseService } from "@/services/responses.service";
import { InterviewService } from "@/services/interviews.service";

export async function POST(request: NextRequest) {
  try {
    // This is a public route - no authentication required
    const body = await request.json();
    
    // Get interview data to extract user and company information
    const interview = await InterviewService.getInterviewById(body.interview_id);
    
    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }
    
    // Create response data with user and company info from interview
    const responseData = {
      ...body,
      user: {
        id: interview.user_id || interview.user?.id || 'public_user',
        email: interview.user?.email || 'public@example.com',
      },
      companyId: interview.companyId || interview.organization_id || 'public_company',
    };
    
    const responseId = await ResponseService.createResponse(responseData);
    
    if (!responseId) {
      return NextResponse.json({ error: 'Failed to create response' }, { status: 500 });
    }

    return NextResponse.json({ id: responseId });
  } catch (error) {
    console.error('Error creating public response:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
