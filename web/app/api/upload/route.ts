import { NextRequest, NextResponse } from 'next/server';

// Allow longer processing time for file uploads
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await req.formData();
    
    // Forward the request to our backend server
    const response = await fetch(`${process.env.API_URL || 'http://localhost:5000'}/api/upload`, {
      method: 'POST',
      body: formData,
    });
    
    // Get the response data
    const data = await response.json();
    
    // Return the response
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
