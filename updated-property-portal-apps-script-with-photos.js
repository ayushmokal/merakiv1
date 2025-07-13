// Updated Google Apps Script for Property Portal with Photos Support
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
        property.area.toLowerCase().includes(search.toLowerCase()) ||
        property.configuration.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply location filter
    if (location) {
      allProperties = allProperties.filter(property =>
        property.location.toLowerCase().includes(location.toLowerCase()) ||
        property.area.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    // Sort by featured first, then by id
    allProperties.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return parseInt(a.id) - parseInt(b.id);
    });
    
    // Apply pagination
    const total = allProperties.length;
    const paginatedProperties = allProperties.slice(offset, offset + limit);
    
    const response = {
      status: 'success',
      data: paginatedProperties,
      total: total,
      category: category,
      limit: limit,
      offset: offset,
      pagination: {
        hasMore: offset + limit < total,
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(total / limit)
      }
    };
    
    return ContentService.createTextOutput(JSON.stringify(response))
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

// Handle POST requests - Create enquiry or add property
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.type === 'enquiry') {
      return handleEnquiry(data);
    } else if (data.type === 'property') {
      return handleNewProperty(data);
    } else if (data.type === 'updateStats') {
      return handleUpdateStats(data);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Unknown request type'
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

// Handle enquiry submission
function handleEnquiry(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const enquirySheet = ss.getSheetByName(PROPERTY_SHEETS.ENQUIRIES);
    
    if (!enquirySheet) {
      throw new Error('Enquiry sheet not found');
    }
    
    const timestamp = new Date().toISOString();
    const newRow = [
      timestamp,
      data.name,
      data.phone,
      data.email,
      data.message || '',
      data.propertyId || '',
      data.propertyTitle || '',
      data.location || '',
      data.price || '',
      'New' // Status
    ];
    
    enquirySheet.appendRow(newRow);
    
    // Send notification email (optional)
    sendEnquiryNotificationEmail(data, timestamp);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Enquiry submitted successfully'
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error in handleEnquiry:', error);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle new property submission
function handleNewProperty(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const categorySheet = ss.getSheetByName(PROPERTY_SHEETS[data.category.toUpperCase()]);
    
    if (!categorySheet) {
      throw new Error(`Category sheet ${data.category} not found`);
    }
    
    const lastRow = categorySheet.getLastRow();
    const newId = (lastRow).toString();
    
    const newRow = [
      newId,
      data.configuration,
      data.carpetArea,
      data.builtUpArea,
      data.node,
      data.price,
      data.photos || '' // Photos column
    ];
    
    categorySheet.appendRow(newRow);
    
    // Send notification email (optional)
    sendPropertyNotificationEmail(data, newId);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Property added successfully',
      propertyId: newId
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error in handleNewProperty:', error);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle stats update
function handleUpdateStats(data) {
  try {
    // This would be used for updating view counts, likes, etc.
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Stats updated successfully'
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error in handleUpdateStats:', error);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

// Get properties from specific sheet
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
  const data = sheet.getRange(2, 1, lastRow - 1, 7).getValues(); // Get 7 columns (A-G) including Photos
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
        images: processPhotoUrls(row[6] || '') // Process Photos column (column G)
      };
      
      properties.push(property);
    }
  }
  
  return properties;
}

// Process photo URLs from Google Sheets
function processPhotoUrls(photoString) {
  if (!photoString || photoString.toString().trim() === '') {
    return [];
  }
  
  const photoUrls = [];
  const urls = photoString.toString().split(',').map(url => url.trim());
  
  for (const url of urls) {
    if (url && url.includes('drive.google.com')) {
      // Convert Google Drive share URL to direct image URL
      const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        const fileId = fileIdMatch[1];
        const directUrl = `https://drive.google.com/uc?id=${fileId}`;
        photoUrls.push(directUrl);
      }
    } else if (url && url.startsWith('http')) {
      // Direct URL, use as is
      photoUrls.push(url);
    }
  }
  
  return photoUrls;
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
      return `${configuration} Available`;
  }
}

function extractLocation(node) {
  if (!node) return 'Navi Mumbai';
  
  const nodeStr = node.toString().toLowerCase();
  if (nodeStr.includes('kharghar')) return 'Kharghar, Navi Mumbai';
  if (nodeStr.includes('panvel')) return 'Panvel, Navi Mumbai';
  if (nodeStr.includes('ulwe')) return 'Ulwe, Navi Mumbai';
  if (nodeStr.includes('kamothe')) return 'Kamothe, Navi Mumbai';
  if (nodeStr.includes('nerul')) return 'Nerul, Navi Mumbai';
  if (nodeStr.includes('vashi')) return 'Vashi, Navi Mumbai';
  if (nodeStr.includes('belapur')) return 'Belapur, Navi Mumbai';
  if (nodeStr.includes('dronagiri')) return 'Dronagiri, Navi Mumbai';
  if (nodeStr.includes('taloja')) return 'Taloja, Navi Mumbai';
  if (nodeStr.includes('kalamboli')) return 'Kalamboli, Navi Mumbai';
  
  return `${node}, Navi Mumbai`;
}

function extractBedrooms(configuration) {
  if (!configuration) return 0;
  
  const config = configuration.toString().toLowerCase();
  if (config.includes('1 bhk') || config.includes('1bhk')) return 1;
  if (config.includes('2 bhk') || config.includes('2bhk')) return 2;
  if (config.includes('3 bhk') || config.includes('3bhk')) return 3;
  if (config.includes('4 bhk') || config.includes('4bhk')) return 4;
  if (config.includes('5 bhk') || config.includes('5bhk')) return 5;
  if (config.includes('studio') || config.includes('1 rk')) return 0;
  
  return 1; // Default
}

function extractBathrooms(configuration) {
  const bedrooms = extractBedrooms(configuration);
  return bedrooms === 0 ? 1 : bedrooms; // Studio has 1 bathroom, others match bedrooms
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
    case 'interior':
      return 'Semi-Furnished';
    case 'commercial':
      return 'Unfurnished';
    default:
      return 'Semi-Furnished';
  }
}

function getDefaultAmenities(category) {
  switch (category) {
    case 'interior':
      return ['3D Design', 'Modular Kitchen', 'Wardrobe', 'Lighting'];
    case 'commercial':
      return ['Power Backup', 'Lift', 'Parking', 'Security'];
    default:
      return ['Security', 'Power Backup', 'Lift', 'Parking'];
  }
}

function createDescription(configuration, node, category) {
  const baseDescription = {
    'buy': `Beautiful ${configuration} available for purchase in ${node}, Navi Mumbai. Well-designed space with modern amenities and excellent connectivity.`,
    'lease': `Spacious ${configuration} available for rent in ${node}, Navi Mumbai. Perfect for families with all modern amenities and convenient location.`,
    'commercial': `Premium commercial space available in ${node}, Navi Mumbai. Ideal for business with excellent infrastructure and strategic location.`,
    'bungalow': `Independent ${configuration} with private space in ${node}, Navi Mumbai. Perfect for families looking for privacy and comfort.`,
    'interior': `Complete interior design solution for ${configuration}. Modern aesthetics with functional design and quality materials.`
  };
  
  return baseDescription[category] || `Property available in ${node}, Navi Mumbai.`;
}

function sendEnquiryNotificationEmail(data, timestamp) {
  try {
    const subject = `New Property Enquiry - ${data.propertyTitle}`;
    const body = `
      New enquiry received at ${timestamp}
      
      Property: ${data.propertyTitle}
      Location: ${data.location}
      Price: ${data.price}
      
      Customer Details:
      Name: ${data.name}
      Phone: ${data.phone}
      Email: ${data.email}
      Message: ${data.message || 'No message provided'}
      
      Please follow up with the customer.
    `;
    
    // Replace with your email
    const emailAddress = 'info@merakisquarefoots.com';
    
    // Uncomment to send email
    // MailApp.sendEmail(emailAddress, subject, body);
    
    console.log('Notification email prepared for:', emailAddress);
    
  } catch (error) {
    console.error('Error sending notification email:', error);
  }
}

function sendPropertyNotificationEmail(data, propertyId) {
  try {
    const subject = `New Property Added - ${data.configuration}`;
    const body = `
      New property added with ID: ${propertyId}
      
      Category: ${data.category}
      Configuration: ${data.configuration}
      Location: ${data.node}
      Price: ${data.price}
      Carpet Area: ${data.carpetArea}
      Built Up Area: ${data.builtUpArea}
      
      The property is now live on the portal.
    `;
    
    // Replace with your email
    const emailAddress = 'info@merakisquarefoots.com';
    
    // Uncomment to send email
    // MailApp.sendEmail(emailAddress, subject, body);
    
    console.log('Property notification email prepared for:', emailAddress);
    
  } catch (error) {
    console.error('Error sending property notification email:', error);
  }
} 