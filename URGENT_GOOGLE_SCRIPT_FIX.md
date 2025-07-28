# 🚨 URGENT: Google Apps Script Access Issue Fix

## Problem
The Google Apps Script is returning a 403 "Access denied" error. This means the script is not properly deployed with public access.

## Quick Fix Instructions

### Step 1: Open Your Google Apps Script
1. Go to your Google Apps Script: `https://script.google.com/macros/s/AKfycbzMw6KmLnymjBfjHoSLSYSHFBOnDGzQZKSyrzAf_gUEDiS3yoP-NrXexVzFQU2AH82H/edit`
2. Or go to [script.google.com](https://script.google.com) and find your project

### Step 2: Update the Code
1. **Delete all existing code** in the Code.gs file
2. **Paste the complete Google Apps Script code** I provided earlier
3. **Update the CONFIG section**:
   ```javascript
   const CONFIG = {
     SHEET_NAME: 'Property Submissions',
     NOTIFICATION_EMAIL: 'your-actual-email@gmail.com', // ← CHANGE THIS!
     COMPANY_NAME: 'Meraki Properties',
     TIMEZONE: 'Asia/Kolkata'
   };
   ```

### Step 3: Deploy Correctly
1. Click **"Deploy"** → **"New deployment"**
2. Click the **gear icon** next to "Select type"
3. Choose **"Web app"**
4. Set these settings:
   - **Execute as**: "Me"
   - **Who has access**: **"Anyone"** ← THIS IS CRITICAL!
5. Click **"Deploy"**
6. **Copy the new deployment URL**

### Step 4: Update Environment Variables
Replace your current `.env.local` with the NEW deployment URL:
```
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/NEW_SCRIPT_ID/exec
```

### Step 5: Test the Script
1. In Google Apps Script, run the `testPropertySubmission()` function
2. Check if it creates data in your Google Sheet
3. Restart your Next.js server: `npm run dev`
4. Test the form submission

## Alternative: Quick Test URL
If you want to test immediately, you can use this working test Google Apps Script URL:
```
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec
```

## Common Issues and Solutions

### Issue 1: "Access denied" (403 error)
**Solution**: Script deployment access is not set to "Anyone"
- Redeploy with "Who has access" = "Anyone"

### Issue 2: Script not found
**Solution**: Wrong deployment URL
- Use the URL from the NEW deployment, not the edit URL

### Issue 3: No data appearing in sheet
**Solution**: Sheet ID not configured in script
- Update SHEET_ID in the Google Apps Script code
- Or create new sheet from within the script

### Issue 4: No email notifications
**Solution**: Email not configured
- Update NOTIFICATION_EMAIL in CONFIG
- Grant Gmail permissions when prompted

## Expected Behavior After Fix
1. ✅ Form submits without errors
2. ✅ Data appears in Google Sheet
3. ✅ Email notification received
4. ✅ Success message shows in browser
5. ✅ Form resets after submission

## Need Help?
If you're still having issues:
1. Check the browser console for detailed error messages
2. Check the Google Apps Script execution logs
3. Verify the deployment URL is correct
4. Make sure you're using the Apps Script I provided, not an old one
