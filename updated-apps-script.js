// Configuration for the new enquiry sheet
const SHEET_NAME = "Enquiries"; // Make sure your sheet is named exactly "Enquiries"

// Handle OPTIONS requests for CORS preflight
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON);
}

// Handle POST requests for enquiries
function doPost(e) {
  try {
    // Log the incoming request for debugging
    console.log('Received enquiry request:', e.postData.contents);
    
    // Parse the JSON data from the request
    const data = JSON.parse(e.postData.contents);
    
    // Validate required fields - only name and phone are required now
    if (!data.name || !data.phone) {
      throw new Error('Name and phone are required fields');
    }
    
    // Get the active spreadsheet and enquiries sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const enquiriesSheet = ss.getSheetByName(SHEET_NAME);
    
    if (!enquiriesSheet) {
      throw new Error(`Sheet named "${SHEET_NAME}" not found. Please create it first.`);
    }
    
    // Create timestamp
    const now = new Date();
    
    // Prepare the row data to match your sheet columns
    const rowData = [
      now, // Timestamp (Column A)
      data.name, // Name (Column B)
      data.email || '', // Email (Column C) - now optional
      data.phone, // Phone (Column D)
      data.message || '', // Message (Column E)
      data.projectConfiguration || '', // Project Configuration (Column F)
      data.projectCarpetSize || '', // Carpet Size (Column G)
      data.projectBuiltUp || '', // Built Up (Column H)
      data.projectNode || '', // Node (Column I)
      data.projectPrice || '', // Price (Column J)
      now, // Enquiry Date (Column K)
      data.source || 'Website' // Source (Column L) - new field for popup blocker
    ];
    
    // Add the row to the sheet
    enquiriesSheet.appendRow(rowData);
    
    // Format the new row with light blue background
    const lastRow = enquiriesSheet.getLastRow();
    const range = enquiriesSheet.getRange(lastRow, 1, 1, rowData.length);
    range.setBackground("#E8F0FE"); // Light blue background
    
    // Send email notification for popup blocker submissions
    if (data.source === 'Popup Blocker') {
      sendNotificationEmail(data);
    }
    
    // Log success
    console.log('Successfully added enquiry for:', data.name);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Enquiry submitted successfully',
      timestamp: now.toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log the error
    console.error('Error processing enquiry:', error.toString());
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

// Send email notification for popup blocker enquiries
function sendNotificationEmail(data) {
  try {
    const adminEmail = 'info@merakisquarefoots.com'; // Change this to your email
    
    const subject = `🚨 URGENT: New Popup Enquiry from ${data.name} - Meraki Square Foots`;
    
    const body = `
Dear Team,

🎯 A new HIGH-PRIORITY enquiry has been received through the website popup blocker:

👤 Name: ${data.name}
📱 Phone: ${data.phone}
📧 Email: ${data.email || 'Not provided'}
💬 Message: ${data.message || 'Not provided'}
📍 Source: ${data.source}
⏰ Time: ${new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'})}

⚡ PRIORITY ACTION REQUIRED: 
This visitor was engaged enough to fill out the popup form. Please follow up within 15 minutes for best conversion rates.

Best regards,
Meraki Square Foots Website System
    `;
    
    MailApp.sendEmail(adminEmail, subject, body);
    
  } catch (error) {
    console.error('Email notification failed:', error);
    // Don't throw error here as main operation was successful
  }
}

// Optional: Handle GET requests (for testing purposes)
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Enquiry submission service is running',
    timestamp: new Date().toISOString()
  }))
  .setMimeType(ContentService.MimeType.JSON);
}

// Helper function to set up the sheet headers (run this once manually if needed)
function setupSheetHeaders() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let enquiriesSheet = ss.getSheetByName(SHEET_NAME);
  
  // Create the sheet if it doesn't exist
  if (!enquiriesSheet) {
    enquiriesSheet = ss.insertSheet(SHEET_NAME);
  }
  
  // Set up headers if the sheet is empty
  if (enquiriesSheet.getLastRow() === 0) {
    const headers = [
      'Timestamp',
      'Name', 
      'Email',
      'Phone',
      'Message',
      'Project Configuration',
      'Carpet Size',
      'Built Up',
      'Node',
      'Price',
      'Enquiry Date',
      'Source'
    ];
    
    enquiriesSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format headers
    const headerRange = enquiriesSheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#4285F4"); // Blue background
    headerRange.setFontColor("#FFFFFF"); // White text
    headerRange.setFontWeight("bold");
    
    console.log('Sheet headers set up successfully');
  }
} 