# Chrome Manifest V3 - Clean Migration Strategy

*Technical implementation guide based on migration attempt learnings*

## Critical Learnings Summary

**Key Insight**: Current service worker contains ~1,800 lines of code, but only ~200 lines need background execution. 90% is UI logic that should run in popup context.

**Strategy**: Create minimal service worker + enhanced popup instead of trying to make complex UI code work in service worker context.

## Specific Issues Encountered & Solutions

### 1. Multi-Browser Support Removal
**Problem**: Firefox/Opera support adds complexity  
**Solution**: Remove `firefox/` and `opera/` directories entirely. Update gulpfile.js to remove all Firefox/Opera build tasks.
```javascript
// Remove these tasks from gulpfile.js:
// gulp.task('firefox', ...)
// gulp.task('opera', ...)  
// gulp.task('copy:firefox', ...)
// gulp.task('copy:opera', ...)
```

### 2. Service Worker Registration Failures
**Errors Encountered**: 
- "createElement is not defined" 
- "_ is not defined"
- "Backbone is not defined"
- "window is not defined"
- "Audio is not defined"

**Root Cause**: Trying to run jQuery, Underscore.js, Backbone.js in service worker context

**Solution**: Don't include DOM-dependent libraries in service worker build:
```javascript
// ❌ Remove from service worker:
"common/lib/3rd/jquery.js",
"common/lib/3rd/underscore.js", 
"common/lib/3rd/backbone.js",
"common/lib/3rd/async.js",
"common/lib/3rd/backbone.memento.js",
"common/lib/3rd/backbone.mixin.js"

// ✅ Service worker should only include:
"chrome/common/lib/constants.js",
"common/dist/contributors.js",
"common/lib/3rd/eventemitter.js",
"common/lib/utils.js", 
"common/lib/oauth2.js",
"chrome/background.js",
"common/lib/twitch-api.js",
"common/lib/onerror.js",
"common/lib/app.js" // (but needs major simplification)
```

### 3. Service Worker Context Limitations
**What doesn't work in service workers**:
- `window.location.href` → Guard with `typeof window !== 'undefined'`
- `window.onerror` → Replace with `self.addEventListener('error')`
- `localStorage` → Replace with `chrome.storage.local` (async)
- `navigator.userAgent` → Replace with `chrome.runtime.getPlatformInfo()`
- `new Audio()` → Guard with `typeof Audio !== 'undefined'`
- `document.createElement()` → Not available, remove jQuery

### 4. Required Replacements Made
**Underscore.js functions → Modern JavaScript**:
```javascript
// Before → After
_.find(arr, fn) → arr.find(fn)
_.pluck(arr, 'prop') → arr.map(item => item.prop)  
_.difference(a, b) → a.filter(item => !b.includes(item))
_.union(a, b) → [...new Set([...a, ...b])]
_.extend(obj, props) → Object.assign(obj, props)
_.uniqueId('prefix') → 'prefix' + Date.now() + Math.random().toString(36).substr(2, 9)
```

**jQuery AJAX → fetch() API**:
```javascript
// Before
$.ajax({url, type, data}).always(callback)

// After  
fetch(url, {method, headers, body})
  .then(response => response.json())
  .then(data => callback(null, data))
  .catch(err => callback(err))
```

**Storage API replacement**:
```javascript
// Before (synchronous)
bgApp.get = key => localStorage[key] ? JSON.parse(localStorage[key]) : undefined
bgApp.set = (key, val) => localStorage[key] = JSON.stringify(val)

// After (asynchronous)
bgApp.get = key => new Promise(resolve => 
  chrome.storage.local.get([key], result => resolve(result[key]))
)
bgApp.set = (key, val) => new Promise(resolve => 
  chrome.storage.local.set({[key]: val}, () => resolve())
)

## Recommended Clean Implementation

### Minimal Service Worker Requirements
**Only include these functions in service worker**:
```javascript
// Essential background functions (~200 lines total)
const bgApp = {
  // Storage (chrome.storage.local wrappers)
  async get(key), async set(key, val), async del(...keys),
  
  // Notifications  
  async sendNotification(streams),
  bindNotificationListeners(),
  
  // Badge management
  setBadge(count), clearBadge(),
  
  // Stream monitoring
  async checkForNewStreams(),
  startPeriodicChecking()
};

// Twitch API client (minimal)  
const twitchApi = {
  token: '',
  async getFollowedStreams(),
  isAuthorized()
};

// OAuth2 adapter (minimal)
const twitchOauth = OAuth2.addAdapter({...});
```

### Manifest V3 Changes Required
```json
{
  "manifest_version": 3,
  "background": {
    "service_worker": "background.js"
  },
  "action": { // instead of "browser_action"
    "default_popup": "common/html/popup.html"
  },
  "permissions": [
    "storage", "notifications", "tabs"  // remove "background"
  ],
  "host_permissions": [  // move from "permissions"
    "*://*.twitch.tv/*",
    "*://ndragomirov.github.io/*"
  ],
  "minimum_chrome_version": "88"
}
```

### Build System Updates
```javascript
// Update gulpfile.js
gulp.task('concat:serviceworker', function () {
  return gulp.src([
    // ONLY service worker compatible files
    "chrome/common/lib/constants.js",
    "common/dist/contributors.js", 
    "common/lib/3rd/eventemitter.js",
    "common/lib/utils.js",           // (simplified)
    "common/lib/oauth2.js",          // (with fetch instead of jQuery)
    "chrome/background.js",
    "common/lib/twitch-api.js",      // (simplified)  
    "common/lib/onerror.js",         // (service worker error handling)
    "common/lib/minimal-app.js"      // (NEW: only essential functions)
  ])
  .pipe(concat('background.js'))
  .pipe(gulp.dest('build/chrome/'));
});

## Files That Need Service Worker Compatibility Fixes

### `common/lib/utils.js`
```javascript
// Current issue: uses navigator.userAgent
// Fix: Replace browser detection with Chrome-only constant
var rbrowser = that.rbrowser = CHROME;  // Remove detectRealBrowser()
```

### `common/lib/oauth2.js` 
```javascript
// Current issues: jQuery AJAX, window.location
// Fixes needed:
// 1. Replace $.ajax with fetch() (already implemented)
// 2. Guard window access: if (typeof window !== 'undefined' && window.location)
```

### `common/lib/onerror.js`
```javascript
// Current issue: window.onerror, window.navigator
// Fix: Replace with service worker error handling
self.addEventListener('error', function(event) {
  var msg = event.message || 'Unknown error';
  console.error(msg + " in " + (event.filename || 'unknown'));
});
```

### `common/lib/app.js`
**Major simplification needed**. Current file has these issues:

**Remove from service worker** (move to popup):
- All Backbone Model/Collection definitions (User, Control, Settings, Game, etc.)
- Complex data processing logic
- UI-specific event handlers
- Settings management UI logic

**Keep in service worker** (minimal version):
- `bgApp.sendNotification()` - Desktop notifications
- `bgApp.setBadge()` / `bgApp.clearBadge()` - Badge management
- `bgApp.bindNotificationListeners()` - Handle notification clicks  
- `bgApp.get()` / `bgApp.set()` / `bgApp.del()` - Storage helpers
- Basic stream monitoring logic

### `common/lib/twitch-api.js`
```javascript
// Current issue: _.extend(this, Backbone.Events)
// Fix: Replace with simple event system
this._events = {};
this.on = (event, callback) => { /* simple implementation */ };
this.trigger = (event, ...args) => { /* simple implementation */ };
```

## Critical Implementation Notes

### What Causes "Service worker registration failed. Status code: 15"
This error means JavaScript execution failed in the service worker. Common causes:
1. Undefined global variables (_, Backbone, window, document, Audio)
2. DOM API calls from included libraries
3. Synchronous APIs that don't exist in service worker context

### Debugging Strategy
1. **Build incrementally** - Add one file at a time to service worker build
2. **Check Chrome DevTools** - Service Worker panel shows exact error location  
3. **Use console.log** - Verify service worker actually loads and runs
4. **Test in isolation** - Create minimal test service worker first

### Testing Checklist
- [ ] Service worker registers without errors (no status code 15)
- [ ] Extension badge shows correct count
- [ ] Desktop notifications appear for new streams
- [ ] Notification clicks open correct stream
- [ ] Settings persist between browser sessions
- [ ] OAuth authentication maintains token
- [ ] Popup can communicate with service worker

## Service Worker vs Popup Separation

### Service Worker (Background) - Keep Minimal
**Purpose**: Persistent background monitoring and notifications
```javascript
// Only essential background functions
- Stream monitoring (poll Twitch API every N minutes)
- Desktop notifications (chrome.notifications.create)
- Badge management (chrome.action.setBadgeText)
- Storage helpers (chrome.storage.local wrappers)
- OAuth token persistence
```

### Popup Context - Full Functionality  
**Purpose**: Rich UI with full browser API access
```javascript
// All complex UI logic moves here
- jQuery, Underscore, Backbone (full libraries available)
- Audio notifications (Audio API available)
- Complex data models (User, Game, Stream, Settings)
- UI event handling and data processing
- Settings management interface
```

## Communication Pattern
```javascript
// Service worker → Popup (when streams change)
chrome.runtime.sendMessage({
  type: 'STREAMS_UPDATED',
  liveCount: 3,
  newStreams: [...]
});

// Popup → Service worker (get current data)
chrome.runtime.sendMessage({type: 'GET_LIVE_STREAMS'}, response => {
  // Update UI with response.streams
});
```

## Key Implementation Rule

**If it's not essential for background operation, move it to popup context.**

Examples:
- ❌ Service worker: Complex Backbone models for UI display
- ✅ Service worker: Simple notification when new stream detected
- ❌ Service worker: Audio playback for notifications  
- ✅ Popup: Audio notifications when popup is open
- ❌ Service worker: Settings UI management
- ✅ Service worker: Read settings for notification preferences

This separation eliminates ~90% of service worker complexity and compatibility issues.