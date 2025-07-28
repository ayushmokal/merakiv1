# Property Submission - Quick Test Guide

## Test the Implementation

The property submission system is now set up and ready to test. Here's how to test it:

### 1. Local Testing (Without Google Sheet Connection)

1. Open your browser and go to: `http://localhost:3001/projects`
2. Click the "Post a Property" button (black button in the tabs)
3. Fill out the form with test data:
   - Property Type: Select any type
   - Listing Type: Sale/Rent/Lease
   - Property Title: "Test Property Submission"
   - Location: Select any location
   - Price: "5000000"
   - Contact Name: "Test User"
   - Contact Phone: "9876543210"
4. Click "Submit Property"

**Expected Result**: The form will show a validation error about missing Google Apps Script URL since we haven't set up the environment variables yet.

### 2. Complete Setup with Google Sheet

To make it fully functional, follow these steps:

#### Step A: Create Google Sheet
1. Go to https://sheets.google.com
2. Create a new spreadsheet named "Property Portal Submissions"
3. Copy the Sheet ID from the URL

#### Step B: Deploy Google Apps Script
1. Go to https://script.google.com
2. Create new project
3. Copy the code from `property-portal-google-apps-script.js`
4. Update the SHEET_ID and NOTIFICATION_EMAIL
5. Deploy as web app with "Anyone" access
6. Copy the deployment URL

#### Step C: Configure Environment
1. Create `.env.local` file:
   ```
   GOOGLE_APPS_SCRIPT_URL=your_deployment_url_here
   ```
2. Restart the development server:
   ```bash
   npm run dev
   ```

#### Step D: Test End-to-End
1. Go to http://localhost:3001/projects
2. Click "Post a Property"
3. Fill out the form completely
4. Submit
5. Check your Google Sheet for the new entry
6. Check your email for notification

### 3. Form Validation Testing

Test the form validation by:
1. Trying to submit without required fields
2. Entering invalid phone numbers
3. Entering invalid email addresses
4. Testing different property types and configurations

### 4. Features to Test

- **Property Types**: All dropdown options work
- **Locations**: All Mumbai locations are available
- **Amenities**: Multiple selection works
- **Price Types**: Total/Per Sq Ft/Per Month options
- **Responsive Design**: Test on mobile and desktop
- **Form Reset**: Form clears after successful submission
- **Error Handling**: Proper error messages display

### 5. Current Status

✅ **Completed**:
- Property submission modal component
- Form validation (client-side and server-side)
- API route for handling submissions
- Google Apps Script code
- Complete setup documentation
- Integration with existing "Post a Property" button

⏳ **Needs Setup**:
- Google Sheet creation
- Google Apps Script deployment
- Environment variable configuration

### 6. Next Steps

1. Follow the complete setup guide in `PROPERTY_SUBMISSION_SETUP.md`
2. Test the functionality end-to-end
3. Customize form fields if needed
4. Set up email notifications
5. Consider adding file upload for property images (future enhancement)

The implementation is ready to use! Just complete the Google Sheet and Apps Script setup to make it fully functional.
