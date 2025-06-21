import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log the incoming request body for debugging
    console.log('Received enquiry data:', body);
    
    // Validate required fields
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { error: 'Name, email and phone are required' },
        { status: 400 }
      );
    }

    // Using the updated enquiry script URL
    const gscriptUrl = 'https://script.google.com/macros/s/AKfycbyqNlOVCEyc4pS-0y-r28VCkhlBJvTZ7ZLoobHe8y1K8mREFveRlsVeCwcvS61Fz4X9GQ/exec';
    
    console.log('Using Google Script URL:', gscriptUrl);

    try {
      // Prepare the data in the exact format expected by the Google Sheet
      const formData = {
        name: body.name,
        email: body.email,
        phone: body.phone,
        message: body.message || '',
        projectConfiguration: body.projectConfiguration || '',
        projectCarpetSize: body.projectCarpetSize || '',
        projectBuiltUp: body.projectBuiltUp || '',
        projectNode: body.projectNode || '',
        projectPrice: body.projectPrice || ''
      };

      console.log('Sending data to Google Script:', formData);

      const response = await fetch(gscriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        redirect: 'follow', // Follow redirects automatically
      });

      // Log the raw response for debugging
      console.log('Google Script response status:', response.status);
      console.log('Google Script response URL:', response.url);
      
      const responseText = await response.text();
      console.log('Google Script response text:', responseText);

      // Check if the response looks like HTML (error page)
      if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<HTML>')) {
        console.error('Received HTML error page instead of JSON');
        throw new Error('Google Apps Script returned an error page. Please check the deployment.');
      }

      // Try to parse the response as JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse Google Script response:', e);
        console.error('Response was:', responseText);
        throw new Error('Invalid response from Google Script - not valid JSON');
      }

      if (!response.ok || result.status === 'error') {
        throw new Error(result.message || 'Failed to submit to Google Sheets');
      }

      return NextResponse.json({ 
        status: 'success',
        message: 'Enquiry submitted successfully' 
      });

    } catch (error: any) {
      console.error('Error submitting to Google Sheets:', error);
      return NextResponse.json(
        { 
          error: 'Failed to submit enquiry. Please check Google Apps Script deployment.',
          details: error.message || 'Unknown error'
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Error processing lead:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}