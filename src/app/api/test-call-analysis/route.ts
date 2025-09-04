import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
const config = require('../../../config/config');

const baseUrl = config.APP.LIVE_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { callId } = body;

    if (!callId) {
      return NextResponse.json({ error: "Call ID is required" }, { status: 400 });
    }

    console.log("Testing call analysis for call ID:", callId);

    // Make the same call that the webhook would make
    const protocol = baseUrl?.includes("localhost") ? "http" : "https";
    const fullUrl = `${protocol}://${baseUrl}/api/get-call`;
    
    console.log("Calling get-call endpoint:", fullUrl);
    
    const result = await axios.post(fullUrl, {
      id: callId,
    });
    
    console.log("Test call analysis result:", result.data);

    return NextResponse.json({
      success: true,
      message: "Call analysis triggered successfully",
      result: result.data
    });
  } catch (error) {
    console.error("Error in test call analysis:", error);
    return NextResponse.json({ 
      error: "Failed to trigger call analysis",
      details: error.response?.data || error.message 
    }, { status: 500 });
  }
}
