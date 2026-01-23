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

  // Combined hide function
  function hideBlockedElements() {
    hideBlockedMenuItems();
    hideBlockedPickerTabs();
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
