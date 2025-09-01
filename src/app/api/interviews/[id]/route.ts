import { NextRequest, NextResponse } from "next/server";
import { InterviewService } from "@/services/interviews.service";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const interview = await InterviewService.getInterviewById(params.id);
    
    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    return NextResponse.json(interview);
  } catch (error) {
    console.error('Error fetching interview:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const success = await InterviewService.updateInterview(params.id, body);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to update interview' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating interview:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await InterviewService.deleteInterview(params.id);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete interview' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting interview:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
