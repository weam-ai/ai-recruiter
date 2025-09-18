import { NextRequest, NextResponse } from "next/server";
import { InterviewTokenService } from "@/services/interview-tokens.service";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    const interviewId = params.id;
    
    // Validate token using the new token service
    const validation = await InterviewTokenService.validateToken(token);
    
    if (!validation.valid) {
      return NextResponse.json({ 
        error: validation.error || "Invalid token" 
      }, { status: 403 });
    }

    // Check if this token belongs to this interview
    if (validation.tokenData?.interview_id !== interviewId) {
      return NextResponse.json({ 
        error: "Token does not belong to this interview" 
      }, { status: 403 });
    }

    // Mark token as used
    const success = await InterviewTokenService.markTokenAsUsed(token);

    if (!success) {
      return NextResponse.json({ error: "Failed to mark token as used" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Token marked as used successfully" 
    });

  } catch (error) {
    console.error('Error using interview token:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
