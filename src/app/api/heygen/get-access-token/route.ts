import { NextRequest, NextResponse } from "next/server";
const config = require("../../../../config/config");

const HEYGEN_API_KEY = config.HEYGEN.API_KEY;

export async function POST() {
  try {
    if (!HEYGEN_API_KEY) {
      throw new Error("HeyGen API key is missing from environment variables");
    }
    
    const baseApiUrl = config.HEYGEN.BASE_API_URL;

    const res = await fetch(`${baseApiUrl}/v1/streaming.create_token`, {
      method: "POST",
      headers: {
        "x-api-key": HEYGEN_API_KEY,
      },
    });

    console.log("HeyGen API Response:", res.status);

    if (!res.ok) {
      throw new Error(`HeyGen API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    return new Response(data.data.token, {
      status: 200,
    });
  } catch (error) {
    console.error("Error retrieving HeyGen access token:", error);

    return new Response("Failed to retrieve HeyGen access token", {
      status: 500,
    });
  }
}
