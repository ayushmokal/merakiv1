# 🏠 Meraki Square Foots - Property Portal Setup Guide

## Overview

This comprehensive property portal allows you to manage multiple property categories with advanced search, filtering, and Google Sheets integration. The system supports **Buy**, **Lease**, **Commercial**, **Bungalow**, and **Interior** properties with dedicated data structures for each category.

## 🎯 Features

### ✅ **Property Management**
- **5 Property Categories**: Buy, Lease, Commercial, Bungalow, Interior
- **Advanced Search & Filtering**: Location, price range, bedrooms, amenities, etc.
- **Property Analytics**: Views, likes, and engagement tracking
- **Verified & Featured Properties**: Special badges for premium listings
- **Responsive Design**: Works on desktop, tablet, and mobile

### ✅ **Google Sheets Integration**
- **Separate Sheets** for each property category
- **Real-time Data Sync** between website and Google Sheets
- **Email Notifications** for new property listings
- **Automated Property IDs** with category prefixes
- **Analytics Tracking** for property performance

### ✅ **User Experience**
- **Modern Property Cards** with detailed information
- **Interactive Filters** with real-time updates
- **Like & Share** functionality for properties
- **Contact Integration** with existing enquiry system
- **Pagination & Load More** for large property lists

---

## 📊 Google Sheets Setup

### Step 1: Create Google Sheets Structure

Create a new Google Spreadsheet with the following sheets:

1. **Properties_Buy** - For purchase properties
2. **Properties_Lease** - For rental properties  
3. **Properties_Commercial** - For commercial spaces
4. **Properties_Bungalow** - For independent houses/villas
5. **Properties_Interior** - For interior design services

### Step 2: Set Up Google Apps Script

1. **Open Google Apps Script**: Go to [script.google.com](https://script.google.com)
2. **Create New Project**: Click "New Project"
3. **Copy the Script**: Copy the entire contents of `property-portal-apps-script.js` into the script editor
4. **Save the Project**: Give it a name like "Property Portal API"

### Step 3: Deploy the Script

1. **Deploy as Web App**:
   - Click "Deploy" > "New Deployment"
   - Choose "Web app" as the type
   - Set execute as "Me"
   - Set access to "Anyone"
   - Click "Deploy"

2. **Copy the URL**: Save the deployment URL (looks like: `https://script.google.com/macros/s/AKfycbxxx.../exec`)

3. **Initialize Sheets**: Run the `initializeAllPropertySheets()` function once to create all sheet headers

### Step 4: Update API Configuration

In `/app/api/properties/route.ts`, update:
```typescript
const PROPERTIES_API_URL = "YOUR_ACTUAL_DEPLOYMENT_URL_HERE";
```

---

## 🏗️ Property Data Structure

### **Buy Properties**
- Property ID, Title, Location, Area, Price, Configuration
- Bedrooms, Bathrooms, Carpet Area, Built Up Area
- Developer, Possession Date, Approvals
- Amenities, Parking, Furnished Status

### **Lease Properties**  
- Monthly Rent, Security Deposit, Lease Duration
- Available From, Maintenance Charges
- Furnished Status, Amenities

### **Commercial Properties**
- Price Per Sq Ft, Floor, Building Type
- Suitable For, Lease Type, Maintenance Charges
- Parking Spots, Business Amenities

### **Bungalow Properties**
- Plot Area, Garden Area, Floors, Facing
- Age of Property, Gated Community
- Independent Features, Private Amenities

### **Interior Services**
- Service Type, Price Per Sq Ft, Timeline
- Material Quality, Warranty, Packages
- Previous Projects, Service Categories

---

## 🔧 Configuration Options

### **Property Categories**
Each category has specific fields tailored to its requirements:

```javascript
const PROPERTY_SHEETS = {
  BUY: "Properties_Buy",
  LEASE: "Properties_Lease", 
  COMMERCIAL: "Properties_Commercial",
  BUNGALOW: "Properties_Bungalow",
  INTERIOR: "Properties_Interior"
};
```

### **Search & Filter Options**
- **Search**: Title, location, area, description
- **Price Range**: Adjustable slider with min/max values
- **Bedrooms**: 1, 2, 3, 4, 5+ options
- **Amenities**: Gym, Swimming Pool, Security, etc.
- **Property Features**: Verified, Featured properties
- **Location**: Dropdown with Mumbai/Navi Mumbai areas

### **Analytics Tracking**
- **Views**: Tracked when users click "Contact"
- **Likes**: Tracked when users like properties
- **Engagement**: Stored in Google Sheets for reporting

---

## 📱 Usage Instructions

### **For Property Visitors**

1. **Browse Properties**: Visit `/projects` to see all properties
2. **Filter by Category**: Use the top tabs (Buy, Lease, Commercial, etc.)
3. **Search & Filter**: Use the search bar and left sidebar filters
4. **View Details**: Click on property cards to see more information
5. **Contact**: Click "Contact" button to enquire about properties
6. **Like Properties**: Click heart icon to save favorites

### **For Property Managers**

1. **Add Properties**: Use the "Post a Property" button (to be implemented)
2. **Manage via Sheets**: Edit properties directly in Google Sheets
3. **View Analytics**: Check views/likes columns in sheets
4. **Email Notifications**: Get alerts for new property enquiries
5. **Bulk Operations**: Use Google Sheets for bulk updates

### **For Developers**

1. **API Endpoints**: 
   - `GET /api/properties` - Fetch properties
   - `POST /api/properties` - Add new properties/enquiries
   - `PATCH /api/properties` - Update analytics

2. **Property Interface**: Comprehensive TypeScript interfaces for all categories

3. **Filtering Logic**: Server-side and client-side filtering capabilities

---

## 🎨 Customization Options

### **Styling**
- **Colors**: Update primary colors in `tailwind.config.ts`
- **Fonts**: Modify fonts in `layout.tsx`
- **Layout**: Adjust card layouts in property components

### **Locations**
Update the locations array in `app/projects/page.tsx`:
```typescript
const locations = [
  'Kharghar', 'Vashi', 'Belapur', 'Panvel', 'Nerul', 'Airoli'
];
```

### **Amenities**
Update the amenities list:
```typescript
const amenitiesList = [
  'Gym', 'Swimming Pool', 'Security', 'Power Backup', 'Lift'
];
```

### **Property Types**
Add new property types by updating the `propertyTypes` array and adding corresponding sheets.

---

## 📊 Analytics & Reporting

### **Built-in Analytics**
- **Property Views**: Track how many times each property is viewed
- **Property Likes**: Track user engagement and favorites
- **Search Patterns**: Monitor popular search terms and filters
- **Category Performance**: See which property types are most popular

### **Google Sheets Reports**
- **Views Column**: Shows total views for each property
- **Likes Column**: Shows total likes for each property
- **Posted Date**: Track when properties were added
- **Status Column**: Active/Inactive property management

### **Email Notifications**
- **New Property Alerts**: Get notified when properties are added
- **Enquiry Notifications**: Receive enquiries via the existing system
- **Analytics Summaries**: Weekly/monthly performance reports

---

## 🚀 Next Steps

### **Phase 1: Basic Setup** ✅
- [x] Create comprehensive property portal
- [x] Implement Google Sheets integration
- [x] Add search and filtering capabilities
- [x] Set up analytics tracking

### **Phase 2: Advanced Features** 🔄
- [ ] Add property image upload functionality
- [ ] Implement "Post a Property" form
- [ ] Add property comparison feature
- [ ] Create property detail pages
- [ ] Add map integration for locations

### **Phase 3: Business Features** 📋
- [ ] Add property management dashboard
- [ ] Implement user authentication
- [ ] Add property booking/scheduling
- [ ] Create analytics dashboard
- [ ] Add CRM integration

---

## 📞 Support

For technical support or questions about the property portal:

**Email**: info@merakisquarefoots.com  
**Phone**: +91 98765 43210  
**Website**: [Your Website URL]

---

## 🔧 Technical Notes

### **Performance Optimization**
- **Lazy Loading**: Properties load in batches of 12
- **Client-side Filtering**: Fast filtering for price/amenities
- **Server-side Search**: Efficient search via Google Sheets
- **Image Optimization**: Placeholder images with lazy loading

### **Security**
- **Input Validation**: All inputs validated on server-side
- **CORS Handling**: Proper cross-origin request handling
- **Data Sanitization**: Clean data before storing in sheets

### **Compatibility**
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Mobile Responsive**: Works on all device sizes
- **API Compatibility**: RESTful API design for easy integration

---

*Last Updated: January 2024*  
*Version: 1.0.0* 