import { NextRequest, NextResponse } from "next/server";
import { FeedbackService } from "@/services/feedback.service";
import { getSession } from "@/config/withSession";

export async function POST(request: NextRequest) {
  try {
    // Get user session data
    const session = await getSession();
    const user = session.user;
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const feedbackData = {
      ...body,
      user: {
        id: user._id,
        email: user.email,
      },
      companyId: user.companyId || session.companyId,
    };
    
    const feedback = await FeedbackService.submitFeedback(feedbackData);
    
    if (!feedback || feedback.length === 0) {
      return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
    }

    return NextResponse.json({ success: true, feedback: feedback[0] });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

