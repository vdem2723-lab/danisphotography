# Image Optimization Guide

This guide explains how to optimize images for the Danis Photography website to achieve maximum performance and Lighthouse scores.

## Modern Image Formats

### WebP Support
All images should be provided in both WebP and fallback formats (JPEG/PNG) for maximum browser compatibility.

### Using Picture Element
For modern format support with fallback:

```html
<picture>
    <source srcset="images/photo.webp" type="image/webp">
    <source srcset="images/photo.jpg" type="image/jpeg">
    <img src="images/photo.jpg" alt="Description" loading="lazy" width="800" height="600">
</picture>
```

### Responsive Images with srcset
For responsive images at different sizes:

```html
<img 
    src="images/photo-800.jpg" 
    srcset="images/photo-400.jpg 400w,
            images/photo-800.jpg 800w,
            images/photo-1200.jpg 1200w,
            images/photo-1600.jpg 1600w"
    sizes="(max-width: 768px) 100vw, 
           (max-width: 1200px) 50vw,
           800px"
    alt="Description"
    loading="lazy"
    width="800"
    height="600">
```

## Image Optimization Workflow

### 1. Convert to WebP
```bash
# Using cwebp (Google's WebP encoder)
cwebp -q 85 input.jpg -o output.webp

# Batch convert all JPGs in a directory
for file in *.jpg; do
    cwebp -q 85 "$file" -o "${file%.jpg}.webp"
done
```

### 2. Generate Multiple Sizes
```bash
# Using ImageMagick
convert input.jpg -resize 400x output-400.jpg
convert input.jpg -resize 800x output-800.jpg
convert input.jpg -resize 1200x output-1200.jpg
convert input.jpg -resize 1600x output-1600.jpg
```

### 3. Optimize JPEGs
```bash
# Using jpegoptim
jpegoptim --max=85 --strip-all *.jpg

# Using mozjpeg
cjpeg -quality 85 -optimize input.jpg > output.jpg
```

### 4. Optimize PNGs
```bash
# Using optipng
optipng -o7 *.png

# Using pngquant (lossy)
pngquant --quality=80-95 *.png
```

## Lazy Loading

All images should use native lazy loading:

```html
<img src="image.jpg" alt="Description" loading="lazy">
```

For above-the-fold hero images, use eager loading:

```html
<img src="hero.jpg" alt="Hero" loading="eager" fetchpriority="high">
```

## Background Images

For CSS background images that should lazy load, use data attributes:

```html
<div class="gallery-item" data-bg="images/photo.jpg"></div>
```

The JavaScript will automatically load these when they come into view.

## Image Dimensions

Always specify width and height attributes to prevent layout shift:

```html
<img src="photo.jpg" alt="Description" width="800" height="600" loading="lazy">
```

## Preloading Critical Images

For hero images and above-the-fold content:

```html
<link rel="preload" as="image" href="images/hero.jpg" fetchpriority="high">
```

## Portfolio Images

### Current Structure
Portfolio images are loaded via data-bg attributes and lazy loaded by JavaScript.

### Recommended Structure
```html
<article class="gallery-item">
    <picture>
        <source srcset="images/portfolio/photo-400.webp 400w,
                        images/portfolio/photo-800.webp 800w"
                type="image/webp">
        <source srcset="images/portfolio/photo-400.jpg 400w,
                        images/portfolio/photo-800.jpg 800w"
                type="image/jpeg">
        <img src="images/portfolio/photo-800.jpg"
             alt="Portfolio item description"
             loading="lazy"
             width="800"
             height="1000">
    </picture>
</article>
```

## Optimization Targets

### File Sizes
- Hero images: < 200KB (WebP), < 300KB (JPEG)
- Portfolio thumbnails: < 100KB (WebP), < 150KB (JPEG)
- Service showcase images: < 150KB (WebP), < 250KB (JPEG)

### Quality Settings
- WebP: 80-90 quality
- JPEG: 80-85 quality
- PNG: Quantized to 256 colors or less where possible

## Tools

### Online Tools
- [Squoosh](https://squoosh.app/) - Browser-based image optimizer
- [TinyPNG](https://tinypng.com/) - PNG/JPEG compression
- [WebP Converter](https://www.freeconvert.com/webp-converter) - WebP conversion

### Command Line Tools
- `cwebp` - WebP encoder (from libwebp)
- `jpegoptim` - JPEG optimizer
- `optipng` - PNG optimizer
- `ImageMagick` - Image manipulation
- `pngquant` - PNG quantization

### Installation (Ubuntu/Debian)
```bash
sudo apt-get install webp jpegoptim optipng imagemagick pngquant
```

### Installation (macOS)
```bash
brew install webp jpegoptim optipng imagemagick pngquant
```

## Testing

After optimization:
1. Run Lighthouse audit (should see improved Performance score)
2. Check Network tab in DevTools for image sizes
3. Test on slow 3G connection to verify load times
4. Verify images display correctly across browsers

## Current Implementation

The site currently uses:
- ✅ Lazy loading via Intersection Observer
- ✅ Background image lazy loading with data-bg
- ✅ Skeleton loading states
- ✅ Progressive image loading
- ⚠️ Need to add WebP/modern format support
- ⚠️ Need to add responsive images with srcset
- ⚠️ Need to optimize existing images

## Next Steps

1. Convert all hero images to WebP with JPEG fallback
2. Generate responsive image sizes (400w, 800w, 1200w, 1600w)
3. Update HTML to use picture element or srcset
4. Optimize all existing images
5. Update portfolio to use picture elements
6. Add art direction for different screen sizes
