import { MongoClient } from 'mongodb';
import { NextResponse } from "next/server";
const config = require('../../../config/config');

export async function GET() {
  try {
    if (!config.DATABASE.MONGODB_URI) {
      return NextResponse.json({
        success: false,
        message: "MongoDB URI not configured",
        error: "Please add your Mongo URI to .env.local"
      }, { status: 500 });
    }

    const uri = config.DATABASE.MONGODB_URI;
    const client = new MongoClient(uri);
    
    await client.connect();
    const db = client.db();
    
    const result = await db.collection("interviewer").find({}).limit(1).toArray();
    
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
