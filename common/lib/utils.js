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
    var dispatcher = _.extend({}, Backbone.Events);
    var backgroundProxy = {
      dispatcher: dispatcher,
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
      topstreams: _.extend(new Backbone.Collection(), {
        update: function() {
          console.log('[DEBUG] topstreams collection update() called');
          chrome.runtime.sendMessage({ 
            type: 'GET_TOP_STREAMS' 
          }, (response) => {
            console.log('[DEBUG] GET_TOP_STREAMS response:', JSON.stringify(response, null, 0));
            
            if (response && response.status === 'ok' && response.streams) {
              console.log('[DEBUG] Adding', response.streams.length, 'top streams to collection');
              this.reset(response.streams);
              console.log('[DEBUG] Top streams collection after reset:', this.length, 'streams');
            } else {
              console.log('[DEBUG] No top streams in response or error occurred');
              this.reset([]);
            }
            
            console.log('[DEBUG] Top streams collection reset completed');
          });
        }
      }),
      videos: new Backbone.Collection(),
      search: new Backbone.Collection(),
      games: _.extend(new Backbone.Collection(), {
        update: function() {
          console.log('[DEBUG] games collection update() called');
          chrome.runtime.sendMessage({ 
            type: 'GET_TOP_GAMES' 
          }, (response) => {
            console.log('[DEBUG] GET_TOP_GAMES response:', JSON.stringify(response, null, 0));
            
            if (response && response.status === 'ok' && response.games) {
              console.log('[DEBUG] Adding', response.games.length, 'games to collection');
              this.reset(response.games);
              console.log('[DEBUG] Games collection after reset:', this.length, 'games');
            } else {
              console.log('[DEBUG] No games in response or error occurred');
              this.reset([]);
            }
            
            console.log('[DEBUG] Games collection reset completed');
          });
        }
      }),
      settings: new Backbone.Collection(),
      contributors: new Backbone.Collection(),
      toppedgames: new Backbone.Collection(),
      liveStreams: new Backbone.Collection(),
      featuredStreams: new Backbone.Collection(),
      gameStreams: _.extend(new Backbone.Collection(), {
        game: null,
        gameid: null,
        initialize: function() {
          console.log('[DEBUG] gameStreams collection initialized');
          // Listen for gameLobby:change events
          dispatcher.on("gameLobby:change", function(gameName, gameId) {
            console.log('[DEBUG] gameStreams received gameLobby:change event - game:', gameName, 'id:', gameId);
            this.game = gameName;
            this.gameid = gameId;
            this.update();
          }.bind(this));
        },
        update: function() {
          console.log('[DEBUG] gameStreams collection update() called for game:', this.game, 'id:', this.gameid);
          if (!this.gameid) {
            console.log('[DEBUG] No game ID available for gameStreams update');
            return;
          }
          
          chrome.runtime.sendMessage({ 
            type: 'GET_GAME_STREAMS',
            gameId: this.gameid
          }, (response) => {
            console.log('[DEBUG] GET_GAME_STREAMS response:', JSON.stringify(response, null, 0));
            
            if (response && response.status === 'ok' && response.streams) {
              console.log('[DEBUG] Adding', response.streams.length, 'game streams to collection');
              this.reset(response.streams);
              console.log('[DEBUG] Game streams collection after reset:', this.length, 'streams');
            } else {
              console.log('[DEBUG] No game streams in response or error occurred');
              this.reset([]);
            }
            
            console.log('[DEBUG] Game streams collection reset completed');
          });
        }
      }),
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
      gameLobby: _.extend(new Backbone.Model(), {
        lastChange: 0,
        change: function(gameName) {
          console.log('[DEBUG] gameLobby.change called with gameName:', gameName);
          
          // Find game in games or followedgames collections
          var newGame = null;
          if (backgroundProxy.games && backgroundProxy.games.find) {
            newGame = backgroundProxy.games.find(function(g) {
              return g.get && g.get('name') === gameName;
            });
          }
          
          if (!newGame && backgroundProxy.followedgames && backgroundProxy.followedgames.find) {
            newGame = backgroundProxy.followedgames.find(function(g) {
              return g.get && g.get('name') === gameName;
            });
          }
          
          if (newGame) {
            console.log('[DEBUG] Found game for gameLobby:', gameName);
            var currentTime = Date.now();
            var shouldUpdate = !this.get('game') || 
                             (newGame.get('name') !== this.get('game').name) || 
                             (currentTime - this.lastChange) > 5 * 60 * 1000;
            
            if (shouldUpdate) {
              console.log('[DEBUG] Updating gameLobby model');
              this.set(newGame.toJSON ? newGame.toJSON() : newGame.attributes);
              this.lastChange = currentTime;
              
              // Trigger dispatcher events for game lobby collections to update
              var gameId = newGame.get ? newGame.get('id') : newGame.attributes.id;
              console.log('[DEBUG] Triggering gameLobby:change event with gameName:', gameName, 'gameId:', gameId);
              dispatcher.trigger("gameLobby:change", gameName, gameId);
              console.log('[DEBUG] gameLobby model updated');
            }
          } else {
            console.log('[DEBUG] Game not found in collections:', gameName);
          }
        }
      }),
      user: new Backbone.Model()
    };
    
    // Initialize collections that have initialize methods
    if (backgroundProxy.gameStreams && backgroundProxy.gameStreams.initialize) {
      backgroundProxy.gameStreams.initialize();
    }
    
    console.log('[DEBUG] Created backgroundProxy with collections count:', {
      games: backgroundProxy.games ? backgroundProxy.games.length : 'undefined',
      gameStreams: backgroundProxy.gameStreams ? 'initialized' : 'undefined',
      following: backgroundProxy.following ? backgroundProxy.following.length : 'undefined',
      dispatcher: typeof backgroundProxy.dispatcher
    });
    console.log('[DEBUG] twitchApi proxy has methods:', {
      isAuthorized: typeof backgroundProxy.twitchApi.isAuthorized,
      authorize: typeof backgroundProxy.twitchApi.authorize,
      trigger: typeof backgroundProxy.twitchApi.trigger
    });
    
    // Log collection lengths only to avoid circular references
    console.log('[DEBUG] Collection status:', {
      notifications: backgroundProxy.notifications.length,
      games: backgroundProxy.games.length,
      following: backgroundProxy.following.length,
      gameStreams: backgroundProxy.gameStreams.length,
      topstreams: backgroundProxy.topstreams.length
    });
    
    return backgroundProxy;
  }

  that.getConstants = function (){
    return root.constants;
  }

  root.utils = that;

}).call(this);