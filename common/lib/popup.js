(function (w){
  "use strict";

  var app = window.app = _.extend({}, Backbone.Events);
  console.log('[DEBUG] Creating app with Backbone.Events');
  
  var b = app.b = utils._getBackgroundPage();
  console.log('[DEBUG] Got background page with keys:', Object.keys(b));
  console.log('[DEBUG] Background page twitchApi methods:', {
    isAuthorized: typeof b.twitchApi.isAuthorized,
    authorize: typeof b.twitchApi.authorize,
    trigger: typeof b.twitchApi.trigger
  });
  
  var _baron;

  app.twitchApi = b.twitchApi;
  console.log('[DEBUG] Set app.twitchApi to:', JSON.stringify(app.twitchApi, null, 0));
  app.currentView = null;
  app.views = {};
  app.windowOpened = false;

  app.resetScroll = function (){
    app.container.removeClass('shift');
    app.container.scrollTop(0);
    if (utils.rbrowser != 'firefox') {
      _baron.update();
    }
  }

  app.lazyload = function (){
    var collection = $('.lazy-container').filter(":visible").find(".lazy");
    collection.each(function (){
      var t = $(this);
      if ( t.visible(true) ) {
        t.attr('src', t.attr('data-original'));
        t.removeClass('lazy');
      }
    });
    setTimeout(function (){
      app.lazyload()
    }, 100);
  }

  app.setCurrentView = function (viewName){
    if ( app.views[viewName] ) {
      if ( app.curView && typeof app.curView.onhide == 'function' ) {
        app.curView.onhide();
      }
      $('.screen').hide();
      app.curView = app.views[viewName];
      $('#filterInput:visible, #searchInput:visible').focus();
      app.curView.$el.show();
      if ( app.curView.lazyrender ) {
        app.curView.lazyrender();
      }
      if ( app.curView.onshow ) {
        app.curView.onshow();
      }
      app.resetScroll();
    }
  }

  app.init = function (){

    app.container = $('#content');
    app.scroller = app.container.find(".scroller");
    app._scroller = document.querySelector(".scroller");
    app.scrollerBar = document.querySelector(".scroller__bar");
    app.preloader = $("<div id='preloader'><img src='../img/spinner.gif'/></div>");
    app.streamPreloader = $("<div id='preloader-stream'><img src='../img/spinner.gif'/></div>");
    app.btnPreloader = $("<div id='preloader-btn'><img src='../img/spinner.gif'/></div>");

    i18n.setGetMessageFn(utils.i18n.getMessage);
    i18n.replace(document.body);
    i18n.observe(document.body);

    var views = app.views;
    this.router = new this.Router;

    app.scroller.on("scroll", function (){
      if ( app._scroller.scrollTop + app._scroller.offsetHeight >= app._scroller.scrollHeight - 200 ) {
        if ( app.curView && app.curView.loadNext && $("#filterInput").val().length == 0 ) {
          app.curView.loadNext();
        }
      }
    })

    views.menu = new Menu;

    views.topMenu = new TopMenu;

    if (utils.rbrowser != 'firefox'){
      _baron = baron({
        root    : '#content',
        scroller: '.scroller',
        bar     : '.scroller__bar',
        barOnCls: 'baron'
      }).autoUpdate();
    }


    Backbone.history.start();

    this.router.on("all", function (r){
      var route = r.split(":")[1];
      console.log("ROUTE", route);
      if ( route ) {
        app.setCurrentView(route);
      }
    });

    console.log('[DEBUG] Creating notifications view with collection length:', b.notifications.length);
    views.notifications = new ChannelNotificationListView({
      el        : "#notifications-screen",
      collection: b.notifications
    })

    console.log('[DEBUG] Creating followedGames view with collection length:', b.followedgames.length);
    views.followedGames = new GameListView({
      el        : "#followed-game-screen",
      collection: b.followedgames,
      messages  : {
        noresults: {
          header: "__MSG_m107__",
          text  : "__MSG_m108__"
        }
      }
    })

    console.log('[DEBUG] Creating followedChannels view with collection length:', b.followedChannels.length);
    console.log('[DEBUG] followedChannels type:', typeof b.followedChannels);
    console.log('[DEBUG] followedChannels constructor:', b.followedChannels.constructor.name);
    console.log('[DEBUG] followedChannels instanceof Backbone.Collection:', b.followedChannels instanceof Backbone.Collection);
    new FollowedChannelsView({
      el        : "#followed-channels-screen",
      collection: b.followedChannels,
      messages  : {
        noresults: {
          text: ""
        }
      }
    })

    views.gameLobby = new GameLobbyView({
      el   : "#gamelobby-game",
      model: b.gameLobby
    })

    views.gameStreamsView = new GameStreamsView({
      el               : "#gamelobby-streams",
      collection       : b.gameStreams,
      preloaderOnUpdate: true,
      messages         : {
        noresults: {
          button : "__MSG_m105__",
          onclick: function (){
            this.collection.disableLanguageFilter();
            this.collection.update();
          },
          text   : "__MSG_m103__"
        }
      }
    });

    views.gameVideosView = new VideoListView({
      el               : "#gamelobby-videos",
      collection       : b.gameVideos,
      preloaderOnUpdate: true
    })

    views.info = new InfoView({
      el: "#info-screen"
    });

    views.topstreams = new StreamListView({
      el        : "#topstreams-screen",
      collection: b.topstreams
    });

    console.log('[DEBUG] Creating following streams view with collection length:', b.following.length);
    console.log('[DEBUG] b.following type:', typeof b.following);
    console.log('[DEBUG] b.following length:', b.following ? b.following.length : 'undefined');
    views.following = new FollowingStreamsView({
      el                : "#stream-screen",
      collection        : b.following,
      channelsCollection: b.followedChannels,
      messages          : {
        noresults: {
          header: "__MSG_m107__",
          text  : "__MSG_m109__"
        }
      }
    });

    // Check if we're already authorized when popup opens
    console.log('[DEBUG] Checking authorization status on popup open');
    app.twitchApi.isAuthorized().then((authorized) => {
      console.log('[DEBUG] Initial auth check result:', JSON.stringify(authorized, null, 0));
      if (authorized) {
        console.log('[DEBUG] Already authorized! Triggering authorize event on popup open');
        app.twitchApi.trigger('authorize');
        
        // Also trigger collection updates
        if (b.following && b.following.update) {
          console.log('[DEBUG] Triggering following collection update on popup open');
          b.following.update();
        }
        if (b.games && b.games.update) {
          console.log('[DEBUG] Triggering games collection update on popup open');
          b.games.update();
        }
      } else {
        console.log('[DEBUG] Not yet authorized on popup open');
      }
    }).catch((error) => {
      console.log('[DEBUG] Error checking initial auth status:', JSON.stringify(error, null, 0));
    });

    views.videos = new VideoListView({
      el        : "#video-screen",
      collection: b.videos,
      messages  : {
        noresults: {
          text: "__MSG_m104__"
        }
      }
    });

    views.search = new SearchView({
      el        : "#search-screen",
      collection: b.search,
      messages  : {
        noresults: {
          text: "__MSG_m50__"
        }
      }
    });

    views.browseGames = new GameListView({
      el        : "#browse-game-screen",
      collection: b.games
    });

    new UserView({
      model: b.user
    });

    views.settings = new SettingsView({
      collection: b.settings
    });

    new ContributorListView({
      el        : ".contributor-list",
      collection: b.contributors
    })

    $(window).on("popup-close", function (){
      app.scroller.scrollTop(0); //reset scroll on popup close for firefox
      b.bgApp.dispatcher.trigger("popup-close");
    });

    $(self).on("unload", function (){
      $(window).trigger("popup-close");
    })

    app.lazyload();

    $("body")
      .on('click', '*[data-route]', function (){
        var route = $(this).attr('data-route');
        window.location.hash = '#' + route;
      })
      .on('click', '.js-tab', function (e){
        var href = $(this).attr('data-href');
        utils.tabs.create({url: href});
        e.preventDefault();
        window.close();
      })
      .on('click', '.js-window', function (e){
        var windowOpts = JSON.parse($(this).attr('data-window-opts') || "{}");
        utils.windows.create($.extend({url: $(this).attr('data-href')}, windowOpts));
        e.preventDefault();
        window.close();
      });

    $('.tip').tooltip();
  };

  var DefaultView = Backbone.View.extend({
    app          : app,
    template     : "",
    render       : function (){
      this.$el.empty().html($(Handlebars.templates[this.template](this.model.toJSON())));
      return this;
    },
    onshow       : function (){

    },
    onhide       : function (){

    },
    initialize   : function (){
      $(window).on("unload", function (){
        this.undelegateEvents();
        this.stopListening();
      }.bind(this));
    },
    showPreloader: function (container){
      container = container || this.$el;
      container.append(this.app.streamPreloader);
    },
    hidePreloader: function (){
      this.app.streamPreloader.detach();
    }
  });

  var LazyRenderView = DefaultView.extend({
    isRendered: false,
    lazyrender: function (){
      if ( !this.isRendered ) {
        this.render();
        this.isRendered = true;
      }
    }
  })

  var UserView = DefaultView.extend({
    el        : "#user-info",
    events    : {
      "click #logout-btn": "logout",
      "click #login-btn" : "login"
    },
    template  : "user",
    initialize: function (){
      DefaultView.prototype.initialize.apply(this, arguments);
      this.listenTo(this.model, "change", this.render);
      this.render();
    },
    login     : function (){
      console.log('[DEBUG] Login button clicked');
      console.log('[DEBUG] this.model type:', typeof this.model);
      console.log('[DEBUG] this.model.login exists:', typeof this.model.login);
      console.log('[DEBUG] app exists:', typeof app);
      console.log('[DEBUG] app.twitchApi exists:', typeof app.twitchApi);
      console.log('[DEBUG] app.twitchApi.authorize exists:', typeof app.twitchApi.authorize);
      if (typeof this.model.login === 'function') {
        console.log('[DEBUG] Calling this.model.login()');
        this.model.login();
      } else {
        console.log('[DEBUG] this.model.login is not a function, calling app.twitchApi.authorize() directly');
        console.log('[DEBUG] app.twitchApi type:', typeof app.twitchApi);
        console.log('[DEBUG] app.twitchApi.authorize type:', typeof app.twitchApi.authorize);
        console.log('[DEBUG] About to call app.twitchApi.authorize()');
        app.twitchApi.authorize();
        console.log('[DEBUG] app.twitchApi.authorize() called');
        
        // Add callback to check what happens after authorization
        console.log('[DEBUG] Adding listeners for after authorization');
        console.log('[DEBUG] app.twitchApi.on available:', typeof app.twitchApi.on);
        if (app.twitchApi.on) {
          console.log('[DEBUG] Setting up authorize event listener');
          app.twitchApi.on('authorize', function() {
            console.log('[DEBUG] AUTHORIZE EVENT RECEIVED IN LOGIN!');
            console.log('[DEBUG] b.following after auth, length:', b.following ? b.following.length : 'undefined');
          });
          
          app.twitchApi.on('change:authorized', function() {
            console.log('[DEBUG] CHANGE:AUTHORIZED EVENT RECEIVED IN LOGIN!');
            console.log('[DEBUG] b.following after auth change, length:', b.following ? b.following.length : 'undefined');
          });
        } else {
          console.log('[DEBUG] app.twitchApi.on not available for event listening');
        }
      }
    },
    logout    : function (){
      this.model.logout();
    }
  })

  var TopMenu = DefaultView.extend({
    el            : "#top-menu",
    events        : {
      "click #refresh-btn": "refresh",
      "keyup #filterInput": "filter"
    },
    show          : function (){
      this.$el.show();
    },
    hide          : function (){
      this.$el.hide();
    },
    initialize    : function (){
      DefaultView.prototype.initialize.apply(this, arguments);
      this.$filterInput = this.$("#filterInput");
      this.listenTo(this.app.router, "route", this.resetFilterVal);
    },
    resetFilterVal: function (){
      this.$filterInput.val("").keyup();
      this.filter();
    },
    filter        : function (){
      var fValue = this.$filterInput.val().toLowerCase();
      fValue = fValue.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
      var rFilter = new RegExp(fValue);
      if ( this.app.curView ) {
        this.app.curView.$el.find(".js-filterable").each(function (i, e){
          $(e).toggle(!!$(e).text().toLowerCase().match(rFilter));
        });
        if (utils.rbrowser != 'firefox') {
          _baron.update();
        }

      }
    },
    refresh       : function (){
      this.resetFilterVal();
      this.app.curView && this.app.curView.update && this.app.curView.update();
    }
  });

  var Menu = DefaultView.extend({
    el           : "#menu",
    events       : {
      "click .menu-btn": "selectTab"
    },
    initialize   : function (){
      DefaultView.prototype.initialize.apply(this, arguments);
      this.listenTo(this.app.router, "route", this.onRouteChange.bind(this));
    },
    onRouteChange: function (route, r1){
      console.log("_route", route, r1);
      if ( /user/i.test(Backbone.history.fragment) ) {
        this.$el.find(".menu-btn").removeClass("active");
      }
    },
    selectTab    : function (e){
      this.$el.find(".menu-btn").removeClass("active");
//      this.$el.find(".menu-btn[data-route=" + route + "]").addClass("active");
      $(e.target).closest(".menu-btn").addClass("active");
    }
  });

  var InfoView = DefaultView.extend({});

  var ControlView = DefaultView.extend({
    template: "control"
  });

  var SettingsView = LazyRenderView.extend({
    el    : "#settings-screen",
    events: {
      "click input[data-id=\"customNotificationSound\"]": "uploadSound",
      "change input[type=\"range\"]"                    : "rangeHelper",
      "change input, select"                            : "serialize"
    },

    setDefaultTab: function (value){
      app.router.navigate(value, {trigger: true});
      $('#menu').find('[data-route="' + value + '"]').addClass("active");
    },

    changeThemeType: function (value){
      $("body").toggleClass("white-version", value !== "dark");
    },

    toggleSimpleView: function (value){
      $("body").toggleClass("simple-version", value);
    },

    onModelChange: function (model, options){
      var v = model.get("value");

      switch (model.get("id")) {
        case "notificationSound":
          this.playSound()
          break;

        case "simpleView":
          this.toggleSimpleView(model.get("value"))
          break;

        case "themeType":
          this.changeThemeType(model.get("value"));
          break;

        default:
          break;
      }
    },

    uploadSound: function (e){
      utils.tabs.create({url: utils.runtime.getURL("common/html/upload.html")});
    },

    playSound  : function (e){
      b.bgApp.playSound(b.settings.getNotificationSoundSource(), b.settings.get("notificationVolume").get("value") / 100);
    },
    rangeHelper: function (e){
      var t = $(e.target);
      t.siblings(".range-helper").find(".range-helper-value").html(t.val());
    },
    initialize : function (){
      console.log('[DEBUG] SettingsView.initialize called');
      console.log('[DEBUG] this.collection:', JSON.stringify(this.collection, null, 0));
      console.log('[DEBUG] Collection length:', this.collection.length);
      
      LazyRenderView.prototype.initialize.apply(this, arguments);
      
      // Check if settings exist before trying to access them
      var defaultTab = this.collection.get("defaultTab");
      var themeType = this.collection.get("themeType");
      var simpleView = this.collection.get("simpleView");
      
      console.log('[DEBUG] defaultTab model:', defaultTab ? 'found' : 'undefined');
      console.log('[DEBUG] themeType model:', themeType ? 'found' : 'undefined');
      console.log('[DEBUG] simpleView model:', simpleView ? 'found' : 'undefined');
      
      if (defaultTab) {
        this.setDefaultTab(defaultTab.get("value"));
      } else {
        // Default to following tab if no setting is found
        console.log('[DEBUG] No defaultTab setting found, defaulting to following');
        this.setDefaultTab("following");
      }
      if (themeType) {
        this.changeThemeType(themeType.get("value"));
      }
      if (simpleView) {
        this.toggleSimpleView(simpleView.get("value"));
      }

      this.$container = this.$el.find("#settings-container");
      this.listenTo(this.collection, "change", this.onModelChange);
    },
    serialize  : function (){
      var controls = [];
      var groups = {};

      this.$container.find('input, select').each(function (e){
        var t = $(this),
          value,
          type = t.attr('data-type'),
          controlId = t.attr('data-id');

        if ( type == 'radio' ) {
          if ( t.prop("checked") ) {
            value = t.val();
          } else {
            return;
          }
        }

        if ( type == 'checkbox' || type == 'mcheckbox' ) {
          value = t.prop('checked');
        }
        else if ( type == 'range' ) {
          value = parseInt(t.val(), 10);
        }
        else {
          value = t.val();
        }

        if ( t.attr("data-parent-id") ) {
          var parentId = t.attr("data-parent-id");
          groups[parentId] = groups[parentId] || [];
          if ( value ) {
            groups[parentId].push(controlId);
          }
        } else {
          controls.push({id: controlId, value: value});
        }
      });

      console.log(groups);

      for ( var i in groups ) {
        controls.push({id: i, value: groups[i].join(",")});
      }

      this.collection.set(controls, {add: false, remove: false});
    },
    render     : function (){
      var views = this.collection.map(function (control){
        return new ControlView({model: control}).render().$el;
      }, this);
      this.$container.empty().html(views);
      return this;
    }
  });

  var GameView = DefaultView.extend({
    template: "game",
    events  : {
      "contextmenu .stream": "showMenu"
    },

    unfollow: function (){
      var self = this;
      self.showPreloader(self.$el.find(".stream"));
      this.model.unfollow(function (){
        self.hidePreloader();
      });
    },
    follow  : function (){
      var self = this;
      self.showPreloader(self.$el.find(".stream"));
      self.model.follow(function (){
        self.hidePreloader();
      });
    },

    showMenu: function (e){
      var m = this.model.toJSON();
      var self = this;
      m.authorized = app.twitchApi.isAuthorized();

      var menu = new MenuView({
        model: m
      })

      menu.showMenu("contextgamemenu", {y: e.clientY, x: e.clientX});

      menu.$el
        .on('click', '.js-follow-game', function (){
          self.follow();
        })
        .on('click', '.js-unfollow-game', function (){
          self.unfollow();
        })

      return false;
    }
  });

  var MenuView = DefaultView.extend({
    template  : "",
    el        : "#context-menu",
    initialize: function (){
      DefaultView.prototype.initialize.apply(this, arguments);
      $("body").on("click", this.hide.bind(this));
    },
    hide      : function (){
      this.$el.hide();
    },
    showMenu  : function (tmpl, coords){
      var menuEl = $(this.el);
      var y = coords.y;
      var x = coords.x;
      var height = menuEl.height();

      if ( y + height > $(document.body).height() ) {
        y -= height;
      }

      menuEl
        .off()
        .empty()
        .html($(Handlebars.templates[tmpl](this.model)))
        .css({top: y, left: x})
        .show();
      return false;
    }
  })

  var VideoView = DefaultView.extend({
    template: "video"
  });


  var StreamView = DefaultView.extend({
    template  : "stream",
    menuEl    : '#context-menu',
    events    : {
      "contextmenu .stream": "showMenu",
      "mousedown .stream"  : "openStream",
    },

    openStream: function (e){
      // Open stream on left and middle click
      const canOpenStreamTab = e.which <= 2;
      if (canOpenStreamTab) {
        this.model.openStream();
        window.close();
      }
    },
    openChat  : function (){
      this.model.openChat();
      window.close();
    },
    showMenu  : function (e){
      var self = this;
      var m = this.model.toJSON();
      m.authorized = app.twitchApi.isAuthorized();

      var menu = new MenuView({
        model: m
      })
      menu.showMenu("contextstreammenu", {y: e.clientY, x: e.clientX});

      menu.$el
        .on('click', '.js-open-chat', function (){
          self.model.openChat();
          window.close();
        })
        .on('click', '.js-open-in-multitwitch', function (){
          self.model.openMultitwitch();
          window.close();
        })
        .on('click', '.js-open-stream', function (e){
          self.model.openStream($(e.target).attr("data-type"));
          window.close();
        })
        .on('click', '.js-follow', function (){
          self.follow();
        })
        .on('click', '.js-unfollow', function (){
          self.unfollow();
        })

      return false;
    },
    unfollow  : function (){
      var self = this;
      self.showPreloader(self.$el.find(".stream"));
      this.model.unfollow(function (){
        self.hidePreloader();
      });
    },
    follow    : function (){
      var self = this;
      self.showPreloader(self.$el.find(".stream"));
      self.model.follow(function (){
        self.hidePreloader();
      });
    },
    initialize: function (){
      DefaultView.prototype.initialize.apply(this, arguments);
      this.listenTo(this.model, "change", this.render);
    }
  });

  var ListView = LazyRenderView.extend({
    events        : {
      "click .screen-msg-btn": "onMessageClick"
    },
    messages      : {
      "auth"         : {
        text: "__MSG_m73__"
      },
      "api"          : {
        text: "__MSG_m48__"
      },
      "novideo"      : {
        text: "__MSG_m49__"
      },
      "nosearchquery": {
        text: "No search query"
      }
    },
    itemView      : null, // single item view
    initialize    : function (opts){
      console.log('[DEBUG] ListView.initialize called with opts:', JSON.stringify(opts, null, 0));
      console.log('[DEBUG] this.collection before setup:', JSON.stringify(this.collection, null, 0));
      console.log('[DEBUG] opts.collection:', JSON.stringify(opts.collection, null, 0));
      console.log('[DEBUG] opts.collection type:', typeof opts.collection);
      console.log('[DEBUG] opts.collection instanceof Backbone.Collection:', opts.collection instanceof Backbone.Collection);
      
      LazyRenderView.prototype.initialize.apply(this, arguments);
      this.container = opts.container || this.$el.children(".screen-content");
      this.messages = $.extend({}, this.messages, opts.messages);
      this.currentMessage = null;
      
      // Use opts.collection instead of this.collection since Backbone hasn't set it yet
      var collection = opts.collection || this.collection;
      console.log('[DEBUG] Using collection:', JSON.stringify(collection, null, 0));
      console.log('[DEBUG] Collection has _listenId?', collection && '_listenId' in collection);
      
      if (!collection) {
        console.error('[DEBUG] No collection provided to ListView!');
        return;
      }
      
      this.listenTo(collection, "remove update sort reset", function() {
        console.log('[DEBUG] ListView got reset/update/sort event, calling render');
        this.render(null);
      }.bind(this));
      this.listenTo(collection, "_error", this.showMessage.bind(this));
      this.listenTo(collection, "add addarray", function() {
        console.log('[DEBUG] ListView got add/addarray event, calling render');
        this.render();
      }.bind(this));
      if ( opts.preloaderOnUpdate ) {
        this.listenTo(collection, "update-status", function (isUpdating, opts){
          if ( isUpdating && opts.reset ) {
            this.container.empty().append(this.app.preloader);
          }
        }.bind(this));
      }
      
      console.log('[DEBUG] ListView.initialize completed');
    },
    onMessageClick: function (){
      if ( this.currentMessage.onclick ) {
        this.currentMessage.onclick.call(this);
      }
    },
    showMessage   : function (type){
      if ( this.messages[type] ) {
        var text = this.messages[type];
        this.currentMessage = this.messages[type];
        this.container.empty().html(Handlebars.templates["screenmessage"](text));
      }
    },
    loadNext      : function (){
      if ( this.collection.pagination ) {
        this.collection.loadNext();
      }
    },
    update        : function (){
      this.container.empty().append(this.app.preloader);
      this.collection.update();
    },
    render        : function (models){
      console.log('[DEBUG] ListView.render called with models:', models ? 'provided' : 'null');
      console.log('[DEBUG] this.collection in render:', this.collection ? this.collection.length : 'undefined');
      
      var elementsToRender = [];
      if ( models ) {
        elementsToRender = Array.isArray(models) ? models : [models];
      } else {
        elementsToRender = this.collection;
        if ( !elementsToRender.length ) {
          console.log('[DEBUG] No elements to render, showing noresults message');
          return this.showMessage("noresults");
        }
      }
      
      console.log('[DEBUG] Elements to render:', elementsToRender.length);

      console.log('[DEBUG] Creating', elementsToRender.length, 'views using itemView:', this.itemView);
      var views = elementsToRender.map(function (item){
        console.log('[DEBUG] Creating view for item:', typeof item, item.id || 'no-id');
        var view = new this.itemView({model: item}).render();
        console.log('[DEBUG] View created:', !!view, 'with $el:', !!view.$el);
        return view.$el;
      }, this);
      console.log('[DEBUG] All views created, count:', views.length);
      
      console.log('[DEBUG] Container element:', this.container.length, 'selector:', this.container.selector);
      console.log('[DEBUG] Container HTML before update:', this.container.html().length, 'chars');
      
      if ( models ) {
        console.log('[DEBUG] Appending views to container');
        this.container.append($(document.createDocumentFragment()).html(views));
      } else {
        console.log('[DEBUG] Replacing container content with views');
        this.container.empty().html(views);
      }
      
      console.log('[DEBUG] Container HTML after update:', this.container.html().length, 'chars');
      console.log('[DEBUG] Container children count:', this.container.children().length);
      console.log('[DEBUG] DOM update completed');
    }
  });


  var ChannelNotificationView = DefaultView.extend({
    template   : "channelnotification",
    events     : {
      "click .channel-logo": "openProfile"
    },
    openProfile: function (){
      this.model.openProfilePage();
    }
  })

  var ChannelView = DefaultView.extend({
    template       : "channel",
    events         : {
      "click .stream": "openChannelPage"
    },
    openChannelPage: function (){
      this.model.openChannelPage();
    }
  })


  var FollowedChannelsView = ListView.extend({
    itemView: ChannelView
  })

  var ChannelNotificationListView = ListView.extend({
    itemView      : ChannelNotificationView,
    events        : {
      "click .undo-message a"       : "undo",
      "change .screen-content input": "serialize",
      "click .dropdown-menu a"      : "toggle"
    },
    initialize    : function (){
      this.$undoMessage = this.$el.find(".undo-message");
      this.$selectMenuBtn = this.$el.find(".dropdown .btn");
      this.listenTo(this.collection, "add update remove reset", this.toggleDropdown.bind(this));
      this.toggleDropdown();
      ListView.prototype.initialize.apply(this, arguments);
    },
    toggleDropdown: function (){
      this.$selectMenuBtn.toggleClass("disabled", this.collection.length == 0);
    },
    update        : function (){
      this.$selectMenuBtn.addClass("disabled");
      this.$undoMessage.css({visibility: "hidden"});
      ListView.prototype.update.apply(this, arguments);
    },

    onhide   : function (){
      this.$undoMessage.css({visibility: "hidden"});
    },
    onshow   : function (){
      //update once on view show if not updated before
      if ( !this.collection.length ) {
        this.update();
      }
    },
    undo     : function (){
      this.collection.restore();
      this.$undoMessage.css({visibility: "hidden"});
    },
    toggle   : function (e){
      var type = $(e.currentTarget).data("notification-type");
      var val = $(e.currentTarget).data("notification-value") == "1" ? true : false;
      this.$el
        .find(".screen-content input[data-notification-type='" + type + "']")
        .prop("checked", val);

      this.$undoMessage.css({visibility: "visible"});
      this.collection.store();
      this.serialize();
    },
    serialize: function (){
      var attributes = [];
      this.$el.find(".screen-content [data-channel-id]")
        .map(function (i, e){
          e = $(e);
          attributes.push({
            _id             : parseInt(e.attr("data-channel-id")),
            notificationOpts: {
              desktop: e.find("input[data-notification-type='desktop']").prop("checked"),
              sound  : e.find("input[data-notification-type='sound']").prop("checked")
            }
          });
        })
      this.collection.set(attributes, {add: false, remove: false, silent: true});
      this.collection.saveToStorage();
    }
  })

  var GameListView = ListView.extend({
    itemView: GameView
  });

  var StreamListView = ListView.extend({
    itemView: StreamView
  });

  var FollowingStreamsView = StreamListView.extend({
    events             : {
      "click #load-offline-channels-btn": "loadOfflineChannels"
    },
    showOfflineChannels: false,
    channelsCollection : null,
    initialize         : function (opts){
      console.log('[DEBUG] FollowingStreamsView.initialize called');
      console.log('[DEBUG] opts.collection:', opts.collection ? opts.collection.length : 'undefined');
      console.log('[DEBUG] app.twitchApi.isAuthorized():', app.twitchApi.isAuthorized());
      
      StreamListView.prototype.initialize.apply(this, arguments);
      _.extend(this.events, StreamListView.prototype.events);

      this.$loadBtn = $('#load-offline-channels-btn');
      this.$channels = $('#followed-channels-screen');
      this.channelsCollection = opts.channelsCollection;

      if ( app.twitchApi.isAuthorized() ) {
        this.$loadBtn.removeClass('hide');
      } else {
        this.$loadBtn.addClass('hide');
      }

      console.log('[DEBUG] Setting up authorize event listener on app.twitchApi');
      console.log('[DEBUG] app.twitchApi in FollowingStreamsView has on method:', typeof app.twitchApi.on);
      this.listenTo(app.twitchApi, "authorize", function (){
        console.log('[DEBUG] FollowingStreamsView: authorize event received!!!');
        console.log('[DEBUG] Collection length after authorize:', this.collection.length);
        console.log('[DEBUG] Collection has update method:', typeof this.collection.update);
        this.$loadBtn.removeClass('hide');
        console.log('[DEBUG] Removed hide class from load button');
        
        // Try to trigger an update of the collection after authorization
        if (this.collection && this.collection.update) {
          console.log('[DEBUG] Triggering collection update after authorization');
          console.log('[DEBUG] Collection update function type:', typeof this.collection.update);
          this.collection.update();
        } else {
          console.log('[DEBUG] Collection or update function not available:', JSON.stringify({collection: !!this.collection, update: !!(this.collection && this.collection.update)}, null, 0));
        }
      }.bind(this));
      console.log('[DEBUG] authorize event listener set up complete');

      this.listenTo(app.twitchApi, "revoke", function (){
        this.$loadBtn.addClass('hide');
      }.bind(this));

      this.listenTo(this.collection, "update-status", function (){
        this.$loadBtn.addClass('hide');
        this.$channels.addClass('hide');
      }.bind(this));

      if ( !this.collection.length ) {
        this.$loadBtn.addClass('hide');
      }

      this.listenTo(this.collection, "remove update sort reset", function (){
        this.$loadBtn.addClass('hide');
        if ( !this.showOfflineChannels && this.collection.length ) {
          this.$loadBtn.removeClass('hide');
        }
      }.bind(this));

      this.listenTo(this.collection, "update", function (){
        console.log('[DEBUG] FollowingStreamsView: collection update event received');
        console.log('[DEBUG] Collection length after update:', this.collection.length);
        this.$channels.removeClass('hide');
      }.bind(this));

      this.listenTo(this.channelsCollection, "update", function (isUpdating, opts){
        console.log("\nUpdate status", arguments);
        this.app.btnPreloader.detach();
        this.$loadBtn.addClass('hide');
      }.bind(this));
    },
    loadOfflineChannels: function (){
      console.log("\nLoad offline Channels");
      this.showOfflineChannels = true;
      this.$loadBtn.append(this.app.btnPreloader);
      this.channelsCollection.update();
    }
  })

  var GameStreamsView = StreamListView.extend({
    onhide: function (){
      this.collection.enableLanguageFilter();
    }
  })


  var SearchView = ListView.extend({
    events  : {
      "keyup #searchInput": "onkeyup",
      "click #search"     : "search"
    },
    itemView: StreamView,
    onkeyup : function (e){
      if ( e.keyCode == 13 ) {
        this.search();
      }
    },
    search  : function (){
      this.collection.query = this.$el.find("#searchInput").val();
      this.update();
    }
  });

  var VideoListView = ListView.extend({
    itemView : VideoView,
    setStream: function (channel){
      this.lazyrender();
      this.collection.channel = channel;
      this.update();
    }
  });

  var GameLobbyView = DefaultView.extend({
    template     : "gameextended",
    events       : {
      "click .game-follow": "follow"
    },
    onRouteChange: function (route, r1){
      console.log("route", arguments);
      var isActive = /gameStreams|gameVideos/i.test(route);
      this.$el.toggle(isActive);
      $("#content").toggleClass("shift", isActive);
      if ( /gameStreams|gameVideos/i.test(route) ) {
        var $buttons = this.$el.find(".button").removeClass("active");

        if ( /gameStreams/i.exec(route) ) {
          $buttons.eq(0).addClass("active");
        }

        if ( /gameVideos/i.exec(route) ) {
          $buttons.eq(1).addClass("active");
        }
        var gameName = r1[0];
        this.model.change(gameName);
      }
    },
    follow       : function (){
      this.$el.find(".game-follow").addClass("active");
      this.model.follow();
    },
    initialize   : function (){
      DefaultView.prototype.initialize.apply(this, arguments);
      this.listenTo(this.model, "change", this.render.bind(this));
      this.listenTo(this.app.router, "route", this.onRouteChange.bind(this));
      this.render();
    }
  })

  var ContributorView = DefaultView.extend({
    template: "contributor"
  });

  var ContributorListView = DefaultView.extend({
    initialize: function (){
      DefaultView.prototype.initialize.apply(this, arguments);
      this.listenTo(this.collection, "reset", this.render);
      this.render();
    },
    render    : function (){
      var views = this.collection.map(function (item){
        return new ContributorView({model: item}).render().$el;
      }, this);

      this.$el.empty().html(views);
    }
  });

})(window);
