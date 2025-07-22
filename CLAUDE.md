# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Twitch Now is a Chrome extension for tracking Twitch streams, migrated to Manifest V3 architecture. The extension uses a service worker for background operations and a popup UI with Backbone.js/jQuery.

## Build System

**Primary build command:**
```bash
npx gulp chrome
```

**Installation:**
Load the `build/chrome` directory as an unpacked extension in Chrome developer mode.

## Architecture

**Dual execution contexts:**
- **Service Worker** (`chrome/service-worker.js`): Background API calls, badge management, notifications
- **Popup** (`common/html/popup.html`): Backbone.js UI for stream browsing/settings

**Communication:** Message passing between popup and service worker using `chrome.runtime.sendMessage()`

**Key proxy system:** `common/lib/utils.js` creates service worker proxies in popup context via `utils._getBackgroundPage()`, enabling Backbone collections to seamlessly communicate with background operations.

## File Organization

**Service Worker Bundle:** Built from separate `-sw.js` files:
- `oauth2-sw.js` - OAuth implementation 
- `twitch-api-sw.js` - Twitch Helix API client
- `utils-sw.js` - Service worker utilities

**Popup Bundle:** Traditional web stack:
- `popup.js` - Main Backbone application
- `utils.js` - Background proxy system
- Third-party: jQuery, Backbone, Handlebars, Underscore

**Build outputs:**
- `build/chrome/service-worker.js` - Concatenated service worker
- `common/dist/popup.comb.js` - Concatenated popup bundle

## Authentication Flow

OAuth handled entirely in service worker using `chrome.identity.launchWebAuthFlow()`. Popup communicates auth state via message passing to service worker, which maintains tokens and handles refresh/expiration.

## Extension Development

When modifying service worker code, remember that service workers can be terminated/restarted by Chrome. All state must be persisted in `chrome.storage.local`.

Popup code uses traditional web APIs and can access DOM/window objects, but communicates with service worker for all Twitch API operations and persistent data.