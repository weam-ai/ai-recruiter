import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/config/withSession';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (session.user) {
      return NextResponse.json({
        user: session.user,
        companyId: session.companyId
      });
    } else {
      return NextResponse.json(
        { error: 'No active session' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
