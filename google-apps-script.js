/**
 * Meraki Square Foots - Popup Blocker Form Handler
 * This script handles form submissions from the website popup
 */

function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Handle both JSON and FormData submissions
    let data;
    if (e.postData.type === 'application/json') {
      // Parse JSON data
      data = JSON.parse(e.postData.contents);
    } else {
      // Parse form data
      data = e.parameter;
    }
    
    // Format timestamp for Indian timezone
    const timestamp = new Date(data.timestamp);
    const istTime = Utilities.formatDate(timestamp, "Asia/Kolkata", "dd/MM/yyyy HH:mm:ss");
    
    // Prepare the row data
    const rowData = [
      istTime,                    // A: Timestamp
      data.name || '',           // B: Name
      data.number || '',         // C: Phone Number
      data.email || '',          // D: Email
      data.enquiry || '',        // E: Enquiry Details
      data.source || 'Website',  // F: Source
      'New'                      // G: Status
    ];
    
    // Add the data to the next available row
    sheet.appendRow(rowData);
    
    // Optional: Send email notification to admin
    sendNotificationEmail(data);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Data saved successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error:', error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Send email notification to admin when new enquiry is received
 */
function sendNotificationEmail(data) {
  try {
    const adminEmail = 'info@merakisquarefoots.com'; // Change this to your email
    
    const subject = `New Enquiry from ${data.name} - Meraki Square Foots`;
    
    const body = `
Dear Team,

A new enquiry has been received through the website popup:

Name: ${data.name}
Phone: ${data.number}
Email: ${data.email || 'Not provided'}
Enquiry: ${data.enquiry || 'Not provided'}
Source: ${data.source}
Time: ${new Date(data.timestamp).toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'})}

Please follow up with the customer as soon as possible.

Best regards,
Meraki Square Foots Website
    `;
    
    MailApp.sendEmail(adminEmail, subject, body);
    
  } catch (error) {
    console.error('Email notification failed:', error);
    // Don't throw error here as main operation was successful
  }
}

/**
 * Test function to verify the setup
 */
function testFunction() {
  const testData = {
    name: 'Test User',
    number: '+91 9876543210',
    email: 'test@example.com',
    enquiry: 'This is a test enquiry',
    source: 'Test',
    timestamp: new Date().toISOString()
  };
  
  console.log('Test data:', testData);
  
  // Simulate the doPost function
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Result:', result.getContent());
}

/**
 * Get the web app URL (run this once to get the deployment URL)
 */
function getWebAppUrl() {
  console.log('Deploy this script as a web app and use the provided URL in your React component');
  console.log('Make sure to set execution as "Anyone" and access as "Anyone, even anonymous"');
} 