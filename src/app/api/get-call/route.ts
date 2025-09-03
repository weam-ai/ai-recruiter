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
    const callId = searchParams.get("callId");

    if (!callId) {
      return NextResponse.json({ error: "Call ID is required" }, { status: 400 });
    }

    const callDetails = await ResponseService.getResponseByCallId(callId, user.companyId || session.companyId);
    
    if (!callDetails) {
      return NextResponse.json({ error: "Call not found" }, { status: 404 });
    }

    return NextResponse.json(callDetails);
  } catch (error) {
    console.error("Error fetching call details:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
