# Focus Mode for Google Workspace and Photopea

A Chrome extension that hides web image search options in Google Docs, Sheets, Slides and Photopea gallery to help maintain focus and reduce distractions.

## What it blocks

| App | Location | Blocked Item |
|-----|----------|--------------|
| Google Docs | Insert > Image menu | "Search the web" |
| Google Sheets | Insert > Image dialog | "Google Images" tab |
| Google Slides | Insert > Image menu | "Stock and web" |
| Photopea | Sidebar button | "Gallery" |
| Photopea | CSS/Other dialogs | "Gallery" tabs |
| Photopea | Window > More > Gallery menu | "Gallery" option |

## Installation

### Option 1: Load unpacked (Developer mode)

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the extension folder

### Option 2: Install CRX file

1. Download `focus-mode.crx` from the [Releases](https://github.com/georgezlei/focus-mode-extension/releases) page
2. Open Chrome and go to `chrome://extensions`
3. Drag and drop the CRX file onto the page

## How it works

The extension uses a content script that:
1. Monitors DOM changes using MutationObserver
2. Detects when menus or dialogs open
3. Hides elements containing blocked text patterns

The extension runs silently with no icon or UI.

## License

MIT
