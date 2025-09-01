import { logger } from "@/lib/logger";
import { InterviewerService } from "@/services/interviewers.service";
import { NextResponse, NextRequest } from "next/server";
import Retell from "retell-sdk";
import { INTERVIEWERS, RETELL_AGENT_GENERAL_PROMPT } from "@/lib/constants";

const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY || "",
});

export async function GET(res: NextRequest) {
  logger.info("create-interviewer request received");
  console.log("create-interviewer request received");

  try {
    // Create the LLM model for the interviewers
    const newModel = await retellClient.llm.create({
      model: "gpt-4o",
      general_prompt: "You are an interviewer who is an expert in asking follow up questions to uncover deeper insights.",
      general_tools: [
        {
          type: "end_call",
          name: "end_call_1",
          description:
            "End the call if the user uses goodbye phrases such as 'bye,' 'goodbye,' or 'have a nice day.' ",
        },
      ],
    });

    console.log("Created LLM model:", newModel.llm_id);

    // Create Lisa (Explorer Lisa)
    const newFirstAgent = await retellClient.agent.create({
      response_engine: { llm_id: newModel.llm_id, type: "retell-llm" },
      voice_id: "11labs-Chloe",
      agent_name: "Lisa",
    });

    console.log("Created Lisa agent:", newFirstAgent.agent_id);

    const newInterviewer = await InterviewerService.createInterviewer({
      agent_id: newFirstAgent.agent_id,
      ...INTERVIEWERS.LISA,
    });

    console.log("Saved Lisa interviewer to database:", newInterviewer);

    // Create Bob (Empathetic Bob)
    const newSecondAgent = await retellClient.agent.create({
      response_engine: { llm_id: newModel.llm_id, type: "retell-llm" },
      voice_id: "11labs-Brian",
      agent_name: "Bob",
    });

    console.log("Created Bob agent:", newSecondAgent.agent_id);

    const newSecondInterviewer = await InterviewerService.createInterviewer({
      agent_id: newSecondAgent.agent_id,
      ...INTERVIEWERS.BOB,
    });

    console.log("Saved Bob interviewer to database:", newSecondInterviewer);

    logger.info("Successfully created two default interviewers with Retell agents");
    console.log("Successfully created two default interviewers with Retell agents");

    return NextResponse.json(
      {
        newInterviewer: { agent_id: newFirstAgent.agent_id, ...newInterviewer },
        newSecondInterviewer: { agent_id: newSecondAgent.agent_id, ...newSecondInterviewer },
        message: "Default interviewers created successfully with Retell agents!",
        lisa: {
          name: INTERVIEWERS.LISA.name,
          agent_id: newFirstAgent.agent_id,
          voice: "11labs-Chloe"
        },
        bob: {
          name: INTERVIEWERS.BOB.name,
          agent_id: newSecondAgent.agent_id,
          voice: "11labs-Brian"
        }
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Error creating interviewers:", error);
    console.error("Error creating interviewers:", error);

    return NextResponse.json(
      { 
        error: "Failed to create interviewers", 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 },
    );
  }
}
