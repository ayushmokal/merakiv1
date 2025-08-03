# Copilot Instructions for Meraki Square Foots Property Portal

## Architecture Overview

This is a **Next.js 13+ property portal** with Google Sheets as the backend database via Google Apps Scripts. The system manages real estate listings across 5 categories: Buy, Lease, Commercial, Bungalow, and Interior properties.

### Key Data Flow
- **Frontend**: Next.js app with shadcn/ui components and Tailwind CSS
- **API Layer**: Next.js API routes in `/app/api/` handle business logic
- **Backend**: Google Apps Scripts act as serverless functions connected to Google Sheets
- **Storage**: Google Sheets store property data, leads, and work submissions

## Critical Integration Points

### Google Apps Script URLs
The system relies on deployed Google Apps Script web apps. Key environment variables:
- `GOOGLE_PROPERTIES_API_URL` - Property data fetching/listing
- `GOOGLE_APPS_SCRIPT_URL` - Property submissions and enquiries

**Important**: When modifying API routes, ensure Google Apps Script URLs are properly configured in `/app/api/*/route.ts` files.

### Property Categories & Data Structure
Properties are categorized with specific prefixes:
- `BUY_` - Purchase properties
- `LEASE_` - Rental properties  
- `COMM_` - Commercial spaces
- `BUNG_` - Bungalows/villas
- `INT_` - Interior design projects

Each category has its own Google Sheet with standardized columns defined in the Apps Script files.

## Development Patterns

### Component Architecture
- **UI Components**: Use shadcn/ui components from `/components/ui/`
- **Business Components**: Custom components in `/components/` (modals, forms, etc.)
- **Layout**: Global layout in `app/layout.tsx` includes Navbar, Footer, PopupBlocker, and Toaster

### Modal System
The app uses a comprehensive modal system:
- `PopupBlocker.tsx` - Session-based lead capture popup (auto-triggers)
- `PropertyPostModal.tsx` - Property submission form with file upload
- `EnquiryModal.tsx` - General enquiry forms
- All modals use shadcn/ui Dialog component and share form validation patterns

### API Route Patterns
```typescript
// Standard pattern for all API routes
export async function POST(request: NextRequest) {
  const body = await request.json();
  // Validate required fields
  // Forward to Google Apps Script
  // Handle response and errors
}
```

### Form Handling
- Uses react-hook-form with Zod validation (check existing forms for patterns)
- All forms submit to Next.js API routes, which forward to Google Apps Scripts
- Toast notifications via `useToast` hook for user feedback

## File Upload System
Image uploads use Cloudinary integration within Google Apps Scripts. The `ImageUpload.tsx` component handles client-side file selection, but actual upload happens server-side.

## Styling Conventions
- **Tailwind CSS** with custom design system in `tailwind.config.ts`
- **CSS Variables** for theming (check `app/globals.css`)
- **shadcn/ui** provides base components with consistent styling
- Use `cn()` utility from `lib/utils.ts` for conditional classes

## Development Workflow

### Adding New Features
1. Create API route in `/app/api/`
2. Update corresponding Google Apps Script
3. Deploy new Google Apps Script version
4. Update environment variables if needed
5. Create/modify UI components
6. Test form submissions and data flow

### Google Apps Script Development
Scripts are in root directory (e.g., `property-portal-google-apps-script.js`). When modifying:
1. Update the script in Google Apps Script console
2. Deploy new version
3. Update API URLs in Next.js if deployment URL changes

### Environment Setup
- Run `npm run dev` for development
- ESLint is disabled during builds (`ignoreDuringBuilds: true`)
- Images are unoptimized (`images: { unoptimized: true }`)

## Common Gotchas
- **Session Storage**: PopupBlocker uses sessionStorage to prevent repeated popups
- **Form Validation**: Phone numbers use regex pattern `/^\+?[\d\s\-()]+$/`
- **API Responses**: Always return JSON with `success`/`error` structure
- **Google Sheets**: Column order matters - check Apps Script for exact field mapping
