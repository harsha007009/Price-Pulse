import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Create a response for signing out
    const response = NextResponse.json(
      { message: 'Successfully signed out' },
      { status: 200 }
    );
    
    // Clear all authentication cookies
    response.cookies.delete('userId');
    response.cookies.delete('userEmail');
    response.cookies.delete('auth_token');
    response.cookies.delete('token'); // Add this line to delete the token cookie used in sign-in
    
    return response;
  } catch (error) {
    console.error('Sign out error:', error);
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    );
  }
}