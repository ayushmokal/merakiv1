# Property Submission Setup Guide

This guide will help you set up the "Post a Property" functionality that connects to Google Sheets.

## Google Sheet Format

Your Google Sheet should have the following columns (the Apps Script will create these automatically):

| Column | Description | Example |
|--------|-------------|---------|
| Timestamp | When the property was submitted | 2025-07-28 14:30:00 |
| Property Type | Type of property | Residential Apartment |
| Listing Type | Sale/Rent/Lease | Sale |
| Title | Property title | Spacious 2BHK in Bandra |
| Description | Property description | Well-ventilated apartment with sea view |
| Location | Area/Locality | Bandra West |
| Area | Specific area details | Near Metro Station |
| Price | Property price | 5000000 |
| Price Type | total/per_sqft/per_month | total |
| Configuration | BHK configuration | 2 BHK |
| Carpet Area (sq ft) | Carpet area | 850 |
| Built-up Area (sq ft) | Built-up area | 1000 |
| Bedrooms | Number of bedrooms | 2 |
| Bathrooms | Number of bathrooms | 2 |
| Balconies | Number of balconies | 1 |
| Parking | Parking spaces | 1 |
| Furnished | Furnishing status | Semi-Furnished |
| Amenities | List of amenities | Swimming Pool, Gym, Security |
| Contact Name | Owner/Agent name | John Doe |
| Contact Phone | Phone number | +91 9876543210 |
| Contact Email | Email address | john@example.com |
| Additional Notes | Extra information | Available immediately |
| Status | Lead status | New |
| Follow-up Date | Next follow-up | 2025-08-01 |
| Agent Assigned | Assigned agent | Agent Name |

## Setup Instructions

### Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Property Portal - Submissions" or any name you prefer
4. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)
   - Example: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
   - Sheet ID: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

### Step 2: Deploy Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the code from `property-portal-google-apps-script.js`
4. Update the configuration at the top:
   ```javascript
   const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE'; // Replace with your Sheet ID
   const SHEET_NAME = 'Property Submissions';
   const NOTIFICATION_EMAIL = 'your-email@example.com'; // Replace with your email
   ```
5. Save the project (Ctrl+S) and name it "Property Portal Handler"
6. Click "Deploy" → "New deployment"
7. Choose type: "Web app"
8. Set execute as: "Me"
9. Set access: "Anyone" (this allows your website to send data)
10. Click "Deploy"
11. Copy the deployment URL (this is your `GOOGLE_APPS_SCRIPT_URL`)

### Step 3: Test the Setup

1. In Google Apps Script, run the `testSetup()` function:
   - Click on the function dropdown and select `testSetup`
   - Click the "Run" button
   - Authorize the script when prompted
   - Check the execution log for success message
2. Verify that your Google Sheet now has headers and a test row

### Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Edit `.env.local` and replace `YOUR_SCRIPT_ID` with your actual deployment URL:
   ```
   GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec
   ```

### Step 5: Test the Integration

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```
2. Go to the Projects page (`/projects`)
3. Click the "Post a Property" button
4. Fill out the form and submit
5. Check your Google Sheet for the new entry
6. Check your email for the notification (if configured)

## Form Fields and Validation

The form includes the following fields:

### Required Fields (marked with *)
- Property Type*
- Listing Type*
- Property Title*
- Location*
- Price*
- Contact Name*
- Contact Phone*

### Optional Fields
- Description
- Area/Locality
- Price Type (defaults to "Total")
- Configuration (BHK)
- Carpet Area
- Built-up Area
- Bedrooms, Bathrooms, Balconies, Parking
- Furnished status
- Amenities (multiple selection)
- Contact Email
- Additional Notes

### Data Validation
- Phone numbers: 10-15 digits with basic formatting
- Email: Standard email format validation
- Required fields: Cannot be empty
- Price: Numeric values only

## Customization Options

### Adding New Property Types
Edit the `propertyTypes` array in `PropertyPostModal.tsx`:
```javascript
const propertyTypes = [
  'Residential Apartment',
  'Independent House',
  'Your New Type', // Add here
  // ... existing types
];
```

### Adding New Locations
Edit the `mumbaiLocations` array in `PropertyPostModal.tsx`:
```javascript
const mumbaiLocations = [
  'Existing Location',
  'Your New Location', // Add here
  // ... existing locations
];
```

### Adding New Amenities
Edit the `amenitiesList` array in `PropertyPostModal.tsx`:
```javascript
const amenitiesList = [
  'Existing Amenity',
  'Your New Amenity', // Add here
  // ... existing amenities
];
```

### Modifying Email Notifications
Edit the `sendEmailNotification` function in the Google Apps Script:
- Change email template
- Add CC/BCC recipients
- Modify subject line format
- Add attachments

## Troubleshooting

### Common Issues

1. **Form submission fails with "Service configuration error"**
   - Check that `GOOGLE_APPS_SCRIPT_URL` is correctly set in `.env.local`
   - Ensure the Google Apps Script is deployed as a web app
   - Verify the deployment URL is accessible

2. **Data not appearing in Google Sheet**
   - Check Google Apps Script execution logs
   - Verify Sheet ID is correct
   - Ensure the script has necessary permissions

3. **Email notifications not working**
   - Verify the email address in the script
   - Check Google Apps Script execution logs
   - Ensure Gmail API permissions are granted

4. **Form validation errors**
   - Check required fields are filled
   - Verify phone number format (10-15 digits)
   - Check email format if provided

### Debugging

1. **Check Google Apps Script Logs**:
   - Go to Google Apps Script editor
   - Click "Executions" in the left sidebar
   - View recent execution logs

2. **Check Browser Console**:
   - Open browser developer tools (F12)
   - Look for network errors in the Console tab
   - Check Network tab for API call details

3. **Test API Directly**:
   ```bash
   curl -X POST "YOUR_GOOGLE_APPS_SCRIPT_URL" \
   -H "Content-Type: application/json" \
   -d '{"propertyType":"Test","listingType":"Sale","title":"Test Property","location":"Test Location","price":"1000000","contactName":"Test User","contactPhone":"9876543210"}'
   ```

## Security Considerations

1. **Google Apps Script Permissions**:
   - The script runs with your Google account permissions
   - Only deploy as web app if you trust the source

2. **Data Validation**:
   - All data is validated both client-side and server-side
   - Phone numbers and emails are format-checked
   - Required fields are enforced

3. **Environment Variables**:
   - Never commit `.env.local` to version control
   - Keep your Google Apps Script URL private
   - Rotate credentials periodically

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Google Apps Script execution logs
3. Verify all configuration steps were completed
4. Test with minimal data first

For additional customization or support, refer to:
- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Next.js API Routes Documentation](https://nextjs.org/docs/api-routes/introduction)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
