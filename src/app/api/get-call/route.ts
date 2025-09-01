import { NextRequest, NextResponse } from "next/server";
import { ResponseService } from "@/services/responses.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const callId = searchParams.get("callId");

    if (!callId) {
      return NextResponse.json({ error: "Call ID is required" }, { status: 400 });
    }

    const callDetails = await ResponseService.getResponseByCallId(callId);
    
    if (!callDetails) {
      return NextResponse.json({ error: "Call not found" }, { status: 404 });
    }

    return NextResponse.json(callDetails);
  } catch (error) {
    console.error("Error fetching call details:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
