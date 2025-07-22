(function (){
  var root = this
    , OPERA = "opera"
    , CHROME = "chrome"
    , FIREFOX = "firefox"
    ;

  var isFirefox = !!root.browser;
  var _browser = chrome;

  var that = {};

  var detectRealBrowser = function (){
    // Guard navigator access for service worker compatibility
    if (typeof navigator !== 'undefined' && navigator.userAgent) {
      var ua = navigator.userAgent;

      if ( /opera|opr/i.test(ua) ) {
        return OPERA;
      }
      else if ( /chrome|crios|crmo/i.test(ua) ) {
        return CHROME;
      }
      else if ( /firefox|iceweasel/i.test(ua) ) {
        return FIREFOX;
      }
    }
    // Default to Chrome for service worker context (Manifest V3 only)
    return CHROME;
  }

  var rbrowser = that.rbrowser = detectRealBrowser();

  var _tabs = that.tabs = {};

  _tabs.create = function (opts){
    _browser.tabs.create({url: opts.url});
  }

  _tabs.update = function (tabId, opts){
    _browser.tabs.update(tabId, opts);
  }

  _tabs.query = function (opts, callback){
    _browser.tabs.query(opts, callback);
  }

  var _windows = that.windows = {};

  _windows.create = function (opts){
    var defaults = {url: opts.url, type: "popup"};
    if ( !isFirefox ) {
      defaults.focused = true;
    }
    _browser.windows.create(defaults);
  }

  var _browserAction = that.browserAction = {};

  _browserAction.setBadgeText = function (opts){
    _browser.browserAction.setBadgeText({
      text: opts.text
    })
  }

  _browserAction.setBadgeBackgroundColor = function(color){
    _browser.browserAction.setBadgeBackgroundColor(color);
  }

  var _i18n = that.i18n = {};

  _i18n.getMessage = function (id){
    return _browser.i18n.getMessage(id);
  }

  var _runtime = that.runtime = {};

  _runtime.getURL = function (str){
    return _browser.runtime.getURL(str);
  }

  _runtime.getVersion = function (){
    _browser.runtime.getManifest().version;
  }

  _runtime.sendMessage = function (type, args){
    _browser.runtime.sendMessage({type: type, args: args});
  }

  var notifications = that.notifications = {};

  notifications.richNotificationsSupported = function (){
    return _browser.notifications && _browser.notifications.create;
  }

  that._getBackgroundPage = function (){
    console.log('[DEBUG] _getBackgroundPage called');
    console.log('[DEBUG] _ available:', typeof _);
    console.log('[DEBUG] Backbone available:', typeof Backbone);
    console.log('[DEBUG] Backbone.Events available:', typeof Backbone.Events);
    
    // Manifest V3 - create a proxy object for service worker communication
    var backgroundProxy = {
      // Create proxy objects for background functions
      bgApp: {
        setBadge: function(text) {
          chrome.runtime.sendMessage({ type: 'SET_BADGE', text: text });
        },
        clearBadge: function() {
          chrome.runtime.sendMessage({ type: 'CLEAR_BADGE' });
        },
        sendNotification: function(streams) {
          chrome.runtime.sendMessage({ type: 'SEND_NOTIFICATION', streams: streams });
        }
      },
      // Proxy for twitchApi - make it compatible with existing popup code
      twitchApi: _.extend({
        isAuthorized: function() {
          console.log('[DEBUG] twitchApi.isAuthorized() called');
          return new Promise((resolve) => {
            chrome.runtime.sendMessage({ type: 'IS_AUTHORIZED' }, (response) => {
              console.log('[DEBUG] IS_AUTHORIZED response:', JSON.stringify(response, null, 0));
              resolve(response.authorized);
            });
          });
        },
        authorize: function() {
          console.log('[DEBUG] twitchApi.authorize() called, sending AUTHORIZE message to service worker');
          console.log('[DEBUG] this object in authorize - has trigger method:', typeof this.trigger);
          chrome.runtime.sendMessage({ type: 'AUTHORIZE' }, (response) => {
            console.log('[DEBUG] AUTHORIZE message response:', JSON.stringify(response, null, 0));
          });
          
          // After sending authorize message, we should listen for completion
          // and trigger the authorize event for the popup
          let pollCount = 0;
          const maxPolls = 30; // Poll for 30 seconds max
          const pollForAuth = () => {
            pollCount++;
            console.log('[DEBUG] Polling for authorization... (attempt ' + pollCount + '/' + maxPolls + ')');
            console.log('[DEBUG] this context in poll - has trigger method:', typeof this.trigger);
            this.isAuthorized().then((authorized) => {
              console.log('[DEBUG] Polling auth status result:', JSON.stringify(authorized, null, 0));
              if (authorized) {
                console.log('[DEBUG] Authorization successful! Triggering authorize event');
                console.log('[DEBUG] About to call this.trigger with:', JSON.stringify('authorize', null, 0));
                this.trigger('authorize');
                console.log('[DEBUG] authorize event triggered');
                
                // Update stream collections after authorization
                if (backgroundProxy.following && backgroundProxy.following.update) {
                  console.log('[DEBUG] Triggering following streams update after auth');
                  backgroundProxy.following.update();
                } else {
                  console.log('[DEBUG] backgroundProxy.following or update not available:', JSON.stringify({following: !!backgroundProxy.following, update: !!(backgroundProxy.following && backgroundProxy.following.update)}, null, 0));
                }
              } else if (pollCount < maxPolls) {
                // Keep polling for a short time
                console.log('[DEBUG] Auth not complete yet, continuing to poll... (attempt ' + pollCount + '/' + maxPolls + ')');
                setTimeout(pollForAuth, 1000);
              } else {
                console.log('[DEBUG] Max polling attempts reached, giving up');
              }
            }).catch((error) => {
              console.error('[DEBUG] Error polling auth status:', JSON.stringify(error, null, 0));
              if (pollCount < maxPolls) {
                setTimeout(pollForAuth, 1000);
              }
            });
          };
          
          // Start polling after a short delay to allow service worker to process
          setTimeout(pollForAuth, 2000);
        },
        revoke: function() {
          console.log('[DEBUG] twitchApi.revoke() called');
          chrome.runtime.sendMessage({ type: 'REVOKE' }, (response) => {
            console.log('[DEBUG] REVOKE response:', JSON.stringify(response, null, 0));
          });
        },
        // Add other properties that popup code expects
        token: '',
        userName: '',
        userId: '',
        clientId: '',
        basePath: "https://api.twitch.tv/helix",
        timeout: 10 * 1000
      }, Backbone.Events),
      // Add Backbone collections that popup views expect
      notifications: new Backbone.Collection(),
      followedgames: new Backbone.Collection(),
      followedChannels: new Backbone.Collection(),
      topstreams: new Backbone.Collection(),
      videos: new Backbone.Collection(),
      search: new Backbone.Collection(),
      games: new Backbone.Collection(),
      settings: new Backbone.Collection(),
      contributors: new Backbone.Collection(),
      toppedgames: new Backbone.Collection(),
      liveStreams: new Backbone.Collection(),
      featuredStreams: new Backbone.Collection(),
      gameStreams: new Backbone.Collection(),
      gameVideos: new Backbone.Collection(),
      following: _.extend(new Backbone.Collection(), {
        update: function() {
          console.log('[DEBUG] following collection update() called');
          console.log('[DEBUG] this in update - has trigger method:', typeof this.trigger);
          // In the real app, this would make API calls to get followed streams
          // For now, we'll send a message to service worker to handle this
          chrome.runtime.sendMessage({ 
            type: 'GET_FOLLOWED_STREAMS' 
          }, (response) => {
            console.log('[DEBUG] GET_FOLLOWED_STREAMS response:', JSON.stringify(response, null, 0));
            
            // Parse response and add streams to collection
            if (response && response.status === 'ok' && response.streams) {
              console.log('[DEBUG] Adding', response.streams.length, 'streams to collection');
              
              // Clear existing models and add new ones - this should automatically trigger render
              this.reset(response.streams);
              console.log('[DEBUG] Collection after reset:', this.length, 'streams');
            } else {
              console.log('[DEBUG] No streams in response or error occurred');
              this.reset([]); // Clear collection if no streams
            }
            
            console.log('[DEBUG] Collection reset completed, should trigger render automatically');
          });
        }
      }),
      appControl: new Backbone.Model(),
      gameLobby: new Backbone.Model(),
      user: new Backbone.Model()
    };
    
    console.log('[DEBUG] Created backgroundProxy:', JSON.stringify(backgroundProxy, null, 0));
    console.log('[DEBUG] twitchApi proxy:', JSON.stringify(backgroundProxy.twitchApi, null, 0));
    console.log('[DEBUG] twitchApi has _listenId?', '_listenId' in backgroundProxy.twitchApi);
    console.log('[DEBUG] twitchApi properties:', JSON.stringify(Object.getOwnPropertyNames(backgroundProxy.twitchApi)));
    
    // Log all collections
    console.log('[DEBUG] notifications collection:', JSON.stringify(backgroundProxy.notifications, null, 0));
    console.log('[DEBUG] followedgames collection:', JSON.stringify(backgroundProxy.followedgames, null, 0));
    console.log('[DEBUG] followedChannels collection:', JSON.stringify(backgroundProxy.followedChannels, null, 0));
    console.log('[DEBUG] topstreams collection:', JSON.stringify(backgroundProxy.topstreams, null, 0));
    console.log('[DEBUG] videos collection:', JSON.stringify(backgroundProxy.videos, null, 0));
    console.log('[DEBUG] search collection:', JSON.stringify(backgroundProxy.search, null, 0));
    console.log('[DEBUG] games collection:', JSON.stringify(backgroundProxy.games, null, 0));
    console.log('[DEBUG] settings collection:', JSON.stringify(backgroundProxy.settings, null, 0));
    console.log('[DEBUG] contributors collection:', JSON.stringify(backgroundProxy.contributors, null, 0));
    
    return backgroundProxy;
  }

  that.getConstants = function (){
    return root.constants;
  }

  root.utils = that;

}).call(this);