import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/config/withSession";
import { InterviewService } from "@/services/interviews.service";
import { InterviewTokenService } from "@/services/interview-tokens.service";
import { getHostnameFromRequest } from "@/lib/utils";
const config = require("@/config/config");

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user session data
    const session = await getSession();
    const user = session.user;
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const interviewId = params.id;
    
    // Get the interview to verify ownership
    const interview = await InterviewService.getInterviewById(interviewId);
    
    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    // Check if user owns this interview
    if (interview.user.id !== user._id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Create a new token (doesn't invalidate existing tokens)
    const tokenData = await InterviewTokenService.createToken(
      interviewId, 
      user, 
      user.companyId || session.companyId
    );

    if (!tokenData) {
      return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
    }

    // Generate the secure URL using hostname from request
    const hostname = getHostnameFromRequest(request);
    const apiBasePath = config.APP.API_BASE_PATH || '';
    const secureUrl = `${hostname}${apiBasePath}/call/${interviewId}?token=${tokenData.token}`;

    // Get count of active tokens for this interview
    const activeTokensCount = await InterviewTokenService.getActiveTokensCount(interviewId);

    return NextResponse.json({
      success: true,
      secure_url: secureUrl,
      access_token: tokenData.token,
      expires_at: tokenData.expires_at,
      active_tokens_count: activeTokensCount,
      message: `New token generated. Total active tokens: ${activeTokensCount}`
    });

  } catch (error) {
    console.error('Error generating secure interview token:', error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
