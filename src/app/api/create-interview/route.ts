import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { InterviewService } from "@/services/interviews.service";
import { logger } from "@/lib/logger";
import { getSession } from "@/config/withSession";
const config = require('../../../config/config');

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

const base_url = config.APP.LIVE_URL;

export async function POST(req: Request, res: Response) {
  try {
    // Get user session data
    const session = await getSession();
    const user = session.user;
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url_id = nanoid();
    const apiBasePath = config.APP.API_BASE_PATH || '';
    const url = `${base_url}${apiBasePath}/call/${url_id}`;
    const body = await req.json();

    logger.info("create-interview request received");

    const payload = body.interviewData;

    let readableSlug = null;
    if (body.organizationName) {
      const interviewNameSlug = payload.name?.toLowerCase().replace(/\s/g, "-");
      const orgNameSlug = body.organizationName
        ?.toLowerCase()
        .replace(/\s/g, "-");
      readableSlug = `${orgNameSlug}-${interviewNameSlug}`;
    }

    const newInterview = await InterviewService.createInterview({
      ...payload,
      url: url,
      id: url_id,
      readable_slug: readableSlug,
      user: {
        id: user._id,
        email: user.email || "unknown@example.com"
      },
      companyId: user.companyId || session.companyId,
    });

    logger.info("Interview created successfully");

    return NextResponse.json(
      { response: "Interview created successfully" },
      { status: 200 },
    );
  } catch (err) {
    logger.error("Error creating interview");

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
