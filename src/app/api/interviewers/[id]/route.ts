import { NextRequest, NextResponse } from "next/server";
import { InterviewerService } from "@/services/interviewers.service";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const interviewer = await InterviewerService.getInterviewerById(params.id);
    
    if (!interviewer) {
      // Fallback for any missing interviewer - return default Lisa interviewer
      console.log(`Interviewer ${params.id} not found, returning default Lisa interviewer`);
      const defaultLisa = {
        id: "68b716ba68f8519199d3afd7",
        name: "Explorer Lisa",
        description: "Hi! I'm Lisa, an enthusiastic and empathetic interviewer who loves to explore. With a perfect balance of empathy and rapport, I delve deep into conversations while maintaining a steady pace. Let's embark on this journey together and uncover meaningful insights!",
        image: "/interviewers/Lisa.png",
        audio: "Lisa.wav",
        empathy: 80,
        exploration: 90,
        rapport: 85,
        speed: 70,
        agent_id: "agent_af7d32a89a8fb19a0c4885b9ec",
        created_at: new Date().toISOString()
      };
      return NextResponse.json(defaultLisa);
    }

    return NextResponse.json(interviewer);
  } catch (error) {
    console.error('Error fetching interviewer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
