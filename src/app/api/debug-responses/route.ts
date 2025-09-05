import { NextRequest, NextResponse } from "next/server";
import { ResponseService } from "@/services/responses.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const interviewId = searchParams.get('interviewId');
    
    if (!interviewId) {
      return NextResponse.json({ error: 'Interview ID is required' }, { status: 400 });
    }

    // Get all responses for the interview
    const responses = await ResponseService.getAllResponses(interviewId);
    
    // Return simplified response data for debugging
    const debugData = responses.map(response => ({
      call_id: response.call_id,
      email: response.email,
      name: response.name,
      is_analysed: response.is_analysed,
      candidate_status: response.candidate_status,
      duration: response.duration,
      has_analytics: !!response.analytics,
      has_transcript: !!response.transcript,
      created_at: response.created_at
    }));

    return NextResponse.json({
      interviewId,
      totalResponses: responses.length,
      responses: debugData
    });
  } catch (error) {
    console.error('Error fetching debug responses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
