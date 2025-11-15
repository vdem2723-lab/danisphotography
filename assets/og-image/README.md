# Open Graph Image for Danis Photography

This directory contains the Open Graph (OG) image used for social media sharing on the Danis Photography website.

## Overview

The OG image (`og-image.png`) is a 1200x630px graphic that appears when the website is shared on social media platforms like Facebook, Twitter, LinkedIn, and more. It follows the standard Open Graph image specifications and represents the brand's visual identity.

## Design Elements

The OG image incorporates the following design elements from the website:

- **Primary Color**: Electric Purple (#A855F7)
- **Background**: Black gradient with purple accents
- **Typography**: Modern sans-serif fonts matching the website
- **Brand Name**: "DANIS PHOTOGRAPHY" prominently displayed
- **Tagline**: "CAPTURING MOMENTS • CREATING ART"
- **Location**: "STOCKHOLM"
- **Icon**: Camera icon with purple glow
- **Decorative Elements**: Purple gradient orbs, corner accents, and borders

## Files

- `og-image.png` - The final OG image (1200x630px, PNG format, ~650KB)
- `template.html` - HTML template used to generate the OG image
- `generate-og-image.js` - Node.js script to regenerate the image (requires Playwright)
- `README.md` - This documentation file

## How to Update the OG Image

If you need to update the OG image in the future, follow these steps:

### Option 1: Using the HTML Template Directly

1. Edit `template.html` to make your desired changes
2. Open `template.html` in a browser at 1200x630 resolution
3. Take a screenshot and save as `og-image.png`
4. Copy the image to `/images/og-image.png`

### Option 2: Using the Generation Script

1. Install Node.js and Playwright:
   ```bash
   npm install -D playwright
   ```

2. Run the generation script:
   ```bash
   node generate-og-image.js
   ```

3. The script will create `og-image.png` automatically
4. Copy the generated image to `/images/og-image.png`:
   ```bash
   cp og-image.png ../../images/og-image.png
   ```

### Option 3: Using Playwright Browser Tools

1. Start a local HTTP server:
   ```bash
   python3 -m http.server 8765
   ```

2. Use Playwright or browser dev tools to capture at 1200x630 resolution
3. Save as `og-image.png`
4. Copy to the images directory

## Customization Guide

To customize the OG image, edit `template.html`:

### Colors
- Primary purple: `#A855F7`
- Light purple: `#D8B4FE`
- Dark purple: `#7C3AED`
- Background: `#000000` to `#0F0F0F`

### Typography
```css
.brand-name {
    font-size: 110px;
    letter-spacing: 16px;
}

.tagline {
    font-size: 36px;
    letter-spacing: 8px;
}
```

### Layout
The image uses CSS flexbox for centering content. Adjust padding and margins in the `.content` class to reposition elements.

## Technical Specifications

- **Dimensions**: 1200x630 pixels
- **Format**: PNG (supports transparency and high quality)
- **File Size**: ~650KB (optimized for web)
- **Color Space**: RGB
- **Aspect Ratio**: 1.9:1 (standard for OG images)

## Usage in HTML

The OG image is referenced in all HTML pages via meta tags:

```html
<!-- Open Graph / Facebook -->
<meta property="og:image" content="https://danisphotography.se/images/og-image.png">

<!-- Twitter -->
<meta property="twitter:image" content="https://danisphotography.se/images/og-image.png">
```

## Testing

After updating the OG image, test it using these tools:

1. **Facebook Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

These tools will show how your OG image appears when shared and help clear any cached versions.

## Best Practices

1. **Keep text readable**: Ensure all text is legible at small sizes
2. **Maintain brand consistency**: Use colors and fonts from the website
3. **Optimize file size**: Keep under 1MB for fast loading
4. **Test on multiple platforms**: Preview on Facebook, Twitter, LinkedIn
5. **Use high contrast**: Ensure text stands out from the background
6. **Avoid important content near edges**: Some platforms may crop the image

## Version History

- **v1.0** (2025-11-15): Initial OG image created
  - 1200x630px PNG format
  - Purple gradient design matching website theme
  - Camera icon, brand name, tagline, and location included
  - Optimized for social media sharing

## Credits

Design created for Danis Photography following the website's visual identity and brand guidelines.
