// Comprehensive Google Apps Script for Property Portal
// Handles multiple sheet structures: Commercial Projects, Residential Projects, Bungalow Projects
// Supports different column layouts and property types

// Configuration for sheet names and their structures
const PROPERTY_SHEETS = {
  COMMERCIAL: {
    name: "Commercial Projects",
    columns: {
      srNo: 0,        // A: S R NO
      config: 1,      // B: Configuration  
      carpetSize: 2,  // C: Carpet Size
      builtUp: 3,     // D: Built up
      node: 4,        // E: Node
      price: 5,       // F: Price
      buyLease: 6,    // G: BUY/Lease
      photos: 7       // H: Photos
    }
  },
  RESIDENTIAL: {
    name: "Residential Projects", 
    columns: {
      srNo: 0,        // A: S R NO
      config: 1,      // B: Configuration
      carpetSize: 2,  // C: Carpet Size  
      builtUp: 3,     // D: Built up
      node: 4,        // E: Node
      price: 5,       // F: Price
      buyLease: 6,    // G: BUY/Lease
      photos: 7       // H: Photos
    }
  },
  BUNGALOW: {
    name: "Bungalow Projects",
    columns: {
      srNo: 0,        // A: S R NO
      config: 1,      // B: Configuration
      carpetSize: 2,  // C: Carpet Size
      builtUp: 3,     // D: Built up  
      node: 4,        // E: Node
      price: 5,       // F: Price
      photos: 6       // G: Photos (no BUY/Lease column)
    }
  },
  ENQUIRIES: "Enquiries"
};

// Handle OPTIONS requests for CORS
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON);
}

// Main GET handler - fetch properties with filtering
function doGet(e) {
  try {
    const category = e.parameter.category || 'ALL';
    const transactionType = e.parameter.transactionType || 'ALL';
    const limit = parseInt(e.parameter.limit) || 50;
    const offset = parseInt(e.parameter.offset) || 0;
    const search = e.parameter.search || '';
    const location = e.parameter.location || '';
    
    console.log(`Fetching properties - Category: ${category}, Transaction: ${transactionType}`);
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let allProperties = [];
    
    if (category === 'ALL') {
      // Fetch from all sheets
      for (const [sheetKey, sheetConfig] of Object.entries(PROPERTY_SHEETS)) {
        if (sheetKey !== 'ENQUIRIES') {
          const properties = getPropertiesFromSheet(ss, sheetConfig, sheetKey.toLowerCase(), transactionType);
          allProperties = allProperties.concat(properties);
        }
      }
    } else {
      // Fetch from specific category
      const sheetConfig = PROPERTY_SHEETS[category.toUpperCase()];
      if (sheetConfig) {
        allProperties = getPropertiesFromSheet(ss, sheetConfig, category.toLowerCase(), transactionType);
      }
    }
    
    // Apply search filter
    if (search) {
      allProperties = allProperties.filter(property =>
        (property.title && property.title.toLowerCase().includes(search.toLowerCase())) ||
        (property.location && property.location.toLowerCase().includes(search.toLowerCase())) ||
        (property.area && property.area.toLowerCase().includes(search.toLowerCase())) ||
        (property.configuration && property.configuration.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    // Apply location filter
    if (location) {
      allProperties = allProperties.filter(property =>
        (property.location && property.location.toLowerCase().includes(location.toLowerCase())) ||
        (property.area && property.area.toLowerCase().includes(location.toLowerCase()))
      );
    }
    
    // Sort by featured first, then by ID
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
      message: error.toString(),
      details: 'Check sheet names and column structure'
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

// Get properties from a specific sheet
function getPropertiesFromSheet(ss, sheetConfig, categoryType, transactionType = 'ALL') {
  try {
    const sheet = ss.getSheetByName(sheetConfig.name);
    if (!sheet) {
      console.log(`Sheet ${sheetConfig.name} not found`);
      return [];
    }
    
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      console.log(`No data in sheet ${sheetConfig.name}`);
      return [];
    }
    
    // Determine number of columns based on sheet structure
    const maxCol = Math.max(...Object.values(sheetConfig.columns)) + 1;
    const data = sheet.getRange(2, 1, lastRow - 1, maxCol).getValues();
    const properties = [];
    
    console.log(`Processing ${data.length} rows from ${sheetConfig.name}`);
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const cols = sheetConfig.columns;
      
      // Skip empty rows
      if (!row[cols.srNo] || row[cols.srNo].toString().trim() === '') {
        continue;
      }
      
      // Get transaction type (if column exists)
      let rowTransactionType = 'buy'; // default for sheets without BUY/Lease column
      if (cols.buyLease !== undefined) {
        const cellValue = (row[cols.buyLease] || '').toString().toLowerCase().trim();
        rowTransactionType = cellValue;
      }
      
      // Fix filtering logic - when transactionType is ALL, include all properties
      if (transactionType !== 'ALL') {
        // Only filter when specific transaction type is requested
        if (transactionType.toLowerCase() === 'buy') {
          if (!rowTransactionType.includes('buy') && !rowTransactionType.includes('sale')) {
            continue;
          }
        } else if (transactionType.toLowerCase() === 'lease') {
          if (!rowTransactionType.includes('lease') && !rowTransactionType.includes('rent')) {
            continue;
          }
        }
      }
      
      // Extract property data
      const srNo = row[cols.srNo].toString();
      const configuration = row[cols.config] || '';
      const carpetSize = parseFloat(row[cols.carpetSize]) || 0;
      const builtUp = parseFloat(row[cols.builtUp]) || 0;
      const node = row[cols.node] || '';
      const price = row[cols.price] || '';
      const photos = row[cols.photos] || '';
      
      // Create property object
      const property = {
        id: srNo,
        type: categoryType,
        transactionType: determineTransactionType(rowTransactionType),
        title: createPropertyTitle(configuration, categoryType, rowTransactionType),
        location: extractLocation(node),
        area: node,
        price: formatPrice(price),
        priceType: getPriceType(rowTransactionType, price),
        configuration: configuration,
        carpetArea: carpetSize,
        builtUpArea: builtUp,
        bedrooms: extractBedrooms(configuration),
        bathrooms: extractBathrooms(configuration),
        balconies: 1,
        parking: 1,
        furnished: getDefaultFurnished(categoryType),
        amenities: getDefaultAmenities(categoryType),
        description: createDescription(configuration, node, categoryType, rowTransactionType),
        featured: i < 3, // First 3 properties are featured
        verified: true,
        contact: {
          name: 'Meraki Square Foots',
          phone: '+91 98765 43210',
          email: 'info@merakisquarefoots.com'
        },
        postedDate: new Date().toISOString().split('T')[0],
        views: Math.floor(Math.random() * 200) + 50,
        likes: Math.floor(Math.random() * 30) + 5,
        images: processPhotoUrls(photos)
      };
      
      properties.push(property);
    }
    
    console.log(`Processed ${properties.length} properties from ${sheetConfig.name}`);
    return properties;
    
  } catch (error) {
    console.error(`Error processing sheet ${sheetConfig.name}:`, error);
    return [];
  }
}

// Process photo URLs from different formats
function processPhotoUrls(photoString) {
  if (!photoString || photoString.toString().trim() === '') {
    return [];
  }
  
  const photoUrls = [];
  const urls = photoString.toString().split(',').map(url => url.trim());
  
  for (const url of urls) {
    if (url && url.length > 0) {
      if (url.includes('res.cloudinary.com') || url.includes('cloudinary.com')) {
        // Cloudinary URL - use as is
        photoUrls.push(url);
      } else if (url.includes('drive.google.com')) {
        // Google Drive URL - convert to direct link
        let fileId = null;
        if (url.includes('/file/d/')) {
          const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
          if (fileIdMatch && fileIdMatch[1]) {
            fileId = fileIdMatch[1];
          }
        }
        if (fileId) {
          photoUrls.push(`https://drive.google.com/uc?id=${fileId}`);
        }
      } else if (url.startsWith('http')) {
        // Other direct URL
        photoUrls.push(url);
      }
    }
  }
  
  return photoUrls;
}

// Helper functions
function createPropertyTitle(configuration, category, transactionType) {
  if (!configuration) return 'Property Available';
  
  const txnType = transactionType.includes('buy') ? 'sale' : 
                 transactionType.includes('lease') ? 'lease' : 'sale';
  
  switch (category) {
    case 'residential':
      return `${configuration} for ${txnType}`;
    case 'commercial':
      return `Commercial ${configuration} for ${txnType}`;
    case 'bungalow':
      return `${configuration} for ${txnType}`;
    default:
      return `${configuration} for ${txnType}`;
  }
}

function extractLocation(node) {
  if (!node) return 'Navi Mumbai';
  
  const nodeStr = node.toString().toLowerCase();
  
  // Handle different location formats
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
  if (nodeStr.includes('seawoods')) return 'Seawoods, Navi Mumbai';
  
  return `${node}, Navi Mumbai`;
}

function determineTransactionType(rowTransactionType) {
  if (!rowTransactionType || rowTransactionType.trim() === '') {
    return 'buy'; // default
  }
  
  const type = rowTransactionType.toLowerCase();
  if (type.includes('lease') || type.includes('rent')) {
    return 'lease';
  }
  if (type.includes('buy') || type.includes('sale') || type.includes('sell')) {
    return 'buy';
  }
  
  return 'buy'; // default fallback
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
  if (config.includes('shop') || config.includes('office')) return 0;
  
  return 1; // Default
}

function extractBathrooms(configuration) {
  const bedrooms = extractBedrooms(configuration);
  if (bedrooms === 0) return 1; // Studio/commercial has 1
  return bedrooms; // Residential matches bedrooms
}

function formatPrice(price) {
  if (!price) return '0';
  
  const priceStr = price.toString();
  
  // If already formatted, return as is
  if (priceStr.includes('₹') || priceStr.includes('Cr') || priceStr.includes('L')) {
    return priceStr;
  }
  
  // Try to parse and format
  const numPrice = parseFloat(priceStr);
  if (isNaN(numPrice)) return priceStr;
  
  if (numPrice >= 10000000) {
    return `${(numPrice / 10000000).toFixed(2)} Cr`;
  } else if (numPrice >= 100000) {
    return `${(numPrice / 100000).toFixed(0)} L`;
  } else {
    return `${numPrice}K`;
  }
}

function getPriceType(transactionType, price) {
  if (transactionType.includes('lease') || transactionType.includes('rent')) {
    return 'per_month';
  }
  
  // Check if price contains "per sq ft" indicator
  if (price && price.toString().toLowerCase().includes('sq ft')) {
    return 'per_sqft';
  }
  
  return 'total';
}

function getDefaultFurnished(category) {
  switch (category) {
    case 'commercial':
      return 'Unfurnished';
    default:
      return 'Semi-Furnished';
  }
}

function getDefaultAmenities(category) {
  switch (category) {
    case 'commercial':
      return ['Power Backup', 'Lift', 'Parking', 'Security'];
    case 'bungalow':
      return ['Garden', 'Parking', 'Security', 'Independent'];
    default:
      return ['Security', 'Power Backup', 'Lift', 'Parking'];
  }
}

function createDescription(configuration, node, category, transactionType) {
  const txnType = transactionType.includes('buy') ? 'purchase' : 
                 transactionType.includes('lease') ? 'rent' : 'purchase';
  
  const baseDescription = {
    'residential': `Beautiful ${configuration} available for ${txnType} in ${node}, Navi Mumbai. Well-designed space with modern amenities and excellent connectivity.`,
    'commercial': `Premium commercial ${configuration} available for ${txnType} in ${node}, Navi Mumbai. Ideal for business with excellent infrastructure and strategic location.`,
    'bungalow': `${configuration} with private space available for ${txnType} in ${node}, Navi Mumbai. Perfect for families looking for privacy and comfort.`
  };
  
  return baseDescription[category] || `Property available for ${txnType} in ${node}, Navi Mumbai.`;
}

// Handle POST requests for enquiries and new properties
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.type === 'enquiry') {
      return handleEnquiry(data);
    } else if (data.type === 'property') {
      return handleNewProperty(data);
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

function handleEnquiry(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let enquirySheet = ss.getSheetByName(PROPERTY_SHEETS.ENQUIRIES);
    
    if (!enquirySheet) {
      enquirySheet = ss.insertSheet(PROPERTY_SHEETS.ENQUIRIES);
      enquirySheet.getRange(1, 1, 1, 10).setValues([[
        'Timestamp', 'Name', 'Phone', 'Email', 'Message', 'Property ID', 'Property Title', 'Location', 'Price', 'Status'
      ]]);
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
      'New'
    ];
    
    enquirySheet.appendRow(newRow);
    
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

function handleNewProperty(data) {
  // Implementation for adding new properties
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Property submission feature coming soon'
  }))
  .setMimeType(ContentService.MimeType.JSON);
}