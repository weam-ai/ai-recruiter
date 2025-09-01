import { NextRequest, NextResponse } from "next/server";
import { ClientService } from "../../../../services/clients.service.js";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const result = await ClientService.updateOrganization(body, params.id);
    
    if (!result || result.length === 0) {
      return NextResponse.json({ error: 'Failed to update organization' }, { status: 500 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating organization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
