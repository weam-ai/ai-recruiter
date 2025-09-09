import { MongoClient } from 'mongodb';
import { NextResponse } from "next/server";
import { COLLECTIONS } from "@/lib/collection-constants";
import { getMongoUri } from "@/lib/mongodb-uri";

export async function GET() {
  try {
    const uri = getMongoUri();
    if (!uri) {
      return NextResponse.json({
        success: false,
        message: "MongoDB URI not configured",
        error: "Please configure MongoDB connection. Either set MONGODB_URI or provide DB_CONNECTION, DB_HOST, DB_DATABASE, DB_USERNAME, and DB_PASSWORD in your environment variables."
      }, { status: 500 });
    }
    const client = new MongoClient(uri);
    
    await client.connect();
    const db = client.db();
    
    const result = await db.collection(COLLECTIONS.INTERVIEWER).find({}).limit(1).toArray();
    
    await client.close();
    
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
