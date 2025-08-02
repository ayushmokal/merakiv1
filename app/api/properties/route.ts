import { NextRequest, NextResponse } from 'next/server';

// Google Sheets API configuration  
// Connected to your Properties Google Apps Script with 55 properties and Cloudinary support

// Google Apps Script Web App URL for properties data (listing/fetching)
const PROPERTIES_API_URL = process.env.GOOGLE_PROPERTIES_API_URL;
// Google Apps Script Web App URL for property submissions and enquiries  
const PROPERTY_SUBMISSIONS_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

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
    if (!PROPERTIES_API_URL) {
      console.warn('Google Apps Script URL not configured in environment variables');
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
    
    // Debug: Log the raw data from Google Sheets
    console.log('Raw Google Sheets data (first item):', data.data?.[0]);
    console.log('All fields in first property:', Object.keys(data.data?.[0] || {}));
    console.log('Total properties:', data.data?.length);
    
    // Log all property IDs to see what we're getting
    console.log('All property IDs:', data.data?.map((prop: any) => prop.id));
    
    // Look for properties with specific IDs (16, 17)
    const targetProperties = data.data?.filter((prop: any) => prop.id === '16' || prop.id === '17');
    console.log('Properties with IDs 16 or 17:', targetProperties?.length);
    if (targetProperties?.length > 0) {
      console.log('Target properties:', targetProperties);
    }
    
    // Look for properties with video URLs
    const propertiesWithVideos = data.data?.filter((prop: any) => {
      if (prop.images && typeof prop.images === 'string') {
        return prop.images.includes('video/upload');
      }
      if (Array.isArray(prop.images)) {
        return prop.images.some((url: string) => url.includes('video/upload'));
      }
      return false;
    });
    console.log('Properties with video URLs:', propertiesWithVideos?.length);
    if (propertiesWithVideos?.length > 0) {
      console.log('First property with video:', propertiesWithVideos[0]);
    }
    
    // Process the data to handle comma-separated image/video URLs
    const processedData = data.data?.map((property: any) => {
      // Handle images field - split comma-separated URLs
      let images: string[] = [];
      let videos: string[] = [];
      
      // TEMPORARY: Add video URL to first property for testing
      if (property.id === '1') {
        // Add the video URL from your Google Sheets row 16/17 for testing
        const testVideoUrl = 'https://res.cloudinary.com/ddrcnpsxy/video/upload/v1754145383/WhatsApp_Video_2025-07-09_at_19.12.35_35c0e2d2_uijive.mp4';
        const testImageUrl = 'https://res.cloudinary.com/ddrcnpsxy/image/upload/v1752417419/Building_elevation_mndk6l.jpg';
        
        videos.push(testVideoUrl);
        images.push(testImageUrl);
        
        console.log('TEMP: Added video URL to property 1 for testing:', testVideoUrl);
      } else if (property.images) {
        if (typeof property.images === 'string') {
          // Split comma-separated string and clean up URLs
          const urls = property.images.split(',').map((url: string) => url.trim()).filter((url: string) => url);
          
          // Separate videos and images
          urls.forEach((url: string) => {
            const isVideo = url.includes('/video/upload/') || 
                           url.match(/\.(mp4|mov|avi|webm|ogg|m4v|3gp|flv|wmv|mkv)(\?|$|#)/i) ||
                           (url.includes('video') && (url.includes('cloudinary') || url.includes('youtube') || url.includes('vimeo')));
            
            if (isVideo) {
              videos.push(url);
            } else {
              images.push(url);
            }
          });
        } else if (Array.isArray(property.images)) {
          images = property.images;
        }
      }
      
      // Handle videos field if it exists separately
      if (property.videos) {
        if (typeof property.videos === 'string') {
          const videoUrls = property.videos.split(',').map((url: string) => url.trim()).filter((url: string) => url);
          videos = [...videos, ...videoUrls];
        } else if (Array.isArray(property.videos)) {
          videos = [...videos, ...property.videos];
        }
      }
      
      return {
        ...property,
        images,
        videos
      };
    }) || [];
    
    // Debug: Log the processed data
    console.log('Processed data (first item):', processedData[0]);
    
    return NextResponse.json({
      success: true,
      data: processedData,
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
    
    // Check if API URLs are configured
    if (!PROPERTIES_API_URL || !PROPERTY_SUBMISSIONS_URL) {
      console.warn('Google Apps Script URLs not configured in environment variables');
      return NextResponse.json({
        success: false,
        error: 'Google Apps Script not configured. Please add GOOGLE_APPS_SCRIPT_URL and GOOGLE_PROPERTIES_API_URL to your environment variables.'
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

      // Submit enquiry to Google Sheets (use properties API for enquiries)
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

      // Submit property to Google Sheets (use properties API for new property submissions)
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
    if (!PROPERTIES_API_URL) {
      console.warn('Google Apps Script URL not configured in environment variables');
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