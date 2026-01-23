#!/bin/bash
# CRX3 packing script

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
KEY="$DIR/key.pem"
CRX="$DIR/focus-mode.crx"
ZIP="$DIR/extension.zip"

# Create ZIP of extension files (excluding dev files)
cd "$DIR"
rm -f "$ZIP" "$CRX"
zip -r "$ZIP" content.js styles.css manifest.json icons/ -x "*.DS_Store"

# Pack CRX using Chrome (if available) or create manually
if command -v "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" &> /dev/null; then
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --pack-extension="$DIR" --pack-extension-key="$KEY" 2>/dev/null
    if [ -f "$DIR.crx" ]; then
        mv "$DIR.crx" "$CRX"
        echo "CRX created: $CRX"
    fi
else
    echo "Chrome not found for CRX packing. ZIP created instead: $ZIP"
fi
