// Configuration for the popup blocker leads sheet
const POPUP_SHEET_NAME = "merakix504labs_blockerleads"; // Your new sheet for popup leads

// Handle OPTIONS requests for CORS preflight
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON);
}

// Handle POST requests for popup blocker leads
function doPost(e) {
  try {
    // Log the incoming request for debugging
    console.log('Received popup blocker request:', e.postData.contents);
    
    // Parse the JSON data from the request
    const data = JSON.parse(e.postData.contents);
    
    // Validate required fields - only name and phone are required
    if (!data.name || !data.phone) {
      throw new Error('Name and phone are required fields');
    }
    
    // Get the active spreadsheet and popup leads sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const popupSheet = ss.getSheetByName(POPUP_SHEET_NAME);
    
    if (!popupSheet) {
      throw new Error(`Sheet named "${POPUP_SHEET_NAME}" not found. Please create it first.`);
    }
    
    // Create timestamp in Indian timezone
    const now = new Date();
    const istTime = Utilities.formatDate(now, "Asia/Kolkata", "dd/MM/yyyy HH:mm:ss");
    
    // Prepare the row data for popup blocker leads
    const rowData = [
      istTime,                    // A: Timestamp
      data.name,                  // B: Name
      data.phone,                 // C: Phone Number
      data.email || '',           // D: Email
      data.message || '',         // E: Enquiry Details
      data.source || 'Popup Blocker', // F: Source
      'New'                       // G: Status
    ];
    
    // Add the row to the sheet
    popupSheet.appendRow(rowData);
    
    // Format the new row with light green background (different from project enquiries)
    const lastRow = popupSheet.getLastRow();
    const range = popupSheet.getRange(lastRow, 1, 1, rowData.length);
    range.setBackground("#D4EDDA"); // Light green background for popup leads
    
    // Send immediate email notification for popup blocker submissions
    sendPopupNotificationEmail(data, istTime);
    
    // Log success
    console.log('Successfully added popup lead for:', data.name);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Popup lead captured successfully',
      timestamp: now.toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log the error
    console.error('Error processing popup lead:', error.toString());
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

// Send immediate email notification for popup blocker leads
function sendPopupNotificationEmail(data, timestamp) {
  try {
    const adminEmail = 'info@merakisquarefoots.com'; // Change this to your email
    
    const subject = `🚨 HOT LEAD: Popup Blocker Submission from ${data.name} - IMMEDIATE ACTION REQUIRED`;
    
    const body = `
🔥 URGENT POPUP LEAD ALERT 🔥

A visitor just filled out your popup blocker form - these are your HOTTEST leads!

═══════════════════════════════════════
📋 LEAD DETAILS:
═══════════════════════════════════════

👤 Name: ${data.name}
📱 Phone: ${data.phone}
📧 Email: ${data.email || 'Not provided'}
💬 Message: ${data.message || 'No specific message'}
📍 Source: Popup Blocker (Website)
⏰ Time: ${timestamp}

═══════════════════════════════════════
⚡ RECOMMENDED ACTION:
═══════════════════════════════════════

🎯 CALL WITHIN 5 MINUTES for maximum conversion
📞 This lead was engaged enough to complete the popup
💰 Popup leads have 3x higher conversion rates
🏃‍♂️ Speed to contact is CRITICAL

═══════════════════════════════════════

Best of luck closing this lead!

Meraki Square Foots - Lead Capture System
    `;
    
    MailApp.sendEmail(adminEmail, subject, body);
    console.log('Popup notification email sent successfully');
    
  } catch (error) {
    console.error('Email notification failed:', error);
    // Don't throw error here as main operation was successful
  }
}

// Optional: Handle GET requests (for testing purposes)
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Popup Blocker Lead Capture Service is running',
    sheet: POPUP_SHEET_NAME,
    timestamp: new Date().toISOString()
  }))
  .setMimeType(ContentService.MimeType.JSON);
}

// Helper function to set up the popup leads sheet headers (run this once manually)
function setupPopupSheetHeaders() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let popupSheet = ss.getSheetByName(POPUP_SHEET_NAME);
  
  // Create the sheet if it doesn't exist
  if (!popupSheet) {
    popupSheet = ss.insertSheet(POPUP_SHEET_NAME);
    console.log(`Created new sheet: ${POPUP_SHEET_NAME}`);
  }
  
  // Set up headers if the sheet is empty or needs updating
  const headers = [
    'Timestamp',
    'Name', 
    'Phone Number',
    'Email',
    'Enquiry Details',
    'Source',
    'Status'
  ];
  
  popupSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers with a distinctive color for popup leads
  const headerRange = popupSheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#28A745"); // Green background for popup leads sheet
  headerRange.setFontColor("#FFFFFF"); // White text
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(11);
  
  // Auto-resize columns
  popupSheet.autoResizeColumns(1, headers.length);
  
  console.log('Popup leads sheet headers set up successfully');
  return `Setup complete for sheet: ${POPUP_SHEET_NAME}`;
}

// Function to test the popup lead capture
function testPopupSubmission() {
  const testData = {
    name: 'Test Popup User',
    phone: '+91 9876543210',
    email: 'test@popup.com',
    message: 'Test popup enquiry',
    source: 'Popup Blocker'
  };
  
  console.log('Testing popup submission with data:', testData);
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());
} 