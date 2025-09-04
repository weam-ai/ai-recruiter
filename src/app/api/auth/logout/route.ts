import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/config/withSession';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    // Clear the session
    session.destroy();
    
    return NextResponse.json({
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
