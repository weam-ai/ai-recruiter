import { NextRequest, NextResponse } from "next/server";
import { FeedbackService } from "@/services/feedback.service";
import { getSession } from "@/config/withSession";

export async function POST(request: NextRequest) {
  try {
    // Get user session data (optional for public feedback)
    const session = await getSession();
    const user = session?.user;
    
    const body = await request.json();
    
    // Prepare feedback data - handle both authenticated and non-authenticated users
    const feedbackData = {
      ...body,
      user: user ? {
        id: user._id,
        email: user.email,
      } : {
        id: null, // No user ID for public feedback
        email: body.email || null, // Use email from form if provided
      },
      companyId: user?.companyId || session?.companyId || null, // May be null for public feedback
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

