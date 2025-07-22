// Twitch Now - Minimal Service Worker for Manifest V3
// Contains only essential background functionality

// Service worker global context
const bgApp = {};
bgApp.notificationIds = {};

// Storage helpers using chrome.storage.local (async)
bgApp.get = async function(key) {
  return new Promise(resolve => {
    chrome.storage.local.get([key], result => {
      resolve(result[key]);
    });
  });
};

bgApp.set = async function(key, val) {
  return new Promise(resolve => {
    chrome.storage.local.set({[key]: val}, () => {
      resolve();
    });
  });
};

bgApp.del = async function(...keys) {
  return new Promise(resolve => {
    chrome.storage.local.remove(keys, () => {
      resolve();
    });
  });
};

// Badge management
bgApp.setBadge = function(text) {
  text += "";
  text = text === "0" ? "" : text;
  chrome.action.setBadgeText({
    text: text
  });
};

bgApp.clearBadge = function() {
  bgApp.setBadge("");
};

// Rich notifications support check
bgApp.richNotificationsSupported = function() {
  return chrome.notifications && chrome.notifications.create;
};

// Notification listeners
bgApp.bindNotificationListeners = function() {
  if (bgApp.richNotificationsSupported()) {
    chrome.notifications.onClicked.addListener(function(notificationId) {
      const streamData = bgApp.notificationIds[notificationId];
      if (streamData) {
        // Open stream in new tab
        chrome.tabs.create({
          url: `https://www.twitch.tv/${streamData.name}`
        });
      }
      chrome.notifications.clear(notificationId);
    });

    chrome.notifications.onClosed.addListener(function(notificationId, byUser) {
      delete bgApp.notificationIds[notificationId];
    });
  }
};

// Download image as blob for notifications
bgApp.downloadImageAsBlob = async function(url, type) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('Failed to download image:', err);
    return chrome.runtime.getURL("common/icons/64_1.png");
  }
};

// Send desktop notifications for new streams
bgApp.sendNotification = async function(streamList) {
  if (!bgApp.richNotificationsSupported() || !streamList || streamList.length === 0) {
    return;
  }

  const displayCount = await bgApp.get("notifyCount") || 3;
  const defaultIcon = chrome.runtime.getURL("common/icons/64_1.png");
  const streamsToShow = streamList.slice(0, displayCount);
  const streamsOther = streamList.slice(displayCount);

  let delay = 0;
  
  // Show individual notifications for first few streams
  for (let i = 0; i < streamsToShow.length; i++) {
    const stream = streamsToShow[i];
    const notificationId = `TwitchNow.Notification.${Date.now()}.${i}`;
    
    let iconUrl = defaultIcon;
    try {
      if (stream.profile_image_url) {
        iconUrl = await bgApp.downloadImageAsBlob(stream.profile_image_url, "image/png");
      }
    } catch (e) {
      // Use default icon if download fails
    }

    const opt = {
      type: "basic",
      title: stream.name,
      message: `${stream.game_name || 'Just Chatting'}\n${stream.title || 'No title'}`,
      iconUrl: iconUrl
    };

    bgApp.notificationIds[notificationId] = stream;
    
    setTimeout(() => {
      chrome.notifications.create(notificationId, opt);
    }, delay);
    
    delay += 1000;
  }

  // Show summary notification for remaining streams
  if (streamsOther.length > 0) {
    const notificationId = `TwitchNow.Notification.${Date.now()}.summary`;
    const streamNames = streamsOther.map(s => s.name).slice(0, 3);
    
    let message;
    if (streamsOther.length > 3) {
      message = `${streamNames.slice(0, 2).join('\n')}\nand ${streamsOther.length - 2} more streamers are live`;
    } else {
      message = streamNames.join('\n');
    }

    const opt = {
      type: "basic", 
      title: "Twitch Now",
      message: message,
      iconUrl: defaultIcon
    };

    setTimeout(() => {
      chrome.notifications.create(notificationId, opt);
    }, delay);
  }
};

// Basic stream monitoring
bgApp.checkForNewStreams = async function() {
  try {
    // Send message to popup to trigger stream check
    chrome.runtime.sendMessage({
      type: 'CHECK_STREAMS'
    });
  } catch (err) {
    console.error('Failed to check for new streams:', err);
  }
};

// Periodic checking using chrome.alarms
bgApp.startPeriodicChecking = function() {
  chrome.alarms.create('checkStreams', {
    delayInMinutes: 1,
    periodInMinutes: 5 // Check every 5 minutes
  });
};

// Initialize service worker
bgApp.init = function() {
  console.log('Twitch Now service worker starting...');
  bgApp.clearBadge();
  bgApp.bindNotificationListeners();
  bgApp.startPeriodicChecking();
};

// Event listeners - must be registered at top level
chrome.runtime.onStartup.addListener(() => {
  bgApp.init();
});

chrome.runtime.onInstalled.addListener(() => {
  bgApp.init();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkStreams') {
    bgApp.checkForNewStreams();
  }
});

// Message handling from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'GET_LIVE_STREAMS':
      // Popup is requesting current stream data
      // Service worker doesn't maintain stream data, popup handles this
      sendResponse({status: 'ok'});
      break;
      
    case 'STREAMS_UPDATED':
      // Popup is informing us of updated stream data
      const { liveCount, newStreams } = message;
      bgApp.setBadge(liveCount);
      
      if (newStreams && newStreams.length > 0) {
        bgApp.sendNotification(newStreams);
      }
      break;
      
    case 'SET_BADGE':
      bgApp.setBadge(message.text);
      break;
      
    case 'CLEAR_BADGE':
      bgApp.clearBadge();
      break;
      
    case 'SEND_NOTIFICATION':
      if (message.streams && message.streams.length > 0) {
        bgApp.sendNotification(message.streams);
      }
      break;
      
    case 'IS_AUTHORIZED':
      // Check if OAuth is authorized
      if (typeof twitchOauth !== 'undefined') {
        twitchOauth.isAuthorized().then(authorized => {
          sendResponse({ authorized: authorized });
        }).catch(() => {
          sendResponse({ authorized: false });
        });
      } else {
        sendResponse({ authorized: false });
      }
      return true; // Keep message channel open for async response
      
    case 'AUTHORIZE':
      // Trigger OAuth authorization
      if (typeof twitchOauth !== 'undefined') {
        twitchOauth.authorize(() => {});
      }
      break;
      
    case 'REVOKE':
      // Revoke OAuth authorization
      if (typeof twitchOauth !== 'undefined') {
        twitchOauth.removeData();
      }
      break;
  }
});

// Initialize on load
bgApp.init();