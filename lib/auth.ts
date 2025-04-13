import { jwtVerify, SignJWT } from 'jose';

interface DecodedToken {
  userId: string;
  username?: string;  // Make username optional
  name?: string;      // Add name as an optional field
  email: string;
  iat: number;
  exp: number;
}

export async function verifyJwtToken(token: string): Promise<DecodedToken | null> {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'price-pulse-secure-jwt-secret-2025';
    
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    
    // More flexible validation to handle different token structures
    if (
      (typeof payload.userId === 'string' || typeof payload._id === 'string') &&
      typeof payload.email === 'string' &&
      typeof payload.iat === 'number' &&
      typeof payload.exp === 'number'
    ) {
      // Normalize the payload structure
      const normalizedPayload: DecodedToken = {
        userId: (payload.userId || payload._id) as string,
        email: payload.email as string,
        iat: payload.iat as number,
        exp: payload.exp as number,
      };
      
      // Include optional fields if they exist
      if (payload.username) normalizedPayload.username = payload.username as string;
      if (payload.name) normalizedPayload.name = payload.name as string;
      
      return normalizedPayload;
    }
    
    console.error('Invalid token payload structure:', payload);
    return null;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Function to create a JWT token using jose library
export async function createJwtToken(payload: { 
  userId: string; 
  username?: string;  // Make username optional
  name?: string;      // Add name as an optional field
  email: string;
}): Promise<string> {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'price-pulse-secure-jwt-secret-2025';
    
    const token = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(new TextEncoder().encode(JWT_SECRET));
    
    return token;
  } catch (error) {
    console.error('Error creating JWT token:', error);
    throw error;
  }
}