import { NextRequest, NextResponse } from "next/server";
import { ResponseService } from "@/services/responses.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    
    if (!organizationId) {
      return NextResponse.json({ error: 'Missing organizationId' }, { status: 400 });
    }

    const count = await ResponseService.getResponseCountByOrganizationId(organizationId);
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching response count:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
