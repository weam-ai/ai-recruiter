import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { Retell } from "retell-sdk";
const config = require('../../../config/config');

const apiKey = config.RETELL.API_KEY;
const baseUrl = config.APP.LIVE_URL;

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (
    !Retell.verify(
      JSON.stringify(req.body),
      apiKey,
      req.headers.get("x-retell-signature") as string,
    )
  ) {
    console.error("Invalid signature");

    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const { event, call } = req.body as unknown as { event: string; call: any };

  switch (event) {
    case "call_started":
      console.log("Call started event received", call.call_id);
      break;
    case "call_ended":
      console.log("Call ended event received", call.call_id);
      break;
    case "call_analyzed":
      try {
        console.log("Call analyzed event received, processing call ID:", call.call_id);
        
        // Make absolute URL call to get-call endpoint
        const protocol = baseUrl?.includes("localhost") ? "http" : "https";
        const apiBasePath = config.APP.API_BASE_PATH || '';
        const fullUrl = `${protocol}://${baseUrl}${apiBasePath}/api/get-call`;
        
        console.log("Calling get-call endpoint:", fullUrl);
        
        const result = await axios.post(fullUrl, {
          id: call.call_id,
        });
        
        console.log("Call analyzed event processed successfully", call.call_id, result.data);
      } catch (error) {
        console.error("Error processing call analysis:", error);
        console.error("Error details:", error.response?.data || error.message);
      }
      break;
    default:
      console.log("Received an unknown event:", event);
  }

  // Acknowledge the receipt of the event
  return NextResponse.json({ status: 204 });
}
