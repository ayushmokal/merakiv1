// Configuration for the popup blocker leads sheet
const POPUP_SHEET_NAME = "merakix504labs_blockerleads"; // Your new sheet for popup leads

// Handle POST requests for popup blocker leads
function doPost(e) {
  try {
    // Log the incoming request for debugging
    console.log('Received popup blocker request');
    
    // Get data from FormData parameters (not JSON)
    const data = e.parameter; // This handles FormData automatically
    
    console.log('Form data received:', data);
    
    // Validate required fields - only name and phone are required
    if (!data.name || !data.phone) {
      throw new Error('Name and phone are required fields');
    }
    
    // Get the active spreadsheet and popup leads sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let popupSheet = ss.getSheetByName(POPUP_SHEET_NAME);
    
    // Create the sheet if it doesn't exist
    if (!popupSheet) {
      popupSheet = ss.insertSheet(POPUP_SHEET_NAME);
      
      // Set up headers for new sheet
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
      
      // Format headers
      const headerRange = popupSheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#28A745"); // Green background
      headerRange.setFontColor("#FFFFFF"); // White text
      headerRange.setFontWeight("bold");
      
      console.log('Created new sheet with headers');
    }
    
    // Create timestamp in Indian timezone
    const now = new Date();
    const istTime = Utilities.formatDate(now, "Asia/Kolkata", "dd/MM/yyyy HH:mm:ss");
    
    // Prepare the row data for popup blocker leads
    const rowData = [
      istTime,                    // A: Timestamp
      data.name || '',            // B: Name
      data.phone || '',           // C: Phone Number
      data.email || '',           // D: Email
      data.message || '',         // E: Enquiry Details
      data.source || 'Popup Blocker', // F: Source
      'New'                       // G: Status
    ];
    
    // Add the row to the sheet
    popupSheet.appendRow(rowData);
    
    // Format the new row with light green background
    const lastRow = popupSheet.getLastRow();
    const range = popupSheet.getRange(lastRow, 1, 1, rowData.length);
    range.setBackground("#D4EDDA"); // Light green background for popup leads
    
    // Send immediate email notification for popup blocker submissions
    sendPopupNotificationEmail(data, istTime);
    
    // Log success
    console.log('Successfully added popup lead for:', data.name);
    
    // Return success response (though client won't see it due to no-cors)
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
    const adminEmail = 'info@merakisquarefoots.com'; // Change this to your actual email
    
    const subject = `🚨 HOT LEAD: Popup Submission from ${data.name} - ACT FAST!`;
    
    const body = `
🔥 URGENT POPUP LEAD ALERT 🔥

A visitor just filled out your popup blocker form!

═══════════════════════════════════════
📋 LEAD DETAILS:
═══════════════════════════════════════

👤 Name: ${data.name}
📱 Phone: ${data.phone}
📧 Email: ${data.email || 'Not provided'}
💬 Message: ${data.message || 'No specific message'}
📍 Source: ${data.source || 'Popup Blocker'}
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

// Handle GET requests (for testing)
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Popup Blocker Lead Capture Service is running',
    sheet: POPUP_SHEET_NAME,
    timestamp: new Date().toISOString()
  }))
  .setMimeType(ContentService.MimeType.JSON);
}

// Test function to verify everything works
function testPopupSubmission() {
  const testData = {
    name: 'Test User',
    phone: '+91 9876543210',
    email: 'test@example.com',
    message: 'Test popup message',
    source: 'Popup Blocker'
  };
  
  console.log('Testing with data:', testData);
  
  const mockEvent = {
    parameter: testData // FormData comes as parameter
  };
  
  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());
} 