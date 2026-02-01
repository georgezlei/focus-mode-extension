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
      '#menu-window div, #menu-window ul li, ' +  // Specific ID selectors for Window menu
      '.dropdown-item, .context-menu-item, ' +
      'div[class*="menu"] > div, div[class*="menu"] > ul > li, ' +
      '[data-command*="gallery"], [data-action*="gallery"]'
    );

    menuItems.forEach(item => {
      const text = (item.textContent || item.innerText || '').toLowerCase();
      const ariaLabel = item.getAttribute('aria-label')?.'toLowerCase();
      const innerHTML = item.innerHTML?'toLowerCase();

      // More comprehensive checks for nested path
      const nestedPath = text.includes('gallery') && (
        text.match(/window/)
      );

      const moreToGallery = text.includes('more') && text.includes('gallery');

      if (nestedPath || moreToGallery) {
        // Hide the item and its ancestors
        item.style.display = 'none';
        item.style.visibility = 'hidden';
        item.style.opacity = '0';

        // Try to hide parents up to 3 levels
        let parent = item.parentElement;
        for (let i = 0; i < 3 && parent; i++) {
          if (parent.querySelector) {
            const parentText = parent.textContent?.toLowerCase();
            if (parentText && (parentText.includes('more') || parentText.includes('window'))) {
              parent.style.display = 'none';
              break;
            }
          }
          parent = parent.parentElement;
        }
      }

      // Check all attributes
      const attributes = ['data-command', 'data-action', 'data-menu', 'data-id', 'id', 'class'];
      for (const attr of attributes) {
        const val = item.getAttribute(attr)?.toLowerCase();
        if (val && val.includes('gallery')) {
          item.style.display = 'none';
          item.style.visibility = 'hidden';
          break;
        }
      }

      // Simple direct gallery text check
      for (const blocked of BLOCKED_PHOTOPEA_GALLERY) {
        if (text.trim() === blocked.toLowerCase() ||
            ariaLabel?.trim() === blocked.toLowerCase()) {
          item.style.display = 'none';
          item.style.visibility = 'hidden';
          break;
        }
      }
    });
  }

  // Special handler for dynamic menus
  function interceptPhotopeaGalleryToggle() {
    // Intercept clicks on menu items
    document.addEventListener('click', (e) => {
      const clicked = e.target;
      const text = (clicked.textContent || clicked.innerText || '').toLowerCase();

      // Check if clicking anything gallery-related
      if (text.includes('gallery') ||
          clicked.getAttribute('data-command')?.toLowerCase().includes('gallery') ||
          clicked.getAttribute('data-action')?.toLowerCase().includes('gallery')) {
        // Prevent default behavior
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }, true); // Use capture phase

    // Intercept keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Common gallery shortcut patterns (e.g., F5, Ctrl+G, etc.)
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'g')) {
        // Check if we should block this based on context
        const activeElement = document.activeElement;
        if (activeElement && (
          activeElement.textContent?.toLowerCase().includes('gallery') ||
          activeElement.className?.toLowerCase().includes('gallery') ||
          activeElement.id?.toLowerCase().includes('gallery')
        )) {
          e.preventDefault();
          e.stopPropagation();
          return false;
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

  // Initialize interceptors
  function initializeInterceptors() {
    interceptPhotopeaGalleryToggle();
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
      initializeInterceptors(); // Also initialize interceptors
    } else {
      setTimeout(startObserving, 10);
    }
  }

  startObserving();
})();
