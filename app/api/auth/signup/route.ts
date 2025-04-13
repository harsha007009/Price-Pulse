import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { User } from '@/models/User'; // Import the TypeScript User model
import { z } from 'zod';

// Validation schema
const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const body = await req.json();
    
    // Validate request body
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { username, email, password } = validation.data;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: existingUser.email === email ? 'Email already registered' : 'Username already taken' },
        { status: 409 }
      );
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password
    });

    // Set HTTP-only cookies with user information (auto-login after signup)
    const response = NextResponse.json(
      { 
        message: 'User registered successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      },
      { status: 201 }
    );

    // Set cookies with user information
    response.cookies.set('userId', user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });
    
    response.cookies.set('userEmail', user.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}