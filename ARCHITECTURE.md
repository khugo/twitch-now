# Twitch Now - Architecture

Chrome extension for Twitch stream tracking using Manifest V3 service worker architecture.

## Core Components

### Service Worker (`chrome/service-worker.js`)
- **Purpose**: Background API calls, badge updates, notifications
- **APIs**: Twitch Helix API, Chrome storage/alarms/notifications
- **Data**: Minimal state, persistent storage only
- **Communication**: Message passing with popup

### Popup (`common/html/popup.html`)
- **Purpose**: User interface for browsing streams/settings  
- **Framework**: Backbone.js + jQuery MVC
- **Lifecycle**: Created/destroyed on icon clicks
- **Communication**: Proxy system to service worker

### Content Script (`common/content/theatre-mode.js`)
- **Purpose**: Twitch page integration (theatre mode)
- **Injection**: All twitch.tv pages

## Build System

**Popup Bundle** (`gulpfile.js`):
```
onerror.js → utils.js → jquery → backbone → handlebars → popup.js → routes.js → init.js
```

**Service Worker Bundle**:
```  
constants.js → eventemitter → oauth2-sw.js → twitch-api-sw.js → service-worker.js
```

## Communication Pattern

**Popup ↔ Service Worker**:
```javascript
// Popup requests data
chrome.runtime.sendMessage({type: 'GET_FOLLOWED_STREAMS'}, callback);

// Service worker responds  
sendResponse({status: 'ok', streams: data});
```

**Background Proxy** (`utils.js`):
- Creates service worker proxies in popup context
- Backbone collections mirror service worker data
- Handles async message passing transparently

## Data Flow

1. **Service Worker**: Periodic API calls via `chrome.alarms`  
2. **Service Worker**: Update badge, send notifications
3. **Popup**: Request data via message passing on open
4. **Popup**: Render using Backbone views
5. **Settings**: Synchronized via `chrome.storage.local`

## Key APIs

### Twitch Integration (`twitch-api-sw.js`)
- `/streams/followed` - User's streams
- `/streams` - Top streams
- `/games/top` - Games  
- `/search/channels` - Search
- Token management + refresh

### OAuth (`oauth2-sw.js`)
- `chrome.identity.launchWebAuthFlow()`
- Secure token storage
- Automatic expiration handling

## Architecture Patterns

### Error Handling
```javascript
bgApp.handleAuthError = function(error) {
  if (error.message.includes('401')) {
    // Centralized token expiration logic
    twitchOauth.removeData();
    bgApp.clearBadge(); 
    chrome.runtime.sendMessage({type: 'AUTH_EXPIRED'});
    return true;
  }
  return false;
};
```

### Service Worker Messages
```javascript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'GET_FOLLOWED_STREAMS':
      twitchApi.getFollowedStreams((error, data) => {
        if (bgApp.handleAuthError(error)) return;
        sendResponse({status: 'ok', streams: data.data});
      });
      return true; // Keep channel open
  }
});
```

### Popup Proxy System  
```javascript
// utils.js creates SW proxies
twitchApi: {
  isAuthorized: () => new Promise(resolve => 
    chrome.runtime.sendMessage({type: 'IS_AUTHORIZED'}, resolve)
  )
},
following: new Backbone.Collection() // Synced with SW data
```

## File Structure

```
chrome/
├── manifest.json          # Manifest V3 config
├── service-worker.js      # Background logic
└── common/lib/constants.js

common/
├── html/popup.html        # Main UI
├── dist/                  # Built bundles
│   ├── popup.comb.js     
│   └── popup.comb.css
├── lib/
│   ├── popup.js          # Main popup logic  
│   ├── utils.js          # Background proxy
│   ├── *-sw.js           # Service worker modules
│   └── 3rd/              # Dependencies
└── content/theatre-mode.js
```