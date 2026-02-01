#!/bin/bash

echo "Creating extension package..."

# Create temp directory
mkdir -p dist

# Copy all extension files
cp manifest.json dist/
cp content.js dist/
cp styles.css dist/
cp -r icons dist/
cp README.md dist/
cp test-photopea-blocking.md dist/

# Create zip
cd dist
zip -r ../focus-mode-photopea.zip *
cd ..

# Cleanup
rm -rf dist

echo "Extension packaged as focus-mode-photopea.zip"
echo "This extension now supports both Google Workspace and Photopea gallery blocking"