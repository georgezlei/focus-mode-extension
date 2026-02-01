(function() {
  'use strict';

  // Text patterns to hide in menus (case-insensitive)
  const BLOCKED_MENU_ITEMS = [
    'search the web',
    'stock and web'
  ];

  // Text patterns to hide in picker dialog tabs (case-insensitive)
  const BLOCKED_PICKER_TABS = [
    'google images'
  ];

  // Text patterns to hide Photopea gallery elements (case-insensitive)
  const BLOCKED_PHOTOPEA_GALLERY = [
    'gallery',
    'free photos',
    'stock photos'
  ];

  // Hide menu items that match blocked patterns
  function hideBlockedMenuItems() {
    const menuItems = document.querySelectorAll('.goog-menuitem');

    menuItems.forEach(item => {
      const text = item.textContent.toLowerCase().trim();

      for (const blocked of BLOCKED_MENU_ITEMS) {
        if (text.includes(blocked.toLowerCase())) {
          item.style.display = 'none';
          break;
        }
      }
    });
  }

  // Hide picker dialog tabs (Google Images tab in Sheets/Slides)
  function hideBlockedPickerTabs() {
    // Look for picker navigation items - these are the tabs in the Insert Image dialog
    const pickerTabs = document.querySelectorAll(
      '.picker-navpane-horizontal-navitem, ' +
      '.picker-navpaneitem, ' +
      '[role="tab"], ' +
      '.U26fgb'  // Google button class
    );

    pickerTabs.forEach(tab => {
      const text = tab.textContent.toLowerCase().trim();

      for (const blocked of BLOCKED_PICKER_TABS) {
        if (text.includes(blocked.toLowerCase())) {
          tab.style.display = 'none';
          break;
        }
      }
    });

    // Also look for any element containing "Google Images" text
    const allElements = document.querySelectorAll('div, span, button');
    allElements.forEach(el => {
      // Only hide if it's a direct text match and looks like a tab/button
      if (el.childNodes.length <= 3) {  // Likely a leaf/near-leaf element
        const text = el.textContent.toLowerCase().trim();
        if (text === 'google images') {
          // Hide the tab - traverse up to find the clickable parent
          let parent = el;
          for (let i = 0; i < 5; i++) {
            if (parent.parentElement) {
              parent = parent.parentElement;
              // Check if this looks like a tab container
              if (parent.classList.contains('picker-navpane-horizontal-navitem') ||
                  parent.getAttribute('role') === 'tab' ||
                  parent.tagName === 'LI') {
                parent.style.display = 'none';
                break;
              }
            }
          }
          // Also hide the element itself
          el.style.display = 'none';
        }
      }
    });
  }

  // Hide Photopea gallery button in sidebar and handle menu toggling
  function hidePhotopeaGalleryButton() {
    // Enhanced selector to catch gallery button even when toggled via Window->More->Gallery
    const gallerySelectors = [
      'button', 'div[onclick]', 'img[src*="gallery"]', 'a[href*="gallery"]',
      '[title*="Gallery" i]', '[aria-label*="Gallery" i]',
      '[data-tooltip*="Gallery" i]', '.gallery-button', '.gallery-icon',
      '*[class*="gallery" i]', '*[id*="gallery" i]'
    ];

    const galleryButtons = document.querySelectorAll(gallerySelectors.join(', '));

    galleryButtons.forEach(button => {
      // Check various properties that might contain gallery text
      const text = (button.textContent || button.title || button.alt || button.innerText || '').toLowerCase();
      const ariaLabel = button.getAttribute('aria-label') || '';
      const onclick = button.getAttribute('onclick') || '';
      const href = button.getAttribute('href') || '';
      const dataTooltip = button.getAttribute('data-tooltip') || '';
      const className = button.className || '';
      const id = button.id || '';

      for (const blocked of BLOCKED_PHOTOPEA_GALLERY) {
        const blockedLower = blocked.toLowerCase();
        if (text.includes(blockedLower) ||
            ariaLabel.toLowerCase().includes(blockedLower) ||
            onclick.toLowerCase().includes(blockedLower) ||
            href.toLowerCase().includes(blockedLower) ||
            dataTooltip.toLowerCase().includes(blockedLower) ||
            className.toLowerCase().includes(blockedLower) ||
            id.toLowerCase().includes(blockedLower)) {
          button.style.display = 'none';
          // Also hide parent container if it's a button wrapper
          const parent = button.closest('*[class*="button"], *[role="button"]');
          if (parent && parent !== button) {
            parent.style.display = 'none';
          }
          break;
        }
      }
    });
  }

  // Hide gallery tab in CSS/other dialogs
  function hidePhotopeaDialogGalleries() {
    // Look for dialog tabs and content
    const dialogElements = document.querySelectorAll(
      '.dialog, .modal, [role="dialog"], ' +
      '.tab, [role="tab"], ' +
      '.tab-content, .dialog-content'
    );

    dialogElements.forEach(element => {
      const text = element.textContent.toLowerCase().trim();

      for (const blocked of BLOCKED_PHOTOPEA_GALLERY) {
        if (text.includes(blocked.toLowerCase())) {
          // Hide the tab or content
          element.style.display = 'none';
          // Also try to hide parent tab container
          const parent = element.closest('.tab, [role="tab"], .tablist');
          if (parent) {
            parent.style.display = 'none';
          }
          break;
        }
      }
    });
  }

  // Additional function to handle Window->More->Gallery menu item
  function hidePhotopeaGalleryMenuItem() {
    // Look for menu items that might toggle gallery
    const menuItems = document.querySelectorAll(
      '.menu-item, .menuitem, [role="menuitem"], ' +
      '.dropdown-item, .context-menu-item'
    );

    menuItems.forEach(item => {
      const text = (item.textContent || item.innerText || '').toLowerCase();
      const nestedPath = text.match(/window.*more.*gallery/) ||
                        text.match(/more.*gallery/) ||
                        (text.includes('window') && text.includes('gallery'));

      if (nestedPath) {
        // Hide the Window->More->Gallery menu item
        item.style.display = 'none';
        // Keep checking children for more specific matches
        const galleryText = item.querySelector('*');
        if (galleryText &&
            (galleryText.textContent.toLowerCase().includes('gallery') ||
             galleryText.getAttribute('aria-label')?.toLowerCase().includes('gallery'))) {
          item.style.display = 'none';
        }
      }

      // Simple direct gallery text check
      for (const blocked of BLOCKED_PHOTOPEA_GALLERY) {
        if (text.trim() === blocked.toLowerCase()) {
          item.style.display = 'none';
          break;
        }
      }
    });
  }

  // Combined hide function
  function hideBlockedElements() {
    hideBlockedMenuItems();
    hideBlockedPickerTabs();
    hidePhotopeaGalleryButton();
    hidePhotopeaDialogGalleries();
    // Also hide any menu items that could toggle gallery display
    hidePhotopeaGalleryMenuItem();
  }

  // Debounce to avoid excessive processing
  let timeout = null;
  function debouncedHide() {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(hideBlockedElements, 10);
  }

  // Watch for DOM changes (menus and dialogs are dynamically rendered)
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        debouncedHide();
        break;
      }
    }
  });

  // Start observing when body is available
  function startObserving() {
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      hideBlockedElements();
    } else {
      setTimeout(startObserving, 10);
    }
  }

  startObserving();
})();
