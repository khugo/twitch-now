// Twitch Now - Minimal Service Worker for Manifest V3
// Contains only essential background functionality

console.log('[SW] Service Worker script loaded');
console.log('[SW] Self:', JSON.stringify(self, null, 0));
console.log('[SW] Chrome available:', typeof chrome);

// Service worker global context
const bgApp = {};
bgApp.notificationIds = {};

console.log('[SW] bgApp initialized:', JSON.stringify(bgApp, null, 0));

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
    // Send message to popup to trigger stream check (if popup is open)
    chrome.runtime.sendMessage({
      type: 'CHECK_STREAMS'
    }, (response) => {
      if (chrome.runtime.lastError) {
        // Popup probably closed, ignore the error
        console.log('[SW] Popup not available for stream check');
      }
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

// Initialize OAuth adapter
console.log('[SW] Creating minimal twitchOauth adapter');
const twitchOauth = OAuth2.addAdapter({
  id: 'twitch',
  opts: constants.twitchApi,
  codeflow: {
    method: "POST",
    url: "https://api.twitch.tv/kraken/oauth2/token"
  }
});
console.log('[SW] twitchOauth created:', typeof twitchOauth);

// Initialize TwitchApi instance
console.log('[SW] Creating TwitchApi instance');
const twitchApi = new TwitchApi(constants.twitchApi.client_id);
console.log('[SW] TwitchApi instance created:', typeof twitchApi);

// Initialize service worker
bgApp.init = function() {
  console.log('[SW] Twitch Now service worker starting...');
  console.log('[SW] Initializing badge, notifications, and periodic checking');
  bgApp.clearBadge();
  bgApp.bindNotificationListeners();
  bgApp.startPeriodicChecking();
  console.log('[SW] Service worker initialization complete');
};

// Event listeners - must be registered at top level
console.log('[SW] Registering event listeners...');

chrome.runtime.onStartup.addListener(() => {
  console.log('[SW] onStartup fired');
  bgApp.init();
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('[SW] onInstalled fired');
  bgApp.init();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log('[SW] Alarm fired:', JSON.stringify(alarm, null, 0));
  if (alarm.name === 'checkStreams') {
    bgApp.checkForNewStreams();
  }
});

// Message handling from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[SW] Message received:', JSON.stringify(message, null, 0));
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
      console.log('[SW] IS_AUTHORIZED request received');
      console.log('[SW] twitchOauth available:', typeof twitchOauth);
      if (typeof twitchOauth !== 'undefined') {
        console.log('[SW] Calling twitchOauth.isAuthorized()');
        twitchOauth.isAuthorized().then(authorized => {
          console.log('[SW] twitchOauth.isAuthorized() result:', JSON.stringify(authorized, null, 0));
          sendResponse({ authorized: authorized });
        }).catch((error) => {
          console.log('[SW] twitchOauth.isAuthorized() error:', JSON.stringify(error, null, 0));
          sendResponse({ authorized: false });
        });
      } else {
        console.log('[SW] twitchOauth not available, returning false');
        sendResponse({ authorized: false });
      }
      return true; // Keep message channel open for async response
      
    case 'AUTHORIZE':
      // Trigger OAuth authorization
      console.log('[SW] AUTHORIZE message received');
      console.log('[SW] twitchOauth available:', typeof twitchOauth);
      console.log('[SW] twitchOauth object:', JSON.stringify(twitchOauth, null, 0));
      if (typeof twitchOauth !== 'undefined') {
        console.log('[SW] Calling twitchOauth.authorize() with callback');
        twitchOauth.authorize((error, tokenData) => {
          console.log('[SW] twitchOauth.authorize() callback called');
          console.log('[SW] error:', JSON.stringify(error, null, 0));
          console.log('[SW] tokenData:', JSON.stringify(tokenData, null, 0));
          if (!error && tokenData) {
            console.log('[SW] Authorization successful, token saved');
          } else {
            console.log('[SW] Authorization failed or cancelled');
          }
        });
        console.log('[SW] twitchOauth.authorize() call completed');
      } else {
        console.log('[SW] twitchOauth not available - OAuth not initialized');
      }
      break;
      
    case 'REVOKE':
      // Revoke OAuth authorization
      console.log('[SW] REVOKE message received');
      if (typeof twitchOauth !== 'undefined') {
        console.log('[SW] Calling twitchOauth.removeData()');
        twitchOauth.removeData();
        console.log('[SW] OAuth data removed');
      } else {
        console.log('[SW] twitchOauth not available for revoke');
      }
      break;
      
    case 'GET_FOLLOWED_STREAMS':
      // Handle followed streams request
      console.log('[SW] GET_FOLLOWED_STREAMS message received');
      
      // First get the OAuth token and set it on TwitchApi
      twitchOauth.getAccessToken().then(accessToken => {
        console.log('[SW] Retrieved access token:', accessToken ? 'found' : 'not found');
        if (accessToken) {
          twitchApi.setToken(accessToken);
          console.log('[SW] Set token on TwitchApi, calling getFollowedStreams');
          
          // Use the real TwitchApi to get followed streams
          twitchApi.getFollowedStreams((error, data) => {
            if (error) {
              console.log('[SW] GET_FOLLOWED_STREAMS error:', JSON.stringify(error, null, 0));
              sendResponse({
                status: 'error',
                error: error.message || 'Failed to get followed streams'
              });
            } else {
              console.log('[SW] GET_FOLLOWED_STREAMS success, streams count:', data && data.data ? data.data.length : 0);
              sendResponse({
                status: 'ok',
                streams: data && data.data ? data.data : [],
                total: data && data.total ? data.total : 0
              });
            }
          });
        } else {
          console.log('[SW] No access token available');
          sendResponse({
            status: 'error',
            error: 'Not authorized - no access token'
          });
        }
      }).catch(error => {
        console.log('[SW] Error getting access token:', JSON.stringify(error, null, 0));
        sendResponse({
          status: 'error',
          error: 'Failed to get access token'
        });
      });
      return true; // Keep sendResponse available for async response
      break;
      
    case 'GET_TOP_GAMES':
      // Handle top games request
      console.log('[SW] GET_TOP_GAMES message received');
      
      // Get OAuth token and call TwitchApi
      twitchOauth.getAccessToken().then(accessToken => {
        console.log('[SW] Retrieved access token for games:', accessToken ? 'found' : 'not found');
        if (accessToken) {
          twitchApi.setToken(accessToken);
          console.log('[SW] Set token on TwitchApi, calling getTopGames');
          
          // Use the TwitchApi to get top games
          twitchApi.getTopGames((error, data) => {
            if (error) {
              console.log('[SW] GET_TOP_GAMES error:', JSON.stringify(error, null, 0));
              sendResponse({
                status: 'error',
                error: error.message || 'Failed to get top games'
              });
            } else {
              console.log('[SW] GET_TOP_GAMES success, games count:', data && data.data ? data.data.length : 0);
              sendResponse({
                status: 'ok',
                games: data && data.data ? data.data : [],
                total: data && data.total ? data.total : 0
              });
            }
          });
        } else {
          console.log('[SW] No access token available for games');
          sendResponse({
            status: 'error',
            error: 'Not authorized - no access token'
          });
        }
      }).catch(error => {
        console.log('[SW] Error getting access token for games:', JSON.stringify(error, null, 0));
        sendResponse({
          status: 'error',
          error: 'Failed to get access token'
        });
      });
      return true; // Keep sendResponse available for async response
      break;
      
    case 'GET_GAME_STREAMS':
      // Handle game streams request
      console.log('[SW] GET_GAME_STREAMS message received for gameId:', message.gameId);
      
      // Get OAuth token and call TwitchApi
      twitchOauth.getAccessToken().then(accessToken => {
        console.log('[SW] Retrieved access token for game streams:', accessToken ? 'found' : 'not found');
        if (accessToken) {
          twitchApi.setToken(accessToken);
          console.log('[SW] Set token on TwitchApi, calling getGameStreams');
          
          // Use the TwitchApi to get streams for the game
          twitchApi.getGameStreams(message.gameId, (error, data) => {
            if (error) {
              console.log('[SW] GET_GAME_STREAMS error:', JSON.stringify(error, null, 0));
              sendResponse({
                status: 'error',
                error: error.message || 'Failed to get game streams'
              });
            } else {
              console.log('[SW] GET_GAME_STREAMS success, streams count:', data && data.data ? data.data.length : 0);
              sendResponse({
                status: 'ok',
                streams: data && data.data ? data.data : [],
                total: data && data.total ? data.total : 0
              });
            }
          });
        } else {
          console.log('[SW] No access token available for game streams');
          sendResponse({
            status: 'error',
            error: 'Not authorized - no access token'
          });
        }
      }).catch(error => {
        console.log('[SW] Error getting access token for game streams:', JSON.stringify(error, null, 0));
        sendResponse({
          status: 'error',
          error: 'Failed to get access token'
        });
      });
      return true; // Keep sendResponse available for async response
      break;
  }
});

// Initialize on load
console.log('[SW] Calling bgApp.init() on load');
bgApp.init();
console.log('[SW] Service worker script execution complete');;