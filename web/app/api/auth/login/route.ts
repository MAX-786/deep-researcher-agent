import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Get the request data
    const data = await req.json();
    
    // Forward the request to our backend server
    const response = await fetch(`${process.env.API_URL || 'http://localhost:5000'}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    // Get the response data
    const responseData = await response.json();
    
    // Return the response
    return NextResponse.json(responseData, { status: response.status });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: { message: 'Authentication failed' } },
      { status: 500 }
    );
  }
}
