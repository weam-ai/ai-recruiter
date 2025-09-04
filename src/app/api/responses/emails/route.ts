import { NextRequest, NextResponse } from "next/server";
import { ResponseService } from "@/services/responses.service";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const interviewId = searchParams.get('interviewId');
    
    if (!interviewId) {
      return NextResponse.json({ error: 'Missing interviewId' }, { status: 400 });
    }

    const emails = await ResponseService.getAllEmails(interviewId);
    return NextResponse.json(emails);
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
