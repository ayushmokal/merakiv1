import { NextRequest, NextResponse } from 'next/server';

const WORK_API_URL = process.env.GOOGLE_WORK_API_URL;

// GET: Fetch work entries from Google Sheets (Read-only)
export async function GET(request: NextRequest) {
  try {
    if (!WORK_API_URL) {
      console.error('GOOGLE_WORK_API_URL not configured');
      return NextResponse.json(
        { success: false, error: 'Work API not configured' },
        { status: 500 }
      );
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';
    const type = searchParams.get('type') || '';
    const search = searchParams.get('search') || '';

    // Build URL with parameters for Google Apps Script
    // Your script expects: limit, offset, type, search as direct parameters
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit);
    if (offset) params.append('offset', offset);
    if (type && type !== 'All') params.append('type', type);
    if (search) params.append('search', search);

    const url = params.toString() ? `${WORK_API_URL}?${params.toString()}` : WORK_API_URL;
    console.log('Syncing work entries from Google Sheets:', url);

    // Try the request with additional headers for CORS
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      // Add cache buster to avoid any caching issues
      cache: 'no-cache'
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API response not ok:', response.status, response.statusText);
      console.error('Error response body:', errorText.substring(0, 500));
      throw new Error(`Google Apps Script returned ${response.status}: ${response.statusText}\nBody: ${errorText.substring(0, 200)}`);
    }

    // Get the response as text first to debug
    const responseText = await response.text();
    console.log('Raw response (first 500 chars):', responseText.substring(0, 500));

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response that failed to parse:', responseText.substring(0, 1000));
      const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
      throw new Error(`Invalid JSON response from Google Apps Script: ${errorMessage}`);
    }
    console.log('Raw Google Sheets response:', data);

    // Transform the data to match our frontend expectations
    const transformedData = data.data?.map((item: any) => ({
      id: item.id || '',
      name: item.title || item.name || '', // Apps Script returns 'title'
      type: item.type || '',
      location: item.location || '',
      year: item.year || new Date().getFullYear(),
      description: item.description || '',
      area: item.area || '',
      services: Array.isArray(item.services) ? item.services : (item.services ? item.services.split(',').map((s: string) => s.trim()) : []),
      status: item.status || 'Completed',
      featured: Boolean(item.featured),
      imageUrl: item.image || item.imageUrl || '/images/Picture1.jpg', // Apps Script returns 'image'
      timestamp: item.createdDate || item.timestamp || new Date().toISOString()
    })) || [];

    console.log('Transformed data:', transformedData);

    return NextResponse.json({
      success: true,
      data: transformedData,
      total: data.total || transformedData.length,
      message: `Successfully synced ${transformedData.length} work entries from Google Sheets`
    });

  } catch (error) {
    console.error('Error syncing from Google Sheets:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Google Sheets sync failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
        data: []
      },
      { status: 500 }
    );
  }
}
