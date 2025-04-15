import { NextRequest, NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    // Get the request data
    const data = await req.json();
    
    // Forward the request to our backend server
    const response = await fetch(`${process.env.API_URL || 'http://localhost:5000'}/api/chat/with-context`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    // Get the response data
    const responseData = await response.json();
    
    // Return the response
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error calling chat with context API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat with context request' },
      { status: 500 }
    );
  }
}
