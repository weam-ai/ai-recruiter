import { NextRequest, NextResponse } from "next/server";
import { InterviewService } from "@/services/interviews.service";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // This is a public route - no authentication required
    const interview = await InterviewService.getInterviewById(params.id);
    
    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    // Only return basic interview data needed for the call page
    // Don't expose sensitive information
    const publicInterview = {
      id: interview.id,
      name: interview.name,
      description: interview.description,
      objective: interview.objective,
      is_active: interview.is_active,
      is_anonymous: interview.is_anonymous,
      theme_color: interview.theme_color,
      url: interview.url,
      readable_slug: interview.readable_slug,
      questions: interview.questions,
      question_count: interview.question_count,
      time_duration: interview.time_duration,
      interviewer: interview.interviewer,
      created_at: interview.created_at
    };

    return NextResponse.json(publicInterview);
  } catch (error) {
    console.error('Error fetching public interview:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
