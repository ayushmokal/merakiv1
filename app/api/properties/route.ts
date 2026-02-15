import { NextRequest, NextResponse } from 'next/server';

// Google Sheets API configuration  
// Connected to your Properties Google Apps Script with 55 properties and Cloudinary support

// Google Apps Script Web App URL for properties data (listing/fetching)
const PROPERTIES_API_URL = process.env.GOOGLE_PROPERTY_API_URL;
// Google Apps Script Web App URL for property submissions and enquiries  
const PROPERTY_SUBMISSIONS_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

// In-memory cache for properties to avoid repeated slow Google Apps Script calls
type PropertiesCacheEntry = {
  timestamp: number;
  key: string;
  processedData: any[];
  originalTotal: number;
  category: string;
};

const PROPERTIES_CACHE_TTL_MS = parseInt(process.env.PROPERTIES_CACHE_TTL_MS || '60000'); // default 60s
const globalAny = globalThis as typeof globalThis & {
  __PROPERTIES_CACHE__?: Map<string, PropertiesCacheEntry>;
};
const PROPERTIES_CACHE: Map<string, PropertiesCacheEntry> =
  globalAny.__PROPERTIES_CACHE__ || (globalAny.__PROPERTIES_CACHE__ = new Map());

// NOTE: To get your script URL:
// 1. Go to script.google.com
// 2. Create new project and paste the updated-property-portal-apps-script.js code
// 3. Deploy as web app
// 4. Copy the deployment URL and replace YOUR_ACTUAL_SCRIPT_ID_HERE above

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'ALL'; // RESIDENTIAL, COMMERCIAL, ALL
    const transactionType = searchParams.get('transactionType') || 'ALL'; // BUY, LEASE, ALL
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
      transactionType, // New parameter
      search,
      location,
      bedrooms,
      verified,
      featured
    });
    
    // Add price filters only if they exist
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);

    // Build cache key ignoring pagination to reuse the same dataset for different pages
    const cacheKey = JSON.stringify({ category, transactionType, search, location, minPrice, maxPrice, bedrooms, verified, featured });
    const cached = PROPERTIES_CACHE.get(cacheKey);
    const now = Date.now();
    if (cached && now - cached.timestamp < PROPERTIES_CACHE_TTL_MS) {
      const limitNum = parseInt(limit);
      const offsetNum = parseInt(offset);
      const totalFilteredCount = cached.processedData.length;
      const paginatedData = cached.processedData.slice(offsetNum, offsetNum + limitNum);
      const hasMoreResults = (offsetNum + limitNum) < totalFilteredCount;

      return NextResponse.json(
        {
          success: true,
          data: paginatedData,
          total: totalFilteredCount,
          originalTotal: cached.originalTotal,
          category: cached.category || category,
          pagination: { limit: limitNum, offset: offsetNum, hasMore: hasMoreResults },
          filters: { minPrice, maxPrice, location, bedrooms, search, verified, featured },
          cache: { hit: true, age: Math.round((now - cached.timestamp) / 1000) }
        },
        { headers: { 'Cache-Control': 'public, max-age=15, s-maxage=30, stale-while-revalidate=60', 'x-cache': 'HIT' } }
      );
    }

    // Check if API URL is configured
    if (!PROPERTIES_API_URL) {
      console.error('GOOGLE_PROPERTY_API_URL not configured in environment variables');
      console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('GOOGLE')));
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
        },
        error: 'API URL not configured'
      });
    }

    console.log('Making request to Google Apps Script:', `${PROPERTIES_API_URL}?${params}`);
    console.log('Request parameters:', { category, transactionType, search, location });

    // Fetch from Google Sheets with timeout (12s)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    let response: Response;
    try {
      response = await fetch(`${PROPERTIES_API_URL}?${params}` , { signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Debug: Log the complete response from Google Apps Script
    console.log('Google Apps Script Response Status:', data.status);
    console.log('Response Category:', data.category);
    console.log('Response Total:', data.total);
    console.log('Response Data Length:', data.data?.length || 0);
    
    if (data.status === 'error') {
      console.error('Google Apps Script Error:', data.message);
      return NextResponse.json({
        success: false,
        error: 'Google Apps Script Error: ' + data.message,
        data: [],
        total: 0
      });
    }
    
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
    let processedData = data.data?.map((property: any) => {
      // Handle images field - split comma-separated URLs
      let images: string[] = [];
      let videos: string[] = [];
      let media: string[] = []; // Preserve original order from Google Sheets
      
      if (property.images) {
        if (typeof property.images === 'string') {
          // Split comma-separated string and clean up URLs
          const urls = property.images.split(',').map((url: string) => url.trim()).filter((url: string) => url);
          
          // Preserve original order in media array
          media = [...urls];
          
          // Separate videos and images for backward compatibility
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
          // Handle array of URLs directly
          media = [...property.images]; // Preserve original order
          
          // Separate videos and images for backward compatibility
          property.images.forEach((url: string) => {
            const isVideo = url.includes('/video/upload/') || 
                           url.match(/\.(mp4|mov|avi|webm|ogg|m4v|3gp|flv|wmv|mkv)(\?|$|#)/i) ||
                           (url.includes('video') && (url.includes('cloudinary') || url.includes('youtube') || url.includes('vimeo')));
            
            if (isVideo) {
              videos.push(url);
            } else {
              images.push(url);
            }
          });
        }
      }
      
      // Handle videos field if it exists separately
      if (property.videos) {
        if (typeof property.videos === 'string') {
          const videoUrls = property.videos.split(',').map((url: string) => url.trim()).filter((url: string) => url);
          videos = [...videos, ...videoUrls];
          media = [...media, ...videoUrls]; // Add to media array too
        } else if (Array.isArray(property.videos)) {
          videos = [...videos, ...property.videos];
          media = [...media, ...property.videos]; // Add to media array too
        }
      }
      
      return {
        ...property,
        images,
        videos,
        media // New field preserving original order
      };
    }) || [];

    // Apply client-side filtering to ensure accurate results
    if (processedData && processedData.length > 0) {
      
      // Filter by price range - CRITICAL FIX for your 18L vs 19L issue
      if (minPrice || maxPrice) {
        processedData = processedData.filter((property: any) => {
          if (!property.price) return true; // Include properties without price
          
          // Normalize price string - handle various formats
          let priceString = property.price.toString()
            .replace(/[₹\s,]/g, '') // Remove rupee symbol, spaces, commas
            .replace(/–/g, '-') // Replace em dash with regular dash
            .replace(/\s+/g, '') // Remove any remaining spaces
            .toLowerCase();
          
          // Extract price ranges like "45-55lakhs", "19l-30l", or "1.5cr-2cr"
          const priceMatches = priceString.match(/(\d+(?:\.\d+)?)\s*(?:cr|crores?|l|lakhs?)?(?:\s*[-–]\s*(\d+(?:\.\d+)?)\s*(?:cr|crores?|l|lakhs?)?)?/gi);
          
          if (!priceMatches || priceMatches.length === 0) return true;
          
          // Parse price ranges
          const match = priceMatches[0];
          const parts = match.split(/[-–]/);
          
          let propertyMinPrice, propertyMaxPrice;
          
          if (parts.length === 2) {
            // Range format like "45-55lakhs", "19l-30l", "1.5Cr-2Cr", or "90L-1.2Cr"
            // Parse each part individually to handle mixed units
            const minPart = parts[0].toLowerCase();
            const maxPart = parts[1].toLowerCase();
            
            // Parse minimum price
            const minNum = parseFloat(minPart.replace(/[^0-9.]/g, ''));
            if (minPart.includes('cr') || minPart.includes('crore')) {
              propertyMinPrice = minNum * 10000000; // 1 Cr = 1,00,00,000
            } else if (minPart.includes('l') || minPart.includes('lakh')) {
              propertyMinPrice = minNum * 100000; // 1 L = 1,00,000
            } else {
              propertyMinPrice = minNum;
            }
            
            // Parse maximum price
            const maxNum = parseFloat(maxPart.replace(/[^0-9.]/g, ''));
            if (maxPart.includes('cr') || maxPart.includes('crore')) {
              propertyMaxPrice = maxNum * 10000000; // 1 Cr = 1,00,00,000
            } else if (maxPart.includes('l') || maxPart.includes('lakh')) {
              propertyMaxPrice = maxNum * 100000; // 1 L = 1,00,000
            } else {
              propertyMaxPrice = maxNum;
            }
          } else {
            // Single price format
            const hasLakhsIndicator = match.toLowerCase().includes('l') || match.toLowerCase().includes('lakh');
            const hasCroreIndicator = match.toLowerCase().includes('cr') || match.toLowerCase().includes('crore');
            const num = parseFloat(match.replace(/[^0-9.]/g, ''));
            
            if (hasCroreIndicator) {
              propertyMinPrice = num * 10000000; // 1 Cr = 1,00,00,000
              propertyMaxPrice = propertyMinPrice;
            } else if (hasLakhsIndicator) {
              propertyMinPrice = num * 100000; // 1 L = 1,00,000
              propertyMaxPrice = propertyMinPrice;
            } else {
              propertyMinPrice = num;
              propertyMaxPrice = propertyMinPrice;
            }
          }
          
          let matches = true;
          
          // CRITICAL FIX: When user sets price filter to 18L (1800000), 
          // we should EXCLUDE properties with minimum price > filter maximum
          if (maxPrice && maxPrice !== '') {
            const filterMax = parseInt(maxPrice);
            // Property's MINIMUM price must be <= user's maximum filter
            // This ensures 19L properties are excluded when filter is set to 18L
            matches = matches && propertyMinPrice <= filterMax;
          }
          
          // If user sets minimum price filter
          if (minPrice && minPrice !== '') {
            const filterMin = parseInt(minPrice);
            // Property's MAXIMUM price must be >= user's minimum filter
            matches = matches && propertyMaxPrice >= filterMin;
          }
          
          console.log(`Property ${property.id}: "${property.price}" -> Min: ${propertyMinPrice}, Max: ${propertyMaxPrice}, Filter Min: ${minPrice || 0}, Filter Max: ${maxPrice || 100000000}, Matches: ${matches}`);
          
          return matches;
        });
      }
      
      // Filter by location
      if (location && location !== '' && location !== 'All Locations') {
        processedData = processedData.filter((property: any) => 
          property.location && property.location.toLowerCase().includes(location.toLowerCase())
        );
      }

      // Filter by bedrooms/configuration
      if (bedrooms && bedrooms !== '') {
        processedData = processedData.filter((property: any) => {
          if (!property.configuration) return false;
          const config = property.configuration.toString().toLowerCase();
          return config.includes(bedrooms.toLowerCase()) || config.includes(`${bedrooms} bhk`);
        });
      }

      // Filter by search term
      if (search && search !== '') {
        const searchLower = search.toLowerCase();
        processedData = processedData.filter((property: any) => {
          const title = property.title?.toLowerCase() || '';
          const location = property.location?.toLowerCase() || '';
          const description = property.description?.toLowerCase() || '';
          const configuration = property.configuration?.toLowerCase() || '';
          
          return title.includes(searchLower) || 
                 location.includes(searchLower) || 
                 description.includes(searchLower) ||
                 configuration.includes(searchLower);
        });
      }

      // Filter by verified status
      if (verified && verified !== '') {
        const isVerified = verified.toLowerCase() === 'true';
        processedData = processedData.filter((property: any) => 
          Boolean(property.verified) === isVerified
        );
      }

      // Filter by featured status
      if (featured && featured !== '') {
        const isFeatured = featured.toLowerCase() === 'true';
        processedData = processedData.filter((property: any) => 
          Boolean(property.featured) === isFeatured
        );
      }
    }
    
    // Apply pagination AFTER filtering
    const totalFilteredCount = processedData.length;
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);

    // Save to cache before slicing so all pages can reuse
    PROPERTIES_CACHE.set(cacheKey, {
      timestamp: Date.now(),
      key: cacheKey,
      processedData,
      originalTotal: data.total || processedData.length,
      category: data.category || category
    });
    
    // Slice the data for pagination
    const paginatedData = processedData.slice(offsetNum, offsetNum + limitNum);
    
    // Calculate if there are more results
    const hasMoreResults = (offsetNum + limitNum) < totalFilteredCount;
    
    // Debug: Log the processed and filtered data
    console.log('Total filtered properties:', totalFilteredCount);
    console.log('Paginated properties:', paginatedData.length);
    console.log('Offset:', offsetNum, 'Limit:', limitNum);
    console.log('Has more results:', hasMoreResults);
    console.log('Original data count:', data.data?.length || 0);
    
    return NextResponse.json({
      success: true,
      data: paginatedData, // Return only the current page
      total: totalFilteredCount, // Total filtered count
      originalTotal: data.total || 0, // Keep original total for reference
      category: data.category || category,
      pagination: {
        limit: limitNum,
        offset: offsetNum,
        hasMore: hasMoreResults // Proper hasMore calculation
      },
      filters: {
        minPrice,
        maxPrice,
        location,
        bedrooms,
        search,
        verified,
        featured
      }
    }, { headers: { 'Cache-Control': 'public, max-age=15, s-maxage=30, stale-while-revalidate=60', 'x-cache': 'MISS' } });

  } catch (error) {
    console.error('Error fetching properties:', error);
    // Fallback to latest cache if available
    if (PROPERTIES_CACHE.size > 0) {
      const latest = Array.from(PROPERTIES_CACHE.values()).sort((a, b) => b.timestamp - a.timestamp)[0];
      if (latest) {
        const limitNum = 50;
        const offsetNum = 0;
        const totalFilteredCount = latest.processedData.length;
        const paginatedData = latest.processedData.slice(offsetNum, offsetNum + limitNum);
        const hasMoreResults = (offsetNum + limitNum) < totalFilteredCount;
        return NextResponse.json(
          {
            success: true,
            data: paginatedData,
            total: totalFilteredCount,
            originalTotal: latest.originalTotal,
            category: latest.category,
            pagination: { limit: limitNum, offset: offsetNum, hasMore: hasMoreResults },
            cache: { fallback: true }
          },
          { headers: { 'Cache-Control': 'public, max-age=30', 'x-cache': 'STALE' } }
        );
      }
    }
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
