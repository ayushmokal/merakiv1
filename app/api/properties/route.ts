import { NextRequest, NextResponse } from 'next/server';

// Google Sheets API configuration  
// Connected to your Properties Google Apps Script with 55 properties and Cloudinary support
const PROPERTIES_API_URL = "https://script.google.com/macros/s/AKfycbxcMffd39lz4L7W2Rov7GfWQNsIR-eRsw2cw3tUY6wAZaZoP0Ed9FUrzNT-Ekr80ko-/exec";

// NOTE: To get your script URL:
// 1. Go to script.google.com
// 2. Create new project and paste the updated-property-portal-apps-script.js code
// 3. Deploy as web app
// 4. Copy the deployment URL and replace YOUR_ACTUAL_SCRIPT_ID_HERE above

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'ALL';
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const bedrooms = searchParams.get('bedrooms') || '';
    const verified = searchParams.get('verified') || '';
    const featured = searchParams.get('featured') || '';

    // Build query parameters for Google Sheets API
    const params = new URLSearchParams({
      category,
      limit,
      offset,
      search,
      location,
      minPrice,
      maxPrice,
      bedrooms,
      verified,
      featured
    });

    // Check if API URL is configured
    if (PROPERTIES_API_URL.includes('YOUR_ACTUAL_SCRIPT_ID_HERE')) {
      console.warn('Google Apps Script URL not configured yet');
      // Return sample data for development
      return NextResponse.json({
        success: true,
        data: [], // Empty for now until API is configured
        total: 0,
        category: category,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: false
        }
      });
    }

    // Fetch from Google Sheets
    const response = await fetch(`${PROPERTIES_API_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data.data || [],
      total: data.total || 0,
      category: data.category || category,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: data.total > (parseInt(offset) + parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch properties',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if API URL is configured
    if (PROPERTIES_API_URL.includes('YOUR_ACTUAL_SCRIPT_ID_HERE')) {
      console.warn('Google Apps Script URL not configured yet');
      return NextResponse.json({
        success: false,
        error: 'Google Apps Script not configured. Please update PROPERTIES_API_URL in /app/api/properties/route.ts'
      }, { status: 503 });
    }
    
    // Validate required fields based on request type
    if (body.type === 'enquiry') {
      // Handle property enquiry
      const { name, phone, email, message, property } = body;
      
      if (!name || !phone || !property) {
        return NextResponse.json(
          { success: false, error: 'Name, phone, and property details are required' },
          { status: 400 }
        );
      }

      // Submit enquiry to Google Sheets
      const enquiryData = {
        type: 'enquiry',
        name,
        phone,
        email: email || '',
        message: message || '',
        projectConfiguration: property.configuration,
        projectCarpetSize: property.carpetArea,
        projectBuiltUp: property.builtUpArea,
        projectNode: property.area,
        projectPrice: property.price,
        enquiryDate: new Date().toISOString(),
        source: 'Property Portal'
      };

      const enquiryResponse = await fetch(PROPERTIES_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiryData)
      });

      if (!enquiryResponse.ok) {
        throw new Error('Failed to submit enquiry');
      }

      return NextResponse.json({
        success: true,
        message: 'Enquiry submitted successfully'
      });

    } else if (body.type === 'property') {
      // Handle new property submission
      const { category, title, location, price, ...propertyData } = body;
      
      if (!category || !title || !location || !price) {
        return NextResponse.json(
          { success: false, error: 'Category, title, location, and price are required' },
          { status: 400 }
        );
      }

      // Submit property to Google Sheets
      const propertySubmissionData = {
        type: 'property',
        category: category.toUpperCase(),
        title,
        location,
        price,
        ...propertyData
      };

      const propertyResponse = await fetch(PROPERTIES_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertySubmissionData)
      });

      if (!propertyResponse.ok) {
        throw new Error('Failed to submit property');
      }

      const result = await propertyResponse.json();

      return NextResponse.json({
        success: true,
        message: 'Property submitted successfully',
        propertyId: result.propertyId
      });

    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid request type' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle property analytics updates (views, likes)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, category, action } = body;

    if (!propertyId || !category || !action) {
      return NextResponse.json(
        { success: false, error: 'Property ID, category, and action are required' },
        { status: 400 }
      );
    }

    // Check if API URL is configured
    if (PROPERTIES_API_URL.includes('YOUR_ACTUAL_SCRIPT_ID_HERE')) {
      console.warn('Google Apps Script URL not configured yet');
      return NextResponse.json({
        success: true,
        message: 'Analytics will be tracked once Google Apps Script is configured',
        newValue: 1
      });
    }

    // Update property stats in Google Sheets
    const updateData = {
      action: 'updateStats',
      propertyId,
      category: category.toUpperCase(),
      field: action === 'view' ? 'Views' : 'Likes',
      increment: 1
    };

    const response = await fetch(PROPERTIES_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      throw new Error('Failed to update property stats');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Property stats updated successfully',
      newValue: result.newValue
    });

  } catch (error) {
    console.error('Error updating property stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update property stats',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 