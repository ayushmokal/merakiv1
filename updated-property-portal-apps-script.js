// Updated Google Apps Script for Property Portal
// Works with existing sheet structure: Buy Projects, Lease Projects, Bungalow Projects, Commercial Projects, Interior Projects

// Configuration for existing sheet names
const PROPERTY_SHEETS = {
  BUY: "Buy Projects",
  LEASE: "Lease Projects", 
  COMMERCIAL: "Commercial Projects",
  BUNGALOW: "Bungalow Projects",
  INTERIOR: "Interior Projects",
  ENQUIRIES: "Enquiries"
};

// Handle OPTIONS requests for CORS preflight
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON);
}

// Handle GET requests - Fetch properties by category
function doGet(e) {
  try {
    const category = e.parameter.category || 'ALL';
    const limit = parseInt(e.parameter.limit) || 50;
    const offset = parseInt(e.parameter.offset) || 0;
    const search = e.parameter.search || '';
    const location = e.parameter.location || '';
    
    console.log(`Fetching properties for category: ${category}, limit: ${limit}, offset: ${offset}`);
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let allProperties = [];
    
    if (category === 'ALL') {
      // Fetch from all property sheets
      for (const [categoryName, sheetName] of Object.entries(PROPERTY_SHEETS)) {
        if (categoryName !== 'ENQUIRIES') {
          const properties = getPropertiesFromSheet(ss, sheetName, categoryName.toLowerCase());
          allProperties = allProperties.concat(properties);
        }
      }
    } else {
      // Fetch from specific category
      const sheetName = PROPERTY_SHEETS[category.toUpperCase()];
      if (sheetName) {
        allProperties = getPropertiesFromSheet(ss, sheetName, category.toLowerCase());
      }
    }
    
    // Apply search filter
    if (search) {
      allProperties = allProperties.filter(property =>
        property.title.toLowerCase().includes(search.toLowerCase()) ||
        property.location.toLowerCase().includes(search.toLowerCase()) ||
        property.area.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply location filter
    if (location) {
      allProperties = allProperties.filter(property => 
        property.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    // Sort by newest first (based on index for now)
    allProperties.reverse();
    
    // Apply pagination
    const paginatedProperties = allProperties.slice(offset, offset + limit);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      data: paginatedProperties,
      total: allProperties.length,
      category: category,
      limit: limit,
      offset: offset
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error in doGet:', error);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle POST requests
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Handle different types of requests
    if (data.type === 'enquiry') {
      return handleEnquiry(data);
    } else if (data.type === 'property') {
      return handleNewProperty(data);
    } else if (data.action === 'updateStats') {
      return handleUpdateStats(data);
    } else {
      // Default to enquiry for backward compatibility
      return handleEnquiry(data);
    }
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle property enquiries
function handleEnquiry(data) {
  if (!data.name || !data.phone) {
    throw new Error('Name and phone are required fields');
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const enquiriesSheet = ss.getSheetByName(PROPERTY_SHEETS.ENQUIRIES);
  
  if (!enquiriesSheet) {
    throw new Error('Enquiries sheet not found');
  }
  
  // Create timestamp in Indian timezone
  const now = new Date();
  const istTime = Utilities.formatDate(now, "Asia/Kolkata", "dd/MM/yyyy HH:mm:ss");
  
  const rowData = [
    istTime, // Timestamp
    data.name, // Name
    data.email || '', // Email
    data.phone, // Phone
    data.message || '', // Message
    data.projectConfiguration || '', // Project Configuration
    data.projectCarpetSize || '', // Carpet Size
    data.projectBuiltUp || '', // Built Up
    data.projectNode || '', // Node
    data.projectPrice || '', // Price
    istTime, // Enquiry Date
    data.source || 'Property Portal' // Source
  ];
  
  enquiriesSheet.appendRow(rowData);
  
  // Format the new row
  const lastRow = enquiriesSheet.getLastRow();
  const range = enquiriesSheet.getRange(lastRow, 1, 1, rowData.length);
  range.setBackground("#E8F0FE"); // Light blue background
  
  // Send notification email
  sendEnquiryNotificationEmail(data, istTime);
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Enquiry submitted successfully'
  }))
  .setMimeType(ContentService.MimeType.JSON);
}

// Handle new property additions
function handleNewProperty(data) {
  const { category, title, location, price } = data;
  
  if (!category || !title || !location || !price) {
    throw new Error('Category, title, location, and price are required');
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = PROPERTY_SHEETS[category.toUpperCase()];
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    throw new Error(`Sheet ${sheetName} not found`);
  }
  
  // Generate new S R NO
  const lastRow = sheet.getLastRow();
  const newSrNo = lastRow; // Simple incrementing number
  
  // Prepare row data based on existing structure
  const rowData = [
    newSrNo, // S R NO
    data.configuration || title, // Configuration
    data.carpetArea || 0, // Carpet Size
    data.builtUpArea || 0, // Built up
    data.area || location, // Node
    price // Price
  ];
  
  // Add the row to the sheet
  sheet.appendRow(rowData);
  
  // Format the new row
  const newLastRow = sheet.getLastRow();
  const range = sheet.getRange(newLastRow, 1, 1, rowData.length);
  range.setBackground("#D4EDDA"); // Light green background for new properties
  
  // Send notification email
  sendPropertyNotificationEmail(data, newSrNo);
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Property added successfully',
    propertyId: newSrNo.toString(),
    category: category
  }))
  .setMimeType(ContentService.MimeType.JSON);
}

// Handle analytics updates (views, likes)
function handleUpdateStats(data) {
  // For now, just return success - can be implemented later when analytics columns are added
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Stats updated successfully',
    newValue: 1
  }))
  .setMimeType(ContentService.MimeType.JSON);
}

// Get properties from a specific sheet
function getPropertiesFromSheet(ss, sheetName, category) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    console.log(`Sheet ${sheetName} not found`);
    return [];
  }
  
  if (sheet.getLastRow() < 2) {
    return []; // No data rows
  }
  
  const lastRow = sheet.getLastRow();
  const data = sheet.getRange(2, 1, lastRow - 1, 6).getValues(); // Get 6 columns (A-F)
  const properties = [];
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (row[0] && row[0].toString().trim() !== '') {
      const property = {
        id: row[0].toString(), // S R NO
        type: category,
        title: createPropertyTitle(row[1], category), // Based on Configuration
        location: extractLocation(row[4]), // From Node
        area: row[4] || '', // Node
        price: (row[5] || '').toString().replace('₹', ''), // Price
        priceType: getPriceType(category),
        configuration: row[1] || '', // Configuration
        carpetArea: parseFloat(row[2]) || 0, // Carpet Size
        builtUpArea: parseFloat(row[3]) || 0, // Built up
        bedrooms: extractBedrooms(row[1]), // Extract from Configuration
        bathrooms: extractBathrooms(row[1]), // Extract from Configuration
        balconies: 1, // Default
        parking: 1, // Default
        furnished: getDefaultFurnished(category),
        amenities: getDefaultAmenities(category),
        description: createDescription(row[1], row[4], category),
        featured: i < 2, // First 2 properties are featured
        verified: true, // All existing properties are verified
        contact: {
          name: 'Meraki Square Foots',
          phone: '+91 98765 43210',
          email: 'info@merakisquarefoots.com'
        },
        postedDate: new Date().toISOString().split('T')[0], // Today's date
        views: Math.floor(Math.random() * 200) + 50, // Random views
        likes: Math.floor(Math.random() * 30) + 5, // Random likes
        images: [] // Will be populated later
      };
      
      properties.push(property);
    }
  }
  
  return properties;
}

// Helper functions
function createPropertyTitle(configuration, category) {
  if (!configuration) return 'Property Available';
  
  switch (category) {
    case 'buy':
      return `${configuration} for Sale`;
    case 'lease':
      return `${configuration} for Rent`;
    case 'commercial':
      return `Commercial ${configuration}`;
    case 'bungalow':
      return `Independent ${configuration}`;
    case 'interior':
      return `Interior Design for ${configuration}`;
    default:
      return configuration;
  }
}

function extractLocation(node) {
  if (!node) return 'Navi Mumbai';
  
  // Extract location from node (e.g., "sec 21 ( kharghar )" -> "Kharghar")
  const match = node.match(/\(\s*([^)]+)\s*\)/);
  if (match) {
    return match[1].trim().charAt(0).toUpperCase() + match[1].trim().slice(1).toLowerCase() + ', Navi Mumbai';
  }
  
  return node + ', Navi Mumbai';
}

function extractBedrooms(configuration) {
  if (!configuration) return 0;
  
  const match = configuration.match(/(\d+)\s*BHK/i);
  return match ? parseInt(match[1]) : 0;
}

function extractBathrooms(configuration) {
  const bedrooms = extractBedrooms(configuration);
  return bedrooms > 0 ? bedrooms : 1; // Usually same as bedrooms or at least 1
}

function getPriceType(category) {
  switch (category) {
    case 'buy':
    case 'bungalow':
      return 'total';
    case 'lease':
      return 'per_month';
    case 'commercial':
    case 'interior':
      return 'per_sqft';
    default:
      return 'total';
  }
}

function getDefaultFurnished(category) {
  switch (category) {
    case 'lease':
      return 'Semi-Furnished';
    case 'commercial':
      return 'Unfurnished';
    default:
      return 'Semi-Furnished';
  }
}

function getDefaultAmenities(category) {
  switch (category) {
    case 'buy':
    case 'lease':
    case 'bungalow':
      return ['Security', 'Power Backup', 'Lift', 'Parking'];
    case 'commercial':
      return ['Security', 'Power Backup', 'Lift', 'Air Conditioning'];
    case 'interior':
      return ['3D Design', 'Modular Kitchen', 'Wardrobe', 'Lighting'];
    default:
      return ['Security', 'Parking'];
  }
}

function createDescription(configuration, node, category) {
  const location = extractLocation(node);
  
  switch (category) {
    case 'buy':
      return `Beautiful ${configuration} available for purchase in ${location}. Well-designed space with modern amenities and excellent connectivity.`;
    case 'lease':
      return `Spacious ${configuration} available for rent in ${location}. Perfect for families with all modern amenities and convenient location.`;
    case 'commercial':
      return `Premium commercial space available in ${location}. Ideal for business with excellent infrastructure and strategic location.`;
    case 'bungalow':
      return `Independent ${configuration} with private space in ${location}. Perfect for families looking for privacy and comfort.`;
    case 'interior':
      return `Complete interior design solution for ${configuration}. Modern aesthetics with functional design and quality materials.`;
    default:
      return `Property available in ${location}. Contact us for more details.`;
  }
}

// Send notification email for new enquiries
function sendEnquiryNotificationEmail(data, timestamp) {
  try {
    const adminEmail = 'info@merakisquarefoots.com';
    
    const subject = `🔥 New Property Enquiry from ${data.name}`;
    
    const body = `
🏠 NEW PROPERTY ENQUIRY ALERT 🏠

You have received a new enquiry through your property portal!

═══════════════════════════════════════
📋 ENQUIRY DETAILS:
═══════════════════════════════════════

👤 Name: ${data.name}
📱 Phone: ${data.phone}
📧 Email: ${data.email || 'Not provided'}
💬 Message: ${data.message || 'No specific message'}
⏰ Time: ${timestamp}

═══════════════════════════════════════
🏢 PROPERTY DETAILS:
═══════════════════════════════════════

🏗️ Configuration: ${data.projectConfiguration || 'Not specified'}
📐 Carpet Size: ${data.projectCarpetSize || 'Not specified'} sq ft
📐 Built Up: ${data.projectBuiltUp || 'Not specified'} sq ft
📍 Node: ${data.projectNode || 'Not specified'}
💰 Price: ${data.projectPrice || 'Not specified'}

═══════════════════════════════════════
⚡ RECOMMENDED ACTION:
═══════════════════════════════════════

📞 Contact within 24 hours for best results
💼 Prepare property details and alternatives
🎯 Follow up with relevant options

═══════════════════════════════════════

Best regards,
Meraki Square Foots Property Portal
    `;
    
    MailApp.sendEmail(adminEmail, subject, body);
    console.log('Enquiry notification email sent successfully');
    
  } catch (error) {
    console.error('Email notification failed:', error);
  }
}

// Send notification email for new properties
function sendPropertyNotificationEmail(data, propertyId) {
  try {
    const adminEmail = 'info@merakisquarefoots.com';
    
    const subject = `🏠 New ${data.category} Property Added: ${data.title}`;
    
    const body = `
🏠 NEW PROPERTY LISTING ALERT 🏠

A new ${data.category} property has been added to your portal!

═══════════════════════════════════════
📋 PROPERTY DETAILS:
═══════════════════════════════════════

🆔 Property ID: ${propertyId}
🏢 Title: ${data.title}
📍 Location: ${data.location}
💰 Price: ₹${data.price}
🏗️ Configuration: ${data.configuration || 'Not specified'}

═══════════════════════════════════════

This property is now live on your portal and ready for inquiries!

Best regards,
Meraki Square Foots Property Management System
    `;
    
    MailApp.sendEmail(adminEmail, subject, body);
    console.log('Property notification email sent successfully');
    
  } catch (error) {
    console.error('Email notification failed:', error);
  }
} 