import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log the incoming request body for debugging
    console.log('Received enquiry data:', body);
    
    // Validate required fields
    // Allow submissions with: name AND (email OR phone)
    const hasName = Boolean(body.name && String(body.name).trim());
    const hasEmail = Boolean(body.email && String(body.email).trim());
    const hasPhone = Boolean(body.phone && String(body.phone).trim());

    if (!hasName || (!hasEmail && !hasPhone)) {
      return NextResponse.json(
        { error: 'Please provide your name and at least one contact (email or phone).' },
        { status: 400 }
      );
    }

    // Using the dedicated Enquiries Google Apps Script URL with correct format
    const gscriptUrl = 'https://script.google.com/macros/s/AKfycbyEEL-s76czfub9cUbI52LILZBJhrBS_vAe02sXJ7vA01x6Ibt78StQ4szr4UBUm1jF8Q/exec';
    
    console.log('Using Google Script URL:', gscriptUrl);

    try {
      // Prepare the data in the exact format expected by the Google Sheet
      // Columns: Timestamp, Name, Email, Phone, Message, Project Configuration, Carpet Size, Built Up, Node, Price, Enquiry Date
      const formData = {
        type: 'enquiry', // Important: tells Google Apps Script this is an enquiry
        name: (body.name || '').toString(),
        email: (body.email || '').toString(),
        phone: (body.phone || '').toString(),
        // Accept both `message` and `enquiry` from clients
        message: (body.message || body.enquiry || '').toString(),
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

      if (!response.ok) {
        console.error('Google Apps Script HTTP error:', response.status, response.statusText);
        throw new Error(`Google Apps Script returned HTTP ${response.status}: ${response.statusText}`);
      }

      if (result.status === 'error') {
        console.error('Google Apps Script error:', result.message);
        throw new Error(result.message || 'Google Apps Script returned an error');
      }

      console.log('✅ Enquiry submitted successfully:', result);
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
