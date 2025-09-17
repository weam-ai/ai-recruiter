import { NextRequest, NextResponse } from "next/server";
const config = require("../../../../config/config");

export async function GET() {
  try {
    const HEYGEN_API_KEY = config.HEYGEN.API_KEY;
    const baseApiUrl = config.HEYGEN.BASE_API_URL;
    console.log("HEYGEN_API_KEY", HEYGEN_API_KEY);
    console.log("baseApiUrl", baseApiUrl);

    if (!HEYGEN_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: "HeyGen API key is missing from environment variables" 
        },
        { status: 400 }
      );
    }

    console.log("Testing HeyGen API with key:", HEYGEN_API_KEY.substring(0, 10) + "...");

    // Test the API by trying to create a streaming token
    const response = await fetch(`${baseApiUrl}/v1/streaming.create_token`, {
      method: "POST",
      headers: {
        "x-api-key": HEYGEN_API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("HeyGen API Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HeyGen API Error:", errorText);
      
      return NextResponse.json(
        { 
          success: false, 
          error: `HeyGen API error: ${response.status} - ${errorText}`,
          status: response.status
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("HeyGen API Success:", data);

    return NextResponse.json({
      success: true,
      message: "HeyGen API key is valid and working!",
      data: {
        hasToken: !!data.data?.token,
        tokenLength: data.data?.token?.length || 0,
        apiUrl: baseApiUrl
      }
    });

  } catch (error) {
    console.error("Error testing HeyGen API:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Failed to test HeyGen API: ${error.message}` 
      },
      { status: 500 }
    );
  }
}
