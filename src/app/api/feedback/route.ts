import { NextRequest, NextResponse } from "next/server";
import { FeedbackService } from "@/services/feedback.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const feedback = await FeedbackService.submitFeedback(body);
    
    if (!feedback || feedback.length === 0) {
      return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
    }

    return NextResponse.json({ success: true, feedback: feedback[0] });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
