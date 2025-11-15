#!/usr/bin/env node

/**
 * OG Image Generator for Danis Photography
 * 
 * This script generates an Open Graph image (1200x630px) by rendering
 * the HTML template using Playwright's browser automation.
 * 
 * Usage: node generate-og-image.js
 */

const path = require('path');
const fs = require('fs');

async function generateOGImage() {
    console.log('🎨 Starting OG image generation...');

    // Check if Playwright is available
    let playwright;
    try {
        playwright = require('playwright');
    } catch (error) {
        console.error('❌ Playwright not found. Installing...');
        const { execSync } = require('child_process');
        execSync('npm install -D playwright', { stdio: 'inherit' });
        playwright = require('playwright');
    }

    const templatePath = path.join(__dirname, 'template.html');
    const outputPath = path.join(__dirname, 'og-image.png');

    if (!fs.existsSync(templatePath)) {
        console.error('❌ Template file not found:', templatePath);
        process.exit(1);
    }

    console.log('📄 Template found:', templatePath);
    console.log('🖼️  Output path:', outputPath);

    try {
        // Launch browser
        console.log('🌐 Launching browser...');
        const browser = await playwright.chromium.launch({
            headless: true
        });

        const context = await browser.newContext({
            viewport: { width: 1200, height: 630 },
            deviceScaleFactor: 2 // For high-quality rendering
        });

        const page = await context.newPage();

        // Load template
        console.log('📖 Loading template...');
        const templateUrl = `file://${templatePath}`;
        await page.goto(templateUrl, { waitUntil: 'networkidle' });

        // Wait a bit for any animations/fonts to load
        await page.waitForTimeout(500);

        // Take screenshot
        console.log('📸 Taking screenshot...');
        await page.screenshot({
            path: outputPath,
            type: 'png',
            fullPage: false,
            clip: { x: 0, y: 0, width: 1200, height: 630 }
        });

        await browser.close();

        // Verify the file was created
        if (fs.existsSync(outputPath)) {
            const stats = fs.statSync(outputPath);
            console.log(`✅ OG image generated successfully!`);
            console.log(`📊 File size: ${(stats.size / 1024).toFixed(2)} KB`);
            console.log(`📍 Location: ${outputPath}`);
        } else {
            console.error('❌ Failed to create image file');
            process.exit(1);
        }

    } catch (error) {
        console.error('❌ Error generating OG image:', error.message);
        process.exit(1);
    }
}

// Run the generator
generateOGImage();
