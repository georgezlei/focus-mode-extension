(function() {
  'use strict';

  // Text patterns to hide in menus (Google Workspace apps)
  const BLOCKED_MENU_ITEMS = [
    'search the web',
    'stock and web'
  ];

  // Text patterns to hide in picker dialog tabs
  const BLOCKED_PICKER_TABS = [
    'google images'
  ];

  // Text patterns to hide Photopea gallery menu items
  const BLOCKED_PHOTOPEA_GALLERY = [
    'gallery'
  ];

  // Regular selectors for Google apps menu items
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

  // Hide picker dialog tabs (Google Images in Google apps)
  function hideBlockedPickerTabs() {
    const pickerTabs = document.querySelectorAll(
      '.picker-navpane-horizontal-navitem, ' +
      '.picker-navpaneitem, ' +
      '[role="tab"], ' +
      '.U26fgb'
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

    // Also check for direct text matches
    const allElements = document.querySelectorAll('div, span, button');
    allElements.forEach(el => {
      if (el.childNodes.length <= 3) {
        const text = el.textContent.toLowerCase().trim();
        if (text === 'google images') {
          let parent = el;
          for (let i = 0; i < 5; i++) {
            if (parent.parentElement) {
              parent = parent.parentElement;
              if (parent.classList.contains('picker-navpane-horizontal-navitem') ||
                  parent.getAttribute('role') === 'tab' ||
                  parent.tagName === 'LI') {
                parent.style.display = 'none';
                break;
              }
            }
          }
          el.style.display = 'none';
        }
      }
    });
  }

  // Hide Photopea gallery menu items (div.enab->.label structure)
  function hidePhotopeaGalleryMenu() {
    const menuItems = document.querySelectorAll('div.enab, div.disab');

    menuItems.forEach(item => {
      const label = item.querySelector('.label');
      if (!label) return;

      const text = label.textContent.toLowerCase().trim();

      // Hide exact text matches
      if (BLOCKED_PHOTOPEA_GALLERY.includes(text)) {
        item.style.display = 'none';
      }
    });
  }

  // Combined hide function
  function hideBlockedElements() {
    hideBlockedMenuItems();
    hideBlockedPickerTabs();
    hidePhotopeaGalleryMenu();
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