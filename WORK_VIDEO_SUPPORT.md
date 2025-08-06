# Work Portfolio Video Support

## Overview
The work portfolio now supports both images and videos, similar to the property listing system. This allows you to showcase your work with rich media content including video walkthroughs, time-lapse construction videos, and more.

## Features Added

### 1. Mixed Media Support
- **Images**: JPG, PNG, WebP, and other image formats
- **Videos**: MP4, MOV, WebM, and other video formats
- **Cloudinary Integration**: Automatic optimization for both images and videos
- **Multiple Media**: Support for multiple images and videos per project

### 2. Enhanced User Experience
- **Smart Detection**: Automatically detects whether a URL is an image or video
- **Video Controls**: Play/pause and mute/unmute controls
- **Responsive Navigation**: Swipe support on mobile devices
- **Media Indicators**: Shows total count and current position
- **Type Indicators**: Shows play icon for video items

### 3. Optimization Features
- **Lazy Loading**: Media loads only when needed
- **Auto Quality**: Cloudinary automatic quality optimization
- **Format Optimization**: Automatic format selection for best performance
- **Responsive Sizing**: Optimized for different screen sizes

## How to Add Media to Work Projects

### Method 1: Google Sheets (Recommended)
Add media URLs in your Google Sheets with these columns:

1. **images**: Comma-separated image URLs (legacy support)
2. **media**: Comma-separated mixed media URLs (new feature)

Example:
```
media: https://res.cloudinary.com/demo/video/upload/v1234567890/project1_walkthrough.mp4,https://res.cloudinary.com/demo/image/upload/v1234567890/project1_hero.jpg,https://res.cloudinary.com/demo/video/upload/v1234567890/project1_timelapse.mp4
```

### Method 2: Direct API Updates
Update your work API to include the media field:

```typescript
interface WorkProject {
  id: string;
  name: string;
  type: string;
  location: string;
  year: number;
  description: string;
  area: string;
  services: string[];
  status: string;
  imageUrl: string;
  images?: string[];  // Legacy support
  media?: string[];   // New mixed media support
  timestamp: string;
}
```

## Supported Video Formats

### Direct Video URLs
- MP4: `.mp4`
- MOV: `.mov`
- WebM: `.webm`
- AVI: `.avi`
- Other formats: `.ogg`, `.m4v`, `.3gp`, `.flv`, `.wmv`, `.mkv`

### Cloudinary Video URLs
- Any URL containing `/video/upload/`
- Automatic optimization applied
- Example: `https://res.cloudinary.com/your-cloud/video/upload/v1234567890/sample.mp4`

### Video Streaming URLs
- URLs containing "video" with cloudinary, youtube, or vimeo domains
- Example: `https://res.cloudinary.com/demo/video/upload/sample.mp4`

## Media Priority System

The system uses a priority order to determine which media to display:

1. **media** array (highest priority) - Mixed images and videos
2. **images** array (medium priority) - Images only (legacy)
3. **imageUrl** string (lowest priority) - Single image fallback

## Best Practices

### 1. Video Optimization
- **File Size**: Keep videos under 50MB for web performance
- **Duration**: Optimal length is 30-60 seconds for project showcases
- **Resolution**: 1080p is recommended, 4K for hero content
- **Format**: MP4 with H.264 encoding for best browser support

### 2. Mixed Media Strategy
- **Lead with Video**: Place your best video first in the media array
- **Alternate Types**: Mix videos and images for visual variety
- **Context**: Use images for details, videos for overviews
- **Thumbnails**: First image should be an engaging thumbnail

### 3. Cloudinary Setup
```javascript
// Cloudinary URL structure for videos
https://res.cloudinary.com/[cloud-name]/video/upload/[transformations]/[version]/[public-id].[format]

// Example with optimizations
https://res.cloudinary.com/demo/video/upload/w_520,h_350,c_fit,q_auto,f_auto/v1234567890/project_walkthrough.mp4
```

## Technical Implementation

### MediaCarousel Component
The work portfolio now uses the same `MediaCarousel` component as properties:

```tsx
<MediaCarousel
  media={mediaUrls}
  title={project.name}
  className="rounded-t-lg"
/>
```

### Media Detection Logic
```typescript
const determineMediaType = (url: string): 'image' | 'video' => {
  // Cloudinary video URLs
  if (url.includes('/video/upload/')) return 'video';
  
  // Video file extensions
  if (url.match(/\.(mp4|mov|avi|webm|ogg|m4v|3gp|flv|wmv|mkv)(\?|$|#)/i)) {
    return 'video';
  }
  
  // Video streaming patterns
  if (url.includes('video') && (url.includes('cloudinary') || url.includes('youtube') || url.includes('vimeo'))) {
    return 'video';
  }
  
  return 'image';
};
```

## Testing

### 1. Local Testing
1. Start the development server: `npm run dev`
2. Navigate to `/work`
3. Add test media URLs to your data source
4. Verify both images and videos display correctly

### 2. Video Test URLs
Use these sample Cloudinary URLs for testing:
```
https://res.cloudinary.com/demo/video/upload/v1564677047/sample.mp4
https://res.cloudinary.com/demo/video/upload/v1564677047/ocean.mp4
```

### 3. Image Test URLs
```
https://res.cloudinary.com/demo/image/upload/v1564677047/sample.jpg
https://res.cloudinary.com/demo/image/upload/v1564677047/ocean.jpg
```

## Troubleshooting

### Common Issues

1. **Videos Not Playing**
   - Check video URL accessibility
   - Verify CORS headers for cross-domain videos
   - Ensure video format is supported by browsers

2. **Performance Issues**
   - Use Cloudinary transformations to optimize video size
   - Consider lazy loading for multiple videos
   - Compress videos before uploading

3. **Mobile Compatibility**
   - Test video playback on mobile devices
   - Ensure videos are optimized for mobile bandwidth
   - Use `playsInline` attribute for iOS compatibility

### Debug Tips
```javascript
// Check media type detection
console.log(determineMediaType(mediaUrl));

// Verify media URLs
console.log(getProjectMedia(project));
```

## Future Enhancements

### Planned Features
- **YouTube/Vimeo Embedding**: Direct support for video platform URLs
- **Video Thumbnails**: Custom thumbnail support for videos
- **Autoplay Options**: Configurable autoplay settings
- **Video Analytics**: View tracking for video content
- **Progressive Loading**: Better loading experience for large videos

### Integration Opportunities
- **Social Media**: Share individual media items
- **SEO**: Video schema markup for better search visibility
- **Analytics**: Track engagement with different media types
- **CMS Integration**: Visual media management interface

## Support

For technical issues or questions about video implementation:
1. Check browser console for error messages
2. Verify video URL format and accessibility
3. Test with sample Cloudinary URLs
4. Review network tab for failed media requests

The video support system is designed to be robust and fallback gracefully to images if videos fail to load, ensuring a consistent user experience.
