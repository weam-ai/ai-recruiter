import { NextRequest, NextResponse } from "next/server";
import { InterviewService } from "@/services/interviews.service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    
    if (!organizationId) {
      return NextResponse.json({ error: 'Missing organizationId' }, { status: 400 });
    }

    await InterviewService.deactivateInterviewsByOrgId(organizationId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deactivating interviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
