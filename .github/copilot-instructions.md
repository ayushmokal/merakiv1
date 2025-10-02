# Copilot Instructions for Meraki Square Foots Property Portal

## Architecture Overview

This is a **Next.js 14+ property portal** using Google Sheets as the primary database via Google Apps Scripts. The system manages real estate listings across multiple categories (Buy, Lease, Commercial, Bungalow, Interior) with a serverless backend architecture.

### Core Data Flow
- **Frontend**: Next.js App Router with shadcn/ui + Tailwind CSS
- **API Layer**: Next.js API routes (`/app/api/*`) handle business logic and validation
- **Backend**: Google Apps Scripts serve as serverless functions with direct Google Sheets integration
- **Storage**: Google Sheets store properties, leads, work submissions, and enquiries
- **Media**: Cloudinary handles image/video uploads via Google Apps Script integration

## Critical Environment Configuration

### Required Environment Variables
```bash
# Google Apps Script Deployment URLs
GOOGLE_PROPERTIES_API_URL     # Property data fetching/CRUD operations
GOOGLE_APPS_SCRIPT_URL        # Property submissions & enquiries
GOOGLE_WORK_API_URL           # Work portfolio submissions

# Cache Configuration  
PROPERTIES_CACHE_TTL_MS=60000 # In-memory cache TTL (default 60s)
```

**Critical**: Each Google Apps Script must be deployed as a web app with "Execute as: Me" and "Who has access: Anyone" settings.

## Google Sheets Integration Patterns

### Property Data Structure
Properties use categorized prefixes for data organization:
- `BUY_*` - Purchase properties
- `LEASE_*` - Rental properties
- `COMM_*` - Commercial spaces  
- `BUNG_*` - Bungalows/villas
- `INT_*` - Interior design projects

### API Communication Pattern
```typescript
// Standard Google Apps Script integration
const response = await fetch(GOOGLE_SCRIPT_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(dataObject)
});

// Always handle both success/error responses
if (!response.ok) throw new Error(`HTTP ${response.status}`);
const result = await response.json();
if (result.status === 'error') throw new Error(result.message);
```

## Advanced Features & Gotchas

### In-Memory Caching System
- Properties API uses Map-based caching (`globalAny.__PROPERTIES_CACHE__`)
- Cache key built from filter parameters (excluding pagination)
- TTL-based invalidation with fallback to stale cache on errors
- **Important**: Cache is per-process, resets on deployment

### Price Filtering Logic
Complex price normalization handles mixed formats:
```typescript
// Handles: "45-55lakhs", "19L-30L", "1.5Cr-2Cr", "90L-1.2Cr"
const priceString = property.price.toString()
  .replace(/[₹\s,]/g, '')        // Remove rupee symbols, spaces, commas
  .replace(/–/g, '-')            // Normalize dashes
  .toLowerCase();
```

### Media Handling
- **Images & Videos**: Single `images` field stores comma-separated URLs
- **Processing**: API splits into `images[]`, `videos[]`, and `media[]` arrays
- **Detection**: Video URLs identified by `/video/upload/` or file extensions
- **Order**: `media[]` preserves original Google Sheets sequence

### Modal System Architecture
Comprehensive modal ecosystem:
- `PopupBlocker.tsx` - Session-gated lead capture (sessionStorage: 'popupBlockerSeen')
- `PropertyPostModal.tsx` - Multi-step property submission with validation
- `EnquiryModal.tsx` - Context-aware enquiry forms
- All use shadcn/ui Dialog with shared validation patterns

## Development Workflows

### Adding New API Endpoints
1. Create route in `/app/api/[endpoint]/route.ts`
2. Implement standard error handling with try/catch
3. Validate inputs with proper TypeScript types
4. Forward to appropriate Google Apps Script
5. Update corresponding Google Apps Script if needed
6. Test with middleware security headers

### Form Component Patterns
```typescript
// Standard form validation pattern
const validateForm = () => {
  if (!formData.field.trim()) {
    toast({ title: "Error", description: "Field required", variant: "destructive" });
    return false;
  }
  return true;
};

// Standard submission pattern
const handleSubmit = async () => {
  if (!validateForm()) return;
  setIsSubmitting(true);
  try {
    const response = await fetch('/api/endpoint', { /* ... */ });
    if (response.ok) {
      toast({ title: "Success", description: "Operation completed" });
    }
  } catch (error) {
    toast({ title: "Error", description: "Please try again", variant: "destructive" });
  } finally {
    setIsSubmitting(false);
  }
};
```

### Security & Performance
- **Middleware**: Applies security headers and CORS to all `/api/*` routes
- **Rate Limiting**: Configured in `middleware.ts` for API protection
- **Image Optimization**: Disabled (`images: { unoptimized: false }`) with Cloudinary domains allowed
- **Caching**: HTTP cache headers on API responses with stale-while-revalidate

## Project-Specific Conventions

### Styling System
- **Design Tokens**: CSS variables in `app/globals.css` (HSL color system)
- **Component Styling**: shadcn/ui + `cn()` utility from `lib/utils.ts`
- **Animations**: Custom keyframes for accordions, fades, marquees
- **Responsive**: Mobile-first with dedicated mobile components in `/components/mobile/`

### File Organization
```
app/
├── api/                    # Next.js API routes
├── (pages)/               # App Router pages
└── globals.css           # Global styles + CSS variables

components/
├── ui/                   # shadcn/ui base components
├── mobile/              # Mobile-specific components  
└── *.tsx               # Business components

[root]/
├── *-apps-script.js    # Google Apps Scripts (deploy separately)
└── middleware.ts       # Security & CORS
```

### Common Debugging Steps
1. **API Issues**: Check environment variables in `/api/*/route.ts`
2. **Google Scripts**: Verify deployment URLs and execution permissions
3. **Cache Problems**: Clear `globalAny.__PROPERTIES_CACHE__` or restart dev server
4. **Form Validation**: Check `useToast` hook integration and error states
5. **Mobile Issues**: Test with `MobileWrapper.tsx` and responsive breakpoints
