# Photopea Gallery Blocking Test Instructions

## Setup
1. Load the extension in Chrome developer mode
2. Navigate to https://www.photopea.com
3. Wait for the page to fully load (the editor interface may take a few seconds)

## Test 1: Gallery Button in Sidebar
1. Look for a "Gallery" button in the sidebar (usually on the left side)
2. The button should be hidden/invisible
3. Check if there's an icon or text that shows "Gallery" - it should be blocked

## Test 2: CSS Dialog Gallery Tab
1. Click the CSS button (usually in toolbar or top menu)
2. Look for tabs in the dialog that opens
3. Any "Gallery" or "Photos" tab should be hidden
4. Additional checks:
   - Look for "Free Photos" tab
   - Look for "Stock Photos" tab

## Test 3: Window -> More -> Gallery Menu
1. Click on the "Window" menu in the top menu bar
2. Look for "More" submenu and hover/click it
3. The "Gallery" option should be hidden
4. Even if you can see "Window", the submenu tree should not show Gallery

## Test 4: Gallery Button Toggle via Menu
1. Look for other ways to toggle gallery (View menu, etc.)
2. Try to enable gallery through menu options
3. Gallery button should remain hidden regardless
4. The Window->More->Gallery path specifically should have no effect

## Test 5: Other Dialog Galleries
1. Check other dialogs that might have gallery access
2. Look for tabs or panels with "Gallery", "Photos", "Free Photos", "Stock Photos"
3. All should be hidden

## Test 6: Browser Developer Console
1. Open Chrome Developer Tools (F12)
2. Go to Elements tab
3. Search for elements containing "gallery" (use Ctrl+F)
4. Any matching elements should have `display: none` in their styles
5. Check for `.photopea-gallery-button`, `[title*="Gallery"]`, etc.

## Expected Behavior
- Gallery button should not be visible on sidebar
- Gallery tabs should not appear in any dialogs
- Window->More->Gallery menu option should be hidden
- Other functionality should remain intact
- All hiding should persist across UI updates

## Notes
- The extension runs automatically on page load
- Gallery hiding may take a moment after page load (1-2 seconds)
- Some elements may be dynamically loaded by Photopea - check multiple times
- If elements appear/disappear, that indicates the MutationObserver is working