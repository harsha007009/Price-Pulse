import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { User } from '@/models/User';

export async function GET(req: Request) {
  try {
    // Get the userId directly from cookies
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map(cookie => {
        const [name, value] = cookie.trim().split('=');
        return [name, value];
      })
    );
    
    const userId = cookies.userId;
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Connect to database
    await dbConnect();
    
    // Find the user by ID
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Format the response with additional user profile data
    const userData = {
      name: user.name || user.username,
      email: user.email,
      username: user.username,
      location: user.location || 'Not specified',
      memberSince: new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      }),
      avatarUrl: user.avatarUrl || '/placeholder-user.jpg'
    };
    
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}