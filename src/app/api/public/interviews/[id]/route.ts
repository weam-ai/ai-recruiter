import { NextRequest, NextResponse } from "next/server";
import { InterviewService } from "@/services/interviews.service";
import { InterviewTokenService } from "@/services/interview-tokens.service";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get token from query parameters
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    // This is a public route - no authentication required
    const interview = await InterviewService.getInterviewById(params.id);
    
    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    // Check if token is provided
    if (token) {
      // Validate the token using the new token service
      const validation = await InterviewTokenService.validateToken(token);
      
      if (!validation.valid) {
        return NextResponse.json({ 
          error: validation.error || 'Invalid token',
          requires_token: true 
        }, { status: 403 });
      }

      // Check if this token belongs to this interview
      if (validation.tokenData?.interview_id !== params.id) {
        return NextResponse.json({ 
          error: 'Token does not belong to this interview',
          requires_token: true 
        }, { status: 403 });
      }
    } else {
      // Check if interview has any active tokens (if so, token is required)
      const activeTokensCount = await InterviewTokenService.getActiveTokensCount(params.id);
      if (activeTokensCount > 0) {
        return NextResponse.json({ 
          error: 'Access token required',
          requires_token: true 
        }, { status: 403 });
      }
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
      created_at: interview.created_at,
      has_token_protection: token ? true : false
    };

    return NextResponse.json(publicInterview);
  } catch (error) {
    console.error('Error fetching public interview:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
