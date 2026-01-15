import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import {
  SYSTEM_PROMPT,
  generateQuestionsPrompt,
} from "@/lib/prompts/generate-questions";
import { logger } from "@/lib/logger";
import { validateApiKeys } from "@/lib/utils";
const config = require('../../../config/config');

export const maxDuration = 60;

export async function POST(req: Request, res: Response) {
  logger.info("generate-interview-questions request received");
  
  // Validate API keys before processing
  const apiKeyValidation = validateApiKeys();
  if (!apiKeyValidation.isValid) {
    logger.error(`Missing API keys: ${apiKeyValidation.missingKeys.join(', ')}`);
    return NextResponse.json(
      { 
        error: "API configuration error", 
        message: `Missing required API keys: ${apiKeyValidation.missingKeys.join(', ')}. Please configure the environment variables.`,
        missingKeys: apiKeyValidation.missingKeys
      },
      { status: 500 }
    );
  }
  
  const body = await req.json();

  const openai = new OpenAI({
    apiKey: config.OPENAI.API_KEY,
    maxRetries: 5,
    dangerouslyAllowBrowser: true,
  });

  try {
    const baseCompletion = await openai.chat.completions.create({
      model: config.OPENAI_LLM.MODEL,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: generateQuestionsPrompt(body),
        },
      ],
      response_format: { type: "json_object" },
    });

    const basePromptOutput = baseCompletion.choices[0];
    const content = basePromptOutput?.message?.content || "";

    logger.info("Interview questions generated successfully");

    return NextResponse.json(
      {
        response: content,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Error generating interview questions");

    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 },
    );
  }
}
