// Twitch Now - Minimal Service Worker for Manifest V3
// Contains only essential background functionality

console.log('[SW] Service Worker script loaded');

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
    
    // Get access token first
    const accessToken = await twitchOauth.getAccessToken();
    if (!accessToken) {
      return;
    }
    
    // Set token and get followed streams directly from service worker
    twitchApi.setToken(accessToken);
    
    // Use callback style for better error handling
    twitchApi.getFollowedStreams(async (error, data) => {
      if (bgApp.handleAuthError(error)) return; // DRY auth handling
      if (error) {
        console.error('[SW] Error fetching followed streams in background:', error);
        return;
      }
      
      const streamCount = data && data.data ? data.data.length : 0;
      
      // Check if showBadge setting is enabled
      const settings = await bgApp.get('settings') || [];
      const showBadgeSetting = settings.find(s => s.id === 'showBadge');
      const showBadge = showBadgeSetting ? showBadgeSetting.value : true; // Default to true
      
      if (showBadge) {
        bgApp.setBadge(streamCount);
      } else {
        bgApp.clearBadge();
      }
      
      // Optionally send message to popup if it's open
      chrome.runtime.sendMessage({
        type: 'BACKGROUND_STREAMS_UPDATED',
        streamCount: streamCount,
        streams: data && data.data ? data.data : []
      }, (response) => {
        if (chrome.runtime.lastError) {
          // Popup probably closed, ignore the error
        }
      });
    });
    
  } catch (err) {
    console.error('[SW] Failed to check for new streams:', err);
  }
};

// Periodic checking using chrome.alarms
bgApp.startPeriodicChecking = function() {
  chrome.alarms.create('checkStreams', {
    delayInMinutes: 0.1, // First check in 6 seconds (0.1 minutes)
    periodInMinutes: 5 // Check every 5 minutes after that
  });
};

// Centralized auth error handler
bgApp.handleAuthError = function(error) {
  if (error && error.message && error.message.includes('401')) {
    
    // Clear the token
    if (typeof twitchOauth !== 'undefined') {
      twitchOauth.removeData();
    }
    
    // Clear badge since user is no longer authenticated
    bgApp.clearBadge();
    
    // Notify popup that authentication expired
    chrome.runtime.sendMessage({
      type: 'AUTH_EXPIRED'
    }, (response) => {
      if (chrome.runtime.lastError) {
        // Popup not available
      }
    });
    
    return true; // Indicates auth error was handled
  }
  return false; // Not an auth error
};

// Initialize OAuth adapter
const twitchOauth = OAuth2.addAdapter({
  id: 'twitch',
  opts: constants.twitchApi,
  codeflow: {
    method: "POST",
    url: "https://api.twitch.tv/kraken/oauth2/token"
  }
});

// Initialize TwitchApi instance
const twitchApi = new TwitchApi(constants.twitchApi.client_id);

// Initialize service worker
bgApp.init = function() {
  console.log('[SW] Service worker initializing...');
  
  // Don't clear badge immediately - let the stream check determine correct state
  bgApp.bindNotificationListeners();
  bgApp.startPeriodicChecking();
  
  // Perform immediate check for live streams on startup
  bgApp.checkForNewStreams();
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
        }).catch((error) => {
          sendResponse({ authorized: false });
        });
      } else {
        sendResponse({ authorized: false });
      }
      return true; // Keep message channel open for async response
      
    case 'AUTHORIZE':
      // Trigger OAuth authorization
      if (typeof twitchOauth !== 'undefined') {
        twitchOauth.authorize((error, tokenData) => {
          // Authorization complete
        });
      }
      break;
      
    case 'REVOKE':
      // Revoke OAuth authorization
      if (typeof twitchOauth !== 'undefined') {
        twitchOauth.removeData();
      }
      break;
      
    case 'GET_FOLLOWED_STREAMS':
      // Handle followed streams request
      twitchOauth.getAccessToken().then(accessToken => {
        if (accessToken) {
          twitchApi.setToken(accessToken);
          
          // Use the real TwitchApi to get followed streams
          twitchApi.getFollowedStreams((error, data) => {
            if (bgApp.handleAuthError(error)) return; // DRY auth handling
            if (error) {
              sendResponse({
                status: 'error',
                error: error.message || 'Failed to get followed streams'
              });
            } else {
              sendResponse({
                status: 'ok',
                streams: data && data.data ? data.data : [],
                total: data && data.total ? data.total : 0
              });
            }
          });
        } else {
          sendResponse({
            status: 'error',
            error: 'Not authorized - no access token'
          });
        }
      }).catch(error => {
        sendResponse({
          status: 'error',
          error: 'Failed to get access token'
        });
      });
      return true; // Keep sendResponse available for async response
      break;
      
    case 'GET_TOP_GAMES':
      // Handle top games request
      twitchOauth.getAccessToken().then(accessToken => {
        if (accessToken) {
          twitchApi.setToken(accessToken);
          
          // Use the TwitchApi to get top games
          twitchApi.getTopGames((error, data) => {
            if (bgApp.handleAuthError(error)) return; // DRY auth handling
            if (error) {
              sendResponse({
                status: 'error',
                error: error.message || 'Failed to get top games'
              });
            } else {
              sendResponse({
                status: 'ok',
                games: data && data.data ? data.data : [],
                total: data && data.total ? data.total : 0
              });
            }
          });
        } else {
          sendResponse({
            status: 'error',
            error: 'Not authorized - no access token'
          });
        }
      }).catch(error => {
        sendResponse({
          status: 'error',
          error: 'Failed to get access token'
        });
      });
      return true; // Keep sendResponse available for async response
      break;
      
    case 'GET_GAME_STREAMS':
      // Handle game streams request
      twitchOauth.getAccessToken().then(accessToken => {
        if (accessToken) {
          twitchApi.setToken(accessToken);
          
          // Use the TwitchApi to get streams for the game
          twitchApi.getGameStreams(message.gameId, (error, data) => {
            if (bgApp.handleAuthError(error)) return; // DRY auth handling
            if (error) {
              sendResponse({
                status: 'error',
                error: error.message || 'Failed to get game streams'
              });
            } else {
              sendResponse({
                status: 'ok',
                streams: data && data.data ? data.data : [],
                total: data && data.total ? data.total : 0
              });
            }
          });
        } else {
          sendResponse({
            status: 'error',
            error: 'Not authorized - no access token'
          });
        }
      }).catch(error => {
        sendResponse({
          status: 'error',
          error: 'Failed to get access token'
        });
      });
      return true; // Keep sendResponse available for async response
      break;
      
    case 'GET_TOP_STREAMS':
      // Handle top streams request
      twitchOauth.getAccessToken().then(accessToken => {
        if (accessToken) {
          twitchApi.setToken(accessToken);
          
          // Use the TwitchApi to get top streams
          twitchApi.getTopStreams((error, data) => {
            if (bgApp.handleAuthError(error)) return; // DRY auth handling
            if (error) {
              sendResponse({
                status: 'error',
                error: error.message || 'Failed to get top streams'
              });
            } else {
              sendResponse({
                status: 'ok',
                streams: data && data.data ? data.data : [],
                total: data && data.total ? data.total : 0
              });
            }
          });
        } else {
          sendResponse({
            status: 'error',
            error: 'Not authorized - no access token'
          });
        }
      }).catch(error => {
        sendResponse({
          status: 'error',
          error: 'Failed to get access token'
        });
      });
      return true; // Keep sendResponse available for async response
      break;
      
    case 'SEARCH_STREAMS':
      // Handle search streams request
      if (!message.query) {
        sendResponse({
          status: 'error',
          error: 'Search query is required'
        });
        return;
      }
      
      // Get OAuth token and call TwitchApi
      twitchOauth.getAccessToken().then(accessToken => {
        if (accessToken) {
          twitchApi.setToken(accessToken);
          
          // Use the TwitchApi to search streams
          twitchApi.searchStreams(message.query, (error, data) => {
            if (bgApp.handleAuthError(error)) return; // DRY auth handling
            if (error) {
              sendResponse({
                status: 'error',
                error: error.message || 'Failed to search streams'
              });
            } else {
              sendResponse({
                status: 'ok',
                streams: data && data.data ? data.data : [],
                total: data && data.total ? data.total : 0
              });
            }
          });
        } else {
          sendResponse({
            status: 'error',
            error: 'Not authorized - no access token'
          });
        }
      }).catch(error => {
        sendResponse({
          status: 'error',
          error: 'Failed to get access token'
        });
      });
      return true; // Keep sendResponse available for async response
      break;
      
    case 'GET_USER_INFO':
      // Handle user info request
      twitchOauth.getAccessToken().then(accessToken => {
        if (accessToken) {
          twitchApi.setToken(accessToken);
          
          // Use the TwitchApi to get user info
          twitchApi.getUserInfo((error, userData) => {
            if (bgApp.handleAuthError(error)) return; // DRY auth handling
            if (error) {
              sendResponse({
                status: 'error',
                error: error.message || 'Failed to get user info'
              });
            } else {
              sendResponse({
                status: 'ok',
                user: userData || {}
              });
            }
          });
        } else {
          sendResponse({
            status: 'error',
            error: 'Not authorized - no access token'
          });
        }
      }).catch(error => {
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
bgApp.init();;