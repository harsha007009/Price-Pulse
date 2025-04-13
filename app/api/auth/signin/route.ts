import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import mongoose from 'mongoose';

// Define a loose schema for the actual user structure in your database
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String
}, { strict: false });

// Get the User model that matches your actual database structure
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Validation schema
const signinSchema = z.object({
  login: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required')
});

export async function POST(req: Request) {
  try {
    // Connect to the database
    try {
      await dbConnect();
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Request parsing error:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    // Validate request body
    const validation = signinSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { login, password } = validation.data;
    console.log(`Login attempt for: ${login}`);

    // Find user by email (since that's what exists in your database)
    let user;
    try {
      user = await User.findOne({ email: login });
      
      if (!user) {
        console.log(`User not found for login: ${login}`);
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }
    } catch (userFindError) {
      console.error('Error finding user:', userFindError);
      return NextResponse.json(
        { error: 'Error finding user' },
        { status: 500 }
      );
    }

    // Verify password directly using bcrypt since the model doesn't have the comparePassword method
    try {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        console.log(`Invalid password for user: ${login}`);
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }
    } catch (passwordError) {
      console.error('Password verification error:', passwordError);
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 500 }
      );
    }

    console.log(`User ${login} authenticated successfully`);

    // Create response
    const response = NextResponse.json(
      { 
        message: 'Sign in successful',
        user: {
          userId: user._id.toString(),
          email: user.email,
          name: user.name || 'User'
        }
      },
      { status: 200 }
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
    
    // For backward compatibility, also set auth_token cookie but with user ID
    response.cookies.set('auth_token', user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}