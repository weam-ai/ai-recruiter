import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await connectDB();
    const interviews = await db.collection("interviews").find({}).limit(5).toArray();
    
    return NextResponse.json({
      success: true,
      count: interviews.length,
      interviews: interviews.map(interview => ({
        id: interview._id,
        name: interview.name,
        is_active: interview.is_active
      }))
    });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
