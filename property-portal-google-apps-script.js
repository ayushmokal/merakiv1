/**
 * Google Apps Script for Property Portal - Property Submissions
 * This script handles property submissions from the Next.js application
 * and stores them in a Google Sheet with proper formatting and validation.
 */

// Configuration - Update these with your actual sheet details
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE'; // Replace with your Google Sheet ID
const SHEET_NAME = 'Property Submissions'; // Name of the sheet tab

/**
 * Main function to handle POST requests from the Next.js application
 */
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Log the received data for debugging
    console.log('Received data:', data);
    
    // Get or create the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Create the sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      setupSheetHeaders(sheet);
    }
    
    // Validate the data
    const validationResult = validatePropertyData(data);
    if (!validationResult.isValid) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: validationResult.error
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Add the property data to the sheet
    const result = addPropertyToSheet(sheet, data);
    
    // Send email notification (optional)
    sendEmailNotification(data);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Property submitted successfully',
        rowNumber: result.rowNumber
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing request:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Internal server error: ' + error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Set up the headers for the property submissions sheet
 */
function setupSheetHeaders(sheet) {
  const headers = [
    'Timestamp',
    'Property Type',
    'Listing Type',
    'Title',
    'Description',
    'Location',
    'Area',
    'Price',
    'Price Type',
    'Configuration',
    'Carpet Area (sq ft)',
    'Built-up Area (sq ft)',
    'Bedrooms',
    'Bathrooms',
    'Balconies',
    'Parking',
    'Furnished',
    'Amenities',
    'Contact Name',
    'Contact Phone',
    'Contact Email',
    'Additional Notes',
    'Status',
    'Follow-up Date',
    'Agent Assigned'
  ];
  
  // Set headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // Set column widths
  sheet.setColumnWidth(1, 120); // Timestamp
  sheet.setColumnWidth(2, 120); // Property Type
  sheet.setColumnWidth(3, 80);  // Listing Type
  sheet.setColumnWidth(4, 200); // Title
  sheet.setColumnWidth(5, 150); // Description
  sheet.setColumnWidth(6, 120); // Location
  sheet.setColumnWidth(7, 100); // Area
  sheet.setColumnWidth(8, 100); // Price
  sheet.setColumnWidth(9, 80);  // Price Type
  sheet.setColumnWidth(10, 100); // Configuration
  sheet.setColumnWidth(11, 100); // Carpet Area
  sheet.setColumnWidth(12, 100); // Built-up Area
  sheet.setColumnWidth(13, 80);  // Bedrooms
  sheet.setColumnWidth(14, 80);  // Bathrooms
  sheet.setColumnWidth(15, 80);  // Balconies
  sheet.setColumnWidth(16, 80);  // Parking
  sheet.setColumnWidth(17, 100); // Furnished
  sheet.setColumnWidth(18, 200); // Amenities
  sheet.setColumnWidth(19, 120); // Contact Name
  sheet.setColumnWidth(20, 120); // Contact Phone
  sheet.setColumnWidth(21, 150); // Contact Email
  sheet.setColumnWidth(22, 200); // Additional Notes
  sheet.setColumnWidth(23, 100); // Status
  sheet.setColumnWidth(24, 120); // Follow-up Date
  sheet.setColumnWidth(25, 120); // Agent Assigned
  
  // Freeze header row
  sheet.setFrozenRows(1);
}

/**
 * Validate the incoming property data
 */
function validatePropertyData(data) {
  const requiredFields = [
    'propertyType',
    'listingType',
    'title',
    'location',
    'price',
    'contactName',
    'contactPhone'
  ];
  
  for (const field of requiredFields) {
    if (!data[field] || data[field].toString().trim() === '') {
      return {
        isValid: false,
        error: `Missing required field: ${field}`
      };
    }
  }
  
  // Validate phone number format (basic validation)
  const phoneRegex = /^[\d\s\+\-\(\)]{10,15}$/;
  if (!phoneRegex.test(data.contactPhone)) {
    return {
      isValid: false,
      error: 'Invalid phone number format'
    };
  }
  
  // Validate email if provided
  if (data.contactEmail && data.contactEmail.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.contactEmail)) {
      return {
        isValid: false,
        error: 'Invalid email format'
      };
    }
  }
  
  return { isValid: true };
}

/**
 * Add property data to the sheet
 */
function addPropertyToSheet(sheet, data) {
  const timestamp = new Date();
  
  // Prepare the row data
  const rowData = [
    timestamp,
    data.propertyType || '',
    data.listingType || '',
    data.title || '',
    data.description || '',
    data.location || '',
    data.area || '',
    data.price || '',
    data.priceType || '',
    data.configuration || '',
    data.carpetArea || '',
    data.builtUpArea || '',
    data.bedrooms || '',
    data.bathrooms || '',
    data.balconies || '',
    data.parking || '',
    data.furnished || '',
    data.amenities || '',
    data.contactName || '',
    data.contactPhone || '',
    data.contactEmail || '',
    data.additionalNotes || '',
    'New', // Status
    '', // Follow-up Date (empty initially)
    '' // Agent Assigned (empty initially)
  ];
  
  // Find the next empty row
  const lastRow = sheet.getLastRow();
  const nextRow = lastRow + 1;
  
  // Insert the data
  sheet.getRange(nextRow, 1, 1, rowData.length).setValues([rowData]);
  
  // Format the new row
  const newRowRange = sheet.getRange(nextRow, 1, 1, rowData.length);
  
  // Alternate row colors for better readability
  if (nextRow % 2 === 0) {
    newRowRange.setBackground('#f8f9fa');
  }
  
  // Format timestamp column
  sheet.getRange(nextRow, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');
  
  // Format price column
  if (data.price) {
    sheet.getRange(nextRow, 8).setNumberFormat('#,##0');
  }
  
  // Set status cell formatting
  const statusCell = sheet.getRange(nextRow, 23);
  statusCell.setBackground('#fff3cd');
  statusCell.setFontColor('#856404');
  statusCell.setFontWeight('bold');
  
  return {
    rowNumber: nextRow,
    timestamp: timestamp
  };
}

/**
 * Send email notification when a new property is submitted
 */
function sendEmailNotification(data) {
  try {
    // Configuration - Update with your email settings
    const NOTIFICATION_EMAIL = 'your-email@example.com'; // Replace with your email
    const COMPANY_NAME = 'Meraki Property Portal';
    
    const subject = `New Property Submission - ${data.title}`;
    
    const emailBody = `
Dear Team,

A new property has been submitted to ${COMPANY_NAME}. Here are the details:

Property Information:
- Property Type: ${data.propertyType}
- Listing Type: ${data.listingType}
- Title: ${data.title}
- Location: ${data.location}
- Price: ₹${data.price} (${data.priceType})
- Configuration: ${data.configuration}

Contact Information:
- Name: ${data.contactName}
- Phone: ${data.contactPhone}
- Email: ${data.contactEmail || 'Not provided'}

Description:
${data.description || 'Not provided'}

Additional Notes:
${data.additionalNotes || 'None'}

Please follow up with the customer as soon as possible.

Best regards,
${COMPANY_NAME} System
    `;
    
    // Send email
    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: subject,
      body: emailBody
    });
    
    console.log('Email notification sent successfully');
    
  } catch (error) {
    console.error('Failed to send email notification:', error);
    // Don't throw error here as it shouldn't stop the main process
  }
}

/**
 * Function to test the setup (run this manually to test)
 */
function testSetup() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      setupSheetHeaders(sheet);
      console.log('Sheet created and headers set up successfully');
    } else {
      console.log('Sheet already exists');
    }
    
    // Test with sample data
    const sampleData = {
      timestamp: new Date().toISOString(),
      propertyType: 'Residential Apartment',
      listingType: 'Sale',
      title: 'Test Property Submission',
      description: 'This is a test submission',
      location: 'Bandra West',
      area: 'Near Metro',
      price: '5000000',
      priceType: 'total',
      configuration: '2 BHK',
      carpetArea: '850',
      builtUpArea: '1000',
      bedrooms: '2',
      bathrooms: '2',
      balconies: '1',
      parking: '1',
      furnished: 'Semi-Furnished',
      amenities: 'Swimming Pool, Gym, Security',
      contactName: 'Test User',
      contactPhone: '9876543210',
      contactEmail: 'test@example.com',
      additionalNotes: 'This is a test submission for setup validation'
    };
    
    const result = addPropertyToSheet(sheet, sampleData);
    console.log('Test data added successfully at row:', result.rowNumber);
    
    return 'Setup test completed successfully';
    
  } catch (error) {
    console.error('Setup test failed:', error);
    return 'Setup test failed: ' + error.message;
  }
}

/**
 * Function to get all properties (for admin dashboard - optional)
 */
function getProperties() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return { success: false, error: 'Sheet not found' };
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const properties = [];
    
    for (let i = 1; i < data.length; i++) {
      const property = {};
      for (let j = 0; j < headers.length; j++) {
        property[headers[j]] = data[i][j];
      }
      properties.push(property);
    }
    
    return {
      success: true,
      properties: properties
    };
    
  } catch (error) {
    console.error('Error getting properties:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
