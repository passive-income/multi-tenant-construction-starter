# Clear Sanity Studio Cache

The subtitle error is caused by Sanity Studio's aggressive caching. Follow these steps:

## 1. Open Browser DevTools (F12)

## 2. Clear All Storage
- Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
- Click **Clear site data** or manually clear:
  - Local Storage
  - Session Storage  
  - IndexedDB
  - Cache Storage
  - Service Workers (unregister all)

## 3. Hard Refresh
- Press `Ctrl + Shift + R` (Windows/Linux)
- Press `Cmd + Shift + R` (Mac)

## 4. If still not working, try Incognito/Private mode
- Open `/studio` in a new incognito window
- This bypasses all caches

## 5. Nuclear option - Clear browser cache completely
- Chrome: Settings → Privacy → Clear browsing data → Cached images and files
- Then restart the browser

The schema is correct - it's just cached in the browser.
