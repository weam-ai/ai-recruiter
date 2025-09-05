import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb.js";
import { COLLECTIONS } from "@/lib/collection-constants";

export async function GET() {
  try {
    const db = await getDb();
    const result = await db.collection(COLLECTIONS.INTERVIEWER).find({}).limit(1).toArray();
    
    return NextResponse.json({
      success: true,
      message: "MongoDB connection successful!",
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("MongoDB test error:", error);
    return NextResponse.json({
      success: false,
      message: "MongoDB connection failed",
      error: error.message
    }, { status: 500 });
  }
}
