import { NextRequest, NextResponse } from "next/server";
import { ResponseService } from "@/services/responses.service";
import { getSession } from "@/config/withSession";

export async function GET(request: NextRequest) {
  try {
    // Get user session data
    const session = await getSession();
    const user = session.user;
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const interviewId = searchParams.get('interviewId');
    
    if (!interviewId) {
      return NextResponse.json({ error: 'Missing interviewId' }, { status: 400 });
    }

    const responses = await ResponseService.getAllResponses(interviewId, user.companyId || session.companyId);
    return NextResponse.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user session data
    const session = await getSession();
    const user = session.user;
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const responseData = {
      ...body,
      user: {
        id: user._id,
        email: user.email,
      },
      companyId: user.companyId || session.companyId,
    };
    
    const responseId = await ResponseService.createResponse(responseData);
    
    if (!responseId) {
      return NextResponse.json({ error: 'Failed to create response' }, { status: 500 });
    }

    return NextResponse.json({ id: responseId });
  } catch (error) {
    console.error('Error creating response:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
