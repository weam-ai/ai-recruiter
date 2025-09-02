import { NextRequest, NextResponse } from "next/server";
import { InterviewerService } from "@/services/interviewers.service";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const interviewer = await InterviewerService.getInterviewerById(params.id);
    
    if (!interviewer) {
      // Fallback for development - return default Lisa interviewer
      if (params.id === "1") {
        const defaultLisa = {
          id: 1,
          name: "Explorer Lisa",
          description: "Hi! I'm Lisa, an enthusiastic and empathetic interviewer who loves to explore. With a perfect balance of empathy and rapport, I delve deep into conversations while maintaining a steady pace. Let's embark on this journey together and uncover meaningful insights!",
          image: "/interviewers/Lisa.png",
          audio: "Lisa.wav",
          empathy: 80,
          exploration: 90,
          rapport: 85,
          speed: 70,
          agent_id: "default-lisa-agent",
          created_at: new Date().toISOString()
        };
        return NextResponse.json(defaultLisa);
      }
      
      return NextResponse.json({ error: 'Interviewer not found' }, { status: 404 });
    }

    return NextResponse.json(interviewer);
  } catch (error) {
    console.error('Error fetching interviewer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
