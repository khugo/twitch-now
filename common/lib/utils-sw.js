// Service Worker compatible utilities
(function() {
  const that = {};
  const CHROME = "chrome";
  
  // Browser detection (Chrome only for Manifest V3)
  that.rbrowser = CHROME;

  // Chrome extension APIs wrappers
  const _browserAction = that.browserAction = {};
  _browserAction.setBadgeText = function(opts) {
    if (chrome.action && chrome.action.setBadgeText) {
      chrome.action.setBadgeText(opts);
    }
  };

  const _runtime = that.runtime = {};
  _runtime.getURL = function(path) {
    return chrome.runtime.getURL(path);
  };

  const _notifications = that.notifications = {};
  _notifications.richNotificationsSupported = function() {
    return !!(chrome.notifications && chrome.notifications.create);
  };

  // Make utils available globally
  if (typeof self !== 'undefined') {
    self.utils = that;
  }

}).call(this);