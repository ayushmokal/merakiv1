import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    console.log('Received form data:', formData);
    
    // Validate required fields
    const requiredFields = ['propertyType', 'listingType', 'title', 'location', 'price', 'contactName', 'contactPhone'];
    const missingFields = requiredFields.filter(field => !formData[field] || formData[field].toString().trim() === '');
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Get Google Apps Script URL
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;
    
    if (!GOOGLE_SCRIPT_URL) {
      console.error('Google Apps Script URL not configured');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Server configuration error. Please contact support.' 
        },
        { status: 500 }
      );
    }

    console.log('Sending data to Google Apps Script:', GOOGLE_SCRIPT_URL);

    // Prepare data for Google Apps Script
    const scriptData = {
      timestamp: new Date().toISOString(),
      propertyType: formData.propertyType,
      listingType: formData.listingType,
      title: formData.title,
      description: formData.description || '',
      location: formData.location,
      area: formData.area || '',
      price: formData.price,
      priceType: formData.priceType || 'total',
      configuration: formData.configuration || '',
      carpetArea: formData.carpetArea || '',
      builtUpArea: formData.builtUpArea || '',
      bedrooms: formData.bedrooms || '',
      bathrooms: formData.bathrooms || '',
      balconies: formData.balconies || '',
      parking: formData.parking || '',
      furnished: formData.furnished || '',
      amenities: Array.isArray(formData.amenities) ? formData.amenities.join(', ') : (formData.amenities || ''),
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
      contactEmail: formData.contactEmail || '',
      additionalNotes: formData.additionalNotes || ''
    };

    console.log('Prepared script data:', scriptData);

    // Send to Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scriptData),
    });

    console.log('Google Apps Script response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Apps Script error response:', errorText);
      throw new Error(`Google Apps Script returned ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('Google Apps Script result:', result);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Property submitted successfully! We will contact you soon.',
        timestamp: result.timestamp
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to submit property' 
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error in POST /api/post-property:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit property. Please try again later.' 
      },
      { status: 500 }
    );
  }
}
