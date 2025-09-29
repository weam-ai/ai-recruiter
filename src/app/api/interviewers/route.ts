import { NextRequest, NextResponse } from "next/server";
import { InterviewerService } from "@/services/interviewers.service";
import { getSession } from "@/config/withSession";
import Retell from "retell-sdk";
import { RETELL_AGENT_GENERAL_PROMPT } from "@/lib/constants";
import { validateApiKeys } from "@/lib/utils";
const config = require('../../../config/config');

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId') || '';
    
    const interviewers = await InterviewerService.getAllInterviewers(companyId);
    return NextResponse.json(interviewers);
  } catch (error) {
    console.error('Error fetching interviewers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user session data
    const session = await getSession();
    const user = session.user;
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate API keys before processing
    const apiKeyValidation = validateApiKeys();
    if (!apiKeyValidation.isValid) {
      console.error(`Missing API keys: ${apiKeyValidation.missingKeys.join(', ')}`);
      return NextResponse.json(
        { 
          error: "API configuration error", 
          message: `Missing required API keys: ${apiKeyValidation.missingKeys.join(', ')}. Please configure the environment variables.`,
          missingKeys: apiKeyValidation.missingKeys
        },
        { status: 500 }
      );
    }

    const retellClient = new Retell({
      apiKey: config.RETELL.API_KEY,
    });

    // Create the LLM model for the interviewer
    const newModel = await retellClient.llm.create({
      model: "gpt-4o",
      general_prompt: RETELL_AGENT_GENERAL_PROMPT,
      general_tools: [
        {
          type: "end_call",
          name: "end_call_1",
          description:
            "End the call if the user uses goodbye phrases such as 'bye,' 'goodbye,' or 'have a nice day.' ",
        },
      ],
    });

    // console.log("Created LLM model:", newModel.llm_id);

    // Create the Retell agent
    const newAgent = await retellClient.agent.create({
      response_engine: { llm_id: newModel.llm_id, type: "retell-llm" },
      voice_id: "11labs-Chloe", // Default voice, can be made configurable later
      agent_name: body.name || "Custom Interviewer",
    });

    // console.log("Created agent:", newAgent.agent_id);

    const interviewerData = {
      ...body,
      agent_id: newAgent.agent_id, // Add the agent_id
      user: {
        id: user._id,
        email: user.email,
      },
      companyId: user.companyId || session.companyId,
    };
    
    const interviewer = await InterviewerService.createInterviewer(interviewerData);
    
    if (!interviewer) {
      return NextResponse.json({ error: 'Failed to create interviewer' }, { status: 500 });
    }

    return NextResponse.json(interviewer);
  } catch (error) {
    console.error('Error creating interviewer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
