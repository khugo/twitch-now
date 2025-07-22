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
    
    // Create a Stream model proxy with essential methods
    var StreamModel = Backbone.Model.extend({
      defaults: {
        created_at: Date.now()
      },
      
      initialize: function () {
        var channelName = this.get("user_name");
        var streamType = this.get("type");
        var isVodcast = ['rerun', 'watch_party'].includes(streamType);
        this.set({
          vodcast: isVodcast,
          name: channelName
        }, { silent: true });
      },
      
      baseUrl: function() {
        return "https://www.twitch.tv";
      },
      
      getStreamURL: function (type) {
        // Get settings from backgroundProxy
        type = type || (backgroundProxy.settings && backgroundProxy.settings.get("openStreamIn") ? 
                       backgroundProxy.settings.get("openStreamIn").get("value") : "newlayout");
        
        if (type == "html5") {
          return "http://player.twitch.tv/?channel=" + this.get("user_login") + "&html5" + "&parent=twitch-now";
        }
        var links = {
          theatrelayout: "/ID?mode=theatre",
          newlayout: "/ID",
          popout: "/ID/popout"
        };
        
        return this.baseUrl() + links[type].replace(/ID/, this.get("user_login"));
      },
      
      openStream: function (type) {
        if (type == "livestreamer") {
          // For livestreamer, just log for now since it requires complex setup
          console.log('[DEBUG] Livestreamer not implemented in MV3');
        } else {
          var url = this.getStreamURL(type);
          utils.tabs.create({ url: url });
        }
      },
      
      openChat: function () {
        var openIn = backgroundProxy.settings && backgroundProxy.settings.get("openChatIn") ? 
                    backgroundProxy.settings.get("openChatIn").get("value") : "newwindow";
        var href = this.baseUrl() + "/popout/ID/chat?popout=".replace(/ID/, this.get("user_login"));
        
        if (openIn == "newwindow") {
          utils.windows.create({ url: href, width: 400 });
        } else {
          utils.tabs.create({ url: href });
        }
      },
      
      openMultitwitch: function () {
        var self = this;
        var url = "http://multitwitch.tv";
        var updatedTabUrl;
        utils.tabs.query({}, function (tabs) {
          tabs = tabs.filter(function (t) {
            return /https*:\/\/(www\.)*multitwitch\.tv/.test(t.url);
          });
          
          if (tabs.length) {
            var tab = tabs[tabs.length - 1];
            var tabUrl = tab.url;
            updatedTabUrl = tabUrl + "/" + self.get("user_login");
            utils.tabs.update(tab.id, { url: updatedTabUrl });
          } else {
            updatedTabUrl = url + "/" + self.get("user_login");
            utils.tabs.create({ url: updatedTabUrl, active: false });
          }
        });
      }
    });
    
    // Create Badge model proxy similar to original app.js
    var BadgeModel = Backbone.Model.extend({
      defaults: {
        count: 0
      },
      
      initialize: function() {
        var self = this;
        
        // Listen for count changes and update badge
        self.on("change:count", function() {
          // Check if showBadge setting is enabled
          if (backgroundProxy.settings && backgroundProxy.settings.get("showBadge") && 
              backgroundProxy.settings.get("showBadge").get("value")) {
            console.log('[DEBUG] Badge count changed to:', self.get("count"));
            // Send STREAMS_UPDATED message to service worker
            chrome.runtime.sendMessage({
              type: 'STREAMS_UPDATED',
              liveCount: self.get("count"),
              newStreams: [] // For now, we'll handle new stream notifications separately
            });
          } else {
            // Clear badge if showBadge is disabled
            chrome.runtime.sendMessage({ type: 'CLEAR_BADGE' });
          }
        });
      },
      
      onShowBadgeChange: function(value) {
        if (value) {
          // Re-trigger badge update
          this.trigger("change:count");
        } else {
          chrome.runtime.sendMessage({ type: 'CLEAR_BADGE' });
        }
      }
    });
    
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
        model: StreamModel,
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
      search: _.extend(new Backbone.Collection(), {
        model: StreamModel,
        query: null,
        update: function() {
          console.log('[DEBUG] search collection update() called with query:', this.query);
          if (!this.query) {
            console.log('[DEBUG] No search query provided');
            this.reset([]);
            return;
          }
          
          chrome.runtime.sendMessage({ 
            type: 'SEARCH_STREAMS',
            query: this.query
          }, (response) => {
            console.log('[DEBUG] SEARCH_STREAMS response:', JSON.stringify(response, null, 0));
            
            if (response && response.status === 'ok' && response.streams) {
              console.log('[DEBUG] Adding', response.streams.length, 'search results to collection');
              this.reset(response.streams);
              console.log('[DEBUG] Search collection after reset:', this.length, 'results');
            } else {
              console.log('[DEBUG] No search results in response or error occurred');
              this.reset([]);
            }
            
            console.log('[DEBUG] Search collection reset completed');
          });
        }
      }),
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
      settings: (() => {
        // Create a proxy for the Settings collection since we can't access app.js directly
        // The actual Settings collection needs to be populated with default settings
        const settingsProxy = _.extend(new Backbone.Collection(), {
          // Add storage functionality like the original Settings collection
          saveToStorage: function() {
            chrome.storage.local.set({ 'settings': this.toJSON() });
          },
          
          getNotificationSoundSource: function() {
            var val = this.get("notificationSound").get("value");
            return val == "customsound" ? localStorage["customSound"] : val;
          }
        });
        
        // Complete default settings from app.js - maintaining full functionality
        const defaultSettings = [
          {
            id: "streamLanguage2",
            desc: "Stream Language",
            type: "select",
            select: true,
            opts: [
              { "id": "any", "name": "Any" },
              { "id": "ru", "name": "Русский" },
              { "id": "en", "name": "English" },
              { "id": "da", "name": "Dansk" },
              { "id": "de", "name": "Deutsch" },
              { "id": "es", "name": "Español" },
              { "id": "fr", "name": "Français" },
              { "id": "it", "name": "Italiano" },
              { "id": "hu", "name": "Magyar" },
              { "id": "nl", "name": "Nederlands" },
              { "id": "no", "name": "Norsk" },
              { "id": "pl", "name": "Polski" },
              { "id": "pt", "name": "Português" },
              { "id": "sk", "name": "Slovenčina" },
              { "id": "fi", "name": "Suomi" },
              { "id": "sv", "name": "Svenska" },
              { "id": "vi", "name": "Tiếng Việt" },
              { "id": "tr", "name": "Türkçe" },
              { "id": "cs", "name": "Čeština" },
              { "id": "el", "name": "Ελληνικά" },
              { "id": "bg", "name": "Български" },
              { "id": "ar", "name": "العربية" },
              { "id": "th", "name": "ภาษาไทย" },
              { "id": "zh", "name": "中文" },
              { "id": "ja", "name": "日本語" },
              { "id": "ko", "name": "한국어" },
              { "id": "asl", "name": "American Sign Language" },
              { "id": "other", "name": "Other" }
            ],
            show: true,
            value: 'any'
          },
          {
            id: "windowHeight",
            desc: "Window Height",
            range: true,
            show: false,
            type: "range",
            tip: "px",
            min: 360,
            max: 590,
            value: 590
          },
          {
            id: "defaultTab",
            desc: "Default Tab",
            type: "select",
            select: true,
            opts: [
              { id: "following", name: "Following" },
              { id: "browse", name: "Browse" },
              { id: "topstreams", name: "Top Streams" }
            ],
            show: true,
            value: "following"
          },
          {
            id: "viewSort",
            desc: "Sort Streams By",
            type: "select",
            select: true,
            opts: [
              { id: "viewer_count|1", name: "Viewers (Low to High)" },
              { id: "viewer_count|-1", name: "Viewers (High to Low)" },
              { id: "user_login|1", name: "Name (A to Z)" },
              { id: "user_login|-1", name: "Name (Z to A)" },
              { id: "game_name|1", name: "Game (A to Z)" },
              { id: "started_at|-1", name: "Recently Started" }
            ],
            show: true,
            value: "viewer_count|-1"
          },
          {
            id: "themeType",
            desc: "Theme",
            type: "radio",
            radio: true,
            opts: [
              { id: "dark", name: "Dark" },
              { id: "white", name: "Light" }
            ],
            show: true,
            value: "white"
          },
          {
            id: "simpleView",
            desc: "Simple View",
            checkbox: true,
            type: "checkbox",
            show: true,
            value: false
          },
          {
            id: "openStreamIn",
            desc: "Open Stream In",
            type: "radio",
            radio: true,
            opts: [
              { id: "newlayout", name: "New Tab" },
              { id: "popout", name: "Popout" },
              { id: "theatrelayout", name: "Theatre Mode" },
              { id: "html5", name: "HTML5 Player" }
            ],
            show: true,
            value: "newlayout"
          },
          {
            id: "openChatIn",
            desc: "Open Chat In",
            type: "radio",
            radio: true,
            opts: [
              { id: "newwindow", name: "New Window" },
              { id: "newtab", name: "New Tab" }
            ],
            show: true,
            value: "newwindow"
          },
          {
            id: "showBadge",
            desc: "Show Badge",
            checkbox: true,
            type: "checkbox",
            show: true,
            value: true
          },
          {
            id: "hideVodcasts",
            desc: "Hide Vodcasts",
            checkbox: true,
            type: "checkbox",
            show: false,
            value: false
          },
          {
            id: "showDesktopNotification",
            desc: "Show Desktop Notifications",
            checkbox: true,
            type: "checkbox",
            show: true,
            value: true
          },
          {
            id: "invertNotification",
            desc: "Invert Notification Logic",
            checkbox: true,
            type: "checkbox",
            show: true,
            value: true
          },
          {
            id: "notifyCount",
            desc: "Number of Notifications",
            type: "select",
            select: true,
            opts: [
              { id: "0", name: "0" },
              { id: "1", name: "1" },
              { id: "2", name: "2" },
              { id: "3", name: "3" },
              { id: "4", name: "4" },
              { id: "5", name: "5" }
            ],
            show: true,
            value: "0"
          },
          {
            id: "closeNotificationDelay",
            desc: "Close Notification Delay",
            range: true,
            type: "range",
            tip: "sec",
            min: 5,
            value: 8,
            max: 60
          },
          {
            id: "playNotificationSound",
            desc: "Play Notification Sound",
            checkbox: true,
            show: true,
            type: "checkbox",
            value: false
          },
          {
            id: "loopNotificationSound",
            desc: "Loop Notification Sound",
            checkbox: true,
            show: false,
            type: "checkbox",
            value: false
          },
          {
            id: "notificationSound",
            desc: "Notification Sound",
            type: "radio",
            radio: true,
            show: true,
            opts: [
              { id: "common/audio/ding.ogg", name: "ding" },
              { id: "common/audio/chime.mp3", name: "chime" },
              { id: "common/audio/click.wav", name: "click" },
              { id: "customsound", name: "Custom Sound" }
            ],
            value: "common/audio/ding.ogg"
          },
          {
            id: "notificationVolume",
            desc: "Notification Volume",
            range: true,
            show: true,
            type: "range",
            tip: "%",
            min: 1,
            max: 100,
            value: 100
          },
          {
            id: "customNotificationSound",
            desc: "Upload Custom Sound",
            button: true,
            show: true,
            type: "button",
            value: ""
          },
          {
            id: "refreshInterval",
            desc: "Refresh Interval",
            range: true,
            show: true,
            type: "range",
            tip: "min",
            min: 1,
            max: 60,
            value: 5
          },
          {
            id: "livestreamerQuality",
            desc: "Livestreamer Quality",
            type: "select",
            select: true,
            opts: [
              { id: "source", name: "source" },
              { id: "high", name: "high" },
              { id: "low", name: "low" },
              { id: "medium", name: "medium" },
              { id: "mobile", name: "mobile" }
            ],
            show: true,
            value: "source"
          },
          {
            id: "livestreamerPath",
            desc: "Livestreamer Path",
            type: "text",
            text: true,
            show: true,
            value: ""
          }
        ];
        
        // Add default models to the collection first
        defaultSettings.forEach(setting => {
          settingsProxy.add(new Backbone.Model(setting));
        });
        
        // Load stored settings and apply them
        chrome.storage.local.get(['settings'], (result) => {
          const storedSettings = result.settings || [];
          console.log('[DEBUG] Loaded stored settings:', storedSettings.length, 'items');
          
          // Apply stored values to existing models
          settingsProxy.forEach(function(control) {
            const saved = storedSettings.find(function(storedControl) {
              return storedControl.id === control.get("id");
            });
            
            if (saved && saved.hasOwnProperty("value")) {
              console.log('[DEBUG] Restoring setting:', saved.id, '=', saved.value);
              control.set("value", saved.value);
            }
          });
          
          // Save current state and set up change listener
          settingsProxy.saveToStorage();
        });
        
        // Listen for changes and save to storage
        settingsProxy.on("change", function() {
          console.log('[DEBUG] Settings changed, saving to storage');
          settingsProxy.saveToStorage();
        });
        
        // Listen for showBadge setting changes
        settingsProxy.on("change", function(model) {
          if (model.get("id") === "showBadge") {
            console.log('[DEBUG] showBadge setting changed to:', model.get("value"));
            if (backgroundProxy.badge) {
              backgroundProxy.badge.onShowBadgeChange(model.get("value"));
            }
          }
        });
        
        console.log('[DEBUG] Settings collection initialized with', settingsProxy.length, 'settings');
        return settingsProxy;
      })(),
      contributors: new Backbone.Collection(),
      toppedgames: new Backbone.Collection(),
      liveStreams: new Backbone.Collection(),
      featuredStreams: new Backbone.Collection(),
      gameStreams: _.extend(new Backbone.Collection(), {
        model: StreamModel,
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
        model: StreamModel,
        
        initialize: function() {
          // Listen for collection changes and update badge count
          this.on("add update remove reset", function() {
            console.log('[DEBUG] Following collection changed, updating badge count:', this.length);
            backgroundProxy.badge.set("count", this.length);
          });
        },
        
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
      badge: new BadgeModel(),
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
    if (backgroundProxy.following && backgroundProxy.following.initialize) {
      backgroundProxy.following.initialize();
    }
    
    // Listen for background stream updates from service worker
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'BACKGROUND_STREAMS_UPDATED') {
        console.log('[DEBUG] Received background streams update, count:', message.streamCount);
        
        // Update badge count to match service worker
        if (backgroundProxy.badge) {
          backgroundProxy.badge.set("count", message.streamCount);
        }
        
        // Optionally update following collection if popup is open
        if (message.streams && backgroundProxy.following) {
          console.log('[DEBUG] Syncing following collection with background data');
          backgroundProxy.following.reset(message.streams);
        }
      }
    });
    
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
      topstreams: backgroundProxy.topstreams.length,
      search: backgroundProxy.search.length
    });
    
    return backgroundProxy;
  }

  that.getConstants = function (){
    return root.constants;
  }

  root.utils = that;

}).call(this);