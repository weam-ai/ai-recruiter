import { NextRequest, NextResponse } from "next/server";
import { ResponseService } from "@/services/responses.service";

export async function GET(
  request: NextRequest,
  { params }: { params: { callId: string } }
) {
  try {
    const response = await ResponseService.getResponseByCallId(params.callId);
    
    if (!response) {
      return NextResponse.json({ error: 'Response not found' }, { status: 404 });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching response:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { callId: string } }
) {
  try {
    const body = await request.json();
    console.log("PUT /api/responses/call/[callId] - Updating response:", {
      callId: params.callId,
      body: body
    });
    
    const success = await ResponseService.saveResponse(body, params.callId);
    
    if (!success) {
      console.error("Failed to save response for callId:", params.callId);
      return NextResponse.json({ error: 'Failed to save response' }, { status: 500 });
    }

    console.log("Successfully updated response for callId:", params.callId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving response:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
