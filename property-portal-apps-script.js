// Comprehensive Property Portal Google Apps Script
// Handles multiple property categories: Buy, Lease, Commercial, Bungalow, Interior

// Configuration for different property categories
const PROPERTY_SHEETS = {
  BUY: "Properties_Buy",
  LEASE: "Properties_Lease", 
  COMMERCIAL: "Properties_Commercial",
  BUNGALOW: "Properties_Bungalow",
  INTERIOR: "Properties_Interior"
};

// Enhanced property data structure for each category
const PROPERTY_HEADERS = {
  BUY: [
    'Property ID', 'Title', 'Location', 'Area', 'Price', 'Price Type', 'Configuration',
    'Carpet Area (sq ft)', 'Built Up Area (sq ft)', 'Bedrooms', 'Bathrooms', 'Balconies',
    'Parking', 'Furnished', 'Amenities', 'Description', 'Developer', 'Possession Date',
    'Approvals', 'Featured', 'Verified', 'Contact Name', 'Contact Phone', 'Contact Email',
    'Posted Date', 'Views', 'Likes', 'Status'
  ],
  LEASE: [
    'Property ID', 'Title', 'Location', 'Area', 'Monthly Rent', 'Security Deposit', 'Configuration',
    'Carpet Area (sq ft)', 'Built Up Area (sq ft)', 'Bedrooms', 'Bathrooms', 'Balconies',
    'Parking', 'Furnished', 'Amenities', 'Description', 'Lease Duration', 'Available From',
    'Maintenance Charges', 'Featured', 'Verified', 'Contact Name', 'Contact Phone', 'Contact Email',
    'Posted Date', 'Views', 'Likes', 'Status'
  ],
  COMMERCIAL: [
    'Property ID', 'Title', 'Location', 'Area', 'Price Per Sq Ft', 'Total Area (sq ft)',
    'Built Up Area (sq ft)', 'Floor', 'Building Type', 'Parking Spots', 'Amenities',
    'Description', 'Suitable For', 'Lease Type', 'Available From', 'Maintenance Charges',
    'Featured', 'Verified', 'Contact Name', 'Contact Phone', 'Contact Email',
    'Posted Date', 'Views', 'Likes', 'Status'
  ],
  BUNGALOW: [
    'Property ID', 'Title', 'Location', 'Area', 'Price', 'Price Type', 'Configuration',
    'Plot Area (sq ft)', 'Built Up Area (sq ft)', 'Bedrooms', 'Bathrooms', 'Floors',
    'Parking', 'Garden Area', 'Amenities', 'Description', 'Age of Property', 'Facing',
    'Gated Community', 'Featured', 'Verified', 'Contact Name', 'Contact Phone', 'Contact Email',
    'Posted Date', 'Views', 'Likes', 'Status'
  ],
  INTERIOR: [
    'Service ID', 'Service Title', 'Service Type', 'Location', 'Price Per Sq Ft', 'Min Area (sq ft)',
    'Max Area (sq ft)', 'Service Category', 'Packages Available', 'Amenities/Features',
    'Description', 'Timeline', 'Material Quality', 'Warranty', 'Previous Projects',
    'Featured', 'Verified', 'Contact Name', 'Contact Phone', 'Contact Email',
    'Posted Date', 'Views', 'Likes', 'Status'
  ]
};

// Handle GET requests - Fetch properties by category
function doGet(e) {
  try {
    const category = e.parameter.category || 'ALL';
    const limit = parseInt(e.parameter.limit) || 50;
    const offset = parseInt(e.parameter.offset) || 0;
    
    console.log(`Fetching properties for category: ${category}, limit: ${limit}, offset: ${offset}`);
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let allProperties = [];
    
    if (category === 'ALL') {
      // Fetch from all sheets
      for (const [categoryName, sheetName] of Object.entries(PROPERTY_SHEETS)) {
        const properties = getPropertiesFromSheet(ss, sheetName, categoryName.toLowerCase());
        allProperties = allProperties.concat(properties);
      }
    } else {
      // Fetch from specific category
      const sheetName = PROPERTY_SHEETS[category.toUpperCase()];
      if (sheetName) {
        allProperties = getPropertiesFromSheet(ss, sheetName, category.toLowerCase());
      }
    }
    
    // Sort by posted date (newest first)
    allProperties.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    
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

// Handle POST requests - Add new property
function doPost(e) {
  try {
    console.log('Received property submission:', e.postData.contents);
    
    const data = JSON.parse(e.postData.contents);
    
    // Validate required fields
    if (!data.category || !data.title || !data.location || !data.price) {
      throw new Error('Missing required fields: category, title, location, price');
    }
    
    const category = data.category.toUpperCase();
    const sheetName = PROPERTY_SHEETS[category];
    
    if (!sheetName) {
      throw new Error(`Invalid category: ${data.category}`);
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      setupSheetHeaders(sheet, category);
    }
    
    // Generate property ID
    const propertyId = generatePropertyId(category);
    
    // Create timestamp
    const now = new Date();
    const istTime = Utilities.formatDate(now, "Asia/Kolkata", "dd/MM/yyyy HH:mm:ss");
    
    // Prepare row data based on category
    const rowData = preparePropertyData(data, propertyId, istTime, category);
    
    // Add the row to the sheet
    sheet.appendRow(rowData);
    
    // Format the new row
    const lastRow = sheet.getLastRow();
    const range = sheet.getRange(lastRow, 1, 1, rowData.length);
    range.setBackground("#E8F4FD"); // Light blue background
    
    // Send notification email
    sendPropertyNotificationEmail(data, propertyId, istTime);
    
    console.log(`Successfully added ${category} property:`, propertyId);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Property added successfully',
      propertyId: propertyId,
      category: category
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

// Get properties from a specific sheet
function getPropertiesFromSheet(ss, sheetName, category) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    console.log(`Sheet ${sheetName} not found`);
    return [];
  }
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    return []; // No data rows
  }
  
  const headers = data[0];
  const properties = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const property = {
      id: row[0] || '',
      type: category,
      title: row[1] || '',
      location: row[2] || '',
      area: row[3] || '',
      price: row[4] || '',
      priceType: getPriceType(category),
      configuration: row[6] || '',
      carpetArea: parseFloat(row[7]) || 0,
      builtUpArea: parseFloat(row[8]) || 0,
      bedrooms: parseInt(row[9]) || 0,
      bathrooms: parseInt(row[10]) || 0,
      balconies: parseInt(row[11]) || 0,
      parking: parseInt(row[12]) || 0,
      furnished: row[13] || '',
      amenities: (row[14] || '').split(',').map(a => a.trim()).filter(a => a),
      description: row[15] || '',
      featured: row[headers.indexOf('Featured')] === 'Yes',
      verified: row[headers.indexOf('Verified')] === 'Yes',
      contact: {
        name: row[headers.indexOf('Contact Name')] || '',
        phone: row[headers.indexOf('Contact Phone')] || '',
        email: row[headers.indexOf('Contact Email')] || ''
      },
      postedDate: row[headers.indexOf('Posted Date')] || '',
      views: parseInt(row[headers.indexOf('Views')]) || 0,
      likes: parseInt(row[headers.indexOf('Likes')]) || 0,
      images: [] // Will be populated from image URLs if available
    };
    
    properties.push(property);
  }
  
  return properties;
}

// Generate unique property ID
function generatePropertyId(category) {
  const prefix = category.substring(0, 3).toUpperCase();
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}${timestamp}${random}`;
}

// Get price type based on category
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

// Prepare property data for insertion
function preparePropertyData(data, propertyId, timestamp, category) {
  const baseData = [
    propertyId,
    data.title,
    data.location,
    data.area || '',
    data.price,
    data.priceType || getPriceType(category.toLowerCase()),
    data.configuration || '',
    data.carpetArea || 0,
    data.builtUpArea || 0,
    data.bedrooms || 0,
    data.bathrooms || 0,
    data.balconies || 0,
    data.parking || 0,
    data.furnished || '',
    (data.amenities || []).join(', '),
    data.description || '',
  ];
  
  // Add category-specific fields
  switch (category) {
    case 'BUY':
      return baseData.concat([
        data.developer || '',
        data.possessionDate || '',
        (data.approvals || []).join(', '),
        data.featured ? 'Yes' : 'No',
        data.verified ? 'Yes' : 'No',
        data.contact?.name || 'Meraki Square Foots',
        data.contact?.phone || '+91 98765 43210',
        data.contact?.email || 'info@merakisquarefoots.com',
        timestamp,
        data.views || 0,
        data.likes || 0,
        'Active'
      ]);
      
    case 'LEASE':
      return baseData.concat([
        data.leaseDuration || '',
        data.availableFrom || '',
        data.maintenanceCharges || '',
        data.featured ? 'Yes' : 'No',
        data.verified ? 'Yes' : 'No',
        data.contact?.name || 'Meraki Square Foots',
        data.contact?.phone || '+91 98765 43210',
        data.contact?.email || 'info@merakisquarefoots.com',
        timestamp,
        data.views || 0,
        data.likes || 0,
        'Active'
      ]);
      
    case 'COMMERCIAL':
      return [
        propertyId,
        data.title,
        data.location,
        data.area || '',
        data.price,
        data.totalArea || 0,
        data.builtUpArea || 0,
        data.floor || '',
        data.buildingType || '',
        data.parking || 0,
        (data.amenities || []).join(', '),
        data.description || '',
        data.suitableFor || '',
        data.leaseType || '',
        data.availableFrom || '',
        data.maintenanceCharges || '',
        data.featured ? 'Yes' : 'No',
        data.verified ? 'Yes' : 'No',
        data.contact?.name || 'Meraki Square Foots',
        data.contact?.phone || '+91 98765 43210',
        data.contact?.email || 'info@merakisquarefoots.com',
        timestamp,
        data.views || 0,
        data.likes || 0,
        'Active'
      ];
      
    case 'BUNGALOW':
      return [
        propertyId,
        data.title,
        data.location,
        data.area || '',
        data.price,
        data.priceType || 'total',
        data.configuration || '',
        data.plotArea || 0,
        data.builtUpArea || 0,
        data.bedrooms || 0,
        data.bathrooms || 0,
        data.floors || 0,
        data.parking || 0,
        data.gardenArea || '',
        (data.amenities || []).join(', '),
        data.description || '',
        data.ageOfProperty || '',
        data.facing || '',
        data.gatedCommunity || '',
        data.featured ? 'Yes' : 'No',
        data.verified ? 'Yes' : 'No',
        data.contact?.name || 'Meraki Square Foots',
        data.contact?.phone || '+91 98765 43210',
        data.contact?.email || 'info@merakisquarefoots.com',
        timestamp,
        data.views || 0,
        data.likes || 0,
        'Active'
      ];
      
    case 'INTERIOR':
      return [
        propertyId,
        data.title,
        data.serviceType || '',
        data.location,
        data.price,
        data.minArea || 0,
        data.maxArea || 0,
        data.serviceCategory || '',
        data.packagesAvailable || '',
        (data.amenities || []).join(', '),
        data.description || '',
        data.timeline || '',
        data.materialQuality || '',
        data.warranty || '',
        data.previousProjects || '',
        data.featured ? 'Yes' : 'No',
        data.verified ? 'Yes' : 'No',
        data.contact?.name || 'Meraki Square Foots',
        data.contact?.phone || '+91 98765 43210',
        data.contact?.email || 'info@merakisquarefoots.com',
        timestamp,
        data.views || 0,
        data.likes || 0,
        'Active'
      ];
      
    default:
      return baseData.concat([
        data.featured ? 'Yes' : 'No',
        data.verified ? 'Yes' : 'No',
        data.contact?.name || 'Meraki Square Foots',
        data.contact?.phone || '+91 98765 43210',
        data.contact?.email || 'info@merakisquarefoots.com',
        timestamp,
        data.views || 0,
        data.likes || 0,
        'Active'
      ]);
  }
}

// Setup sheet headers for a specific category
function setupSheetHeaders(sheet, category) {
  const headers = PROPERTY_HEADERS[category];
  if (!headers) {
    throw new Error(`No headers defined for category: ${category}`);
  }
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#4A90E2"); // Blue background
  headerRange.setFontColor("#FFFFFF"); // White text
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(11);
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, headers.length);
  
  console.log(`Headers set up for ${category} sheet`);
}

// Send notification email for new property
function sendPropertyNotificationEmail(data, propertyId, timestamp) {
  try {
    const adminEmail = 'info@merakisquarefoots.com';
    
    const subject = `🏠 New ${data.category} Property Listed: ${data.title}`;
    
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
🏗️ Configuration: ${data.configuration}
📐 Carpet Area: ${data.carpetArea} sq ft
📐 Built Up Area: ${data.builtUpArea} sq ft
🛏️ Bedrooms: ${data.bedrooms || 'N/A'}
🛁 Bathrooms: ${data.bathrooms || 'N/A'}
🚗 Parking: ${data.parking || 'N/A'}
🪑 Furnished: ${data.furnished || 'N/A'}
🎯 Amenities: ${(data.amenities || []).join(', ')}
📝 Description: ${data.description || 'N/A'}
⏰ Posted: ${timestamp}

═══════════════════════════════════════
📞 CONTACT INFORMATION:
═══════════════════════════════════════

👤 Name: ${data.contact?.name || 'Meraki Square Foots'}
📱 Phone: ${data.contact?.phone || '+91 98765 43210'}
📧 Email: ${data.contact?.email || 'info@merakisquarefoots.com'}

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

// Initialize all property sheets (run this once manually)
function initializeAllPropertySheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  for (const [category, sheetName] of Object.entries(PROPERTY_SHEETS)) {
    let sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      console.log(`Created new sheet: ${sheetName}`);
    }
    
    setupSheetHeaders(sheet, category);
    console.log(`Headers set up for ${category} sheet`);
  }
  
  console.log('All property sheets initialized successfully');
  return 'Property portal setup complete!';
}

// Update property views/likes (for analytics)
function updatePropertyStats(propertyId, category, field, increment = 1) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = PROPERTY_SHEETS[category.toUpperCase()];
    const sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      throw new Error(`Sheet ${sheetName} not found`);
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const fieldIndex = headers.indexOf(field);
    
    if (fieldIndex === -1) {
      throw new Error(`Field ${field} not found in headers`);
    }
    
    // Find the property row
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === propertyId) {
        const currentValue = parseInt(data[i][fieldIndex]) || 0;
        const newValue = currentValue + increment;
        
        sheet.getRange(i + 1, fieldIndex + 1).setValue(newValue);
        
        console.log(`Updated ${field} for property ${propertyId}: ${currentValue} -> ${newValue}`);
        return newValue;
      }
    }
    
    throw new Error(`Property ${propertyId} not found`);
    
  } catch (error) {
    console.error('Error updating property stats:', error);
    throw error;
  }
} 