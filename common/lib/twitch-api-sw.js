// Service Worker compatible Twitch API client
(function() {
  "use strict";

  const TwitchApi = function(clientId) {
    if (!clientId) throw new Error("clientId is required");
    this.basePath = "https://api.twitch.tv/helix";
    this.userName = "";
    this.userId = "";
    this.clientId = clientId;
    this.timeout = 10 * 1000;
    this.token = "";
    this._events = {};
  };

  // Simple event system (replaces Backbone.Events)
  TwitchApi.prototype.on = function(event, callback) {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(callback);
  };

  TwitchApi.prototype.trigger = function(event, ...args) {
    if (this._events[event]) {
      this._events[event].forEach(callback => callback(...args));
    }
  };

  TwitchApi.prototype.isAuthorized = function() {
    return !!this.token;
  };

  TwitchApi.prototype.authorize = function() {
    if (typeof twitchOauth !== 'undefined') {
      twitchOauth.authorize(() => {});
    }
  };

  TwitchApi.prototype.revoke = function() {
    if (this.token && this.token.length > 0 && typeof twitchOauth !== 'undefined') {
      twitchOauth.removeData();
    }
  };

  TwitchApi.prototype.getRequestParams = function() {
    return {
      timeout: this.timeout,
      headers: {
        "Accept": "application/json",
        "Client-ID": this.clientId,
        "Authorization": "Bearer " + this.token
      }
    };
  };

  TwitchApi.prototype.setToken = function(accessToken) {
    this.token = accessToken;
    this.trigger("tokenchange", accessToken);
  };

  // Helper function to process stream thumbnail URLs
  TwitchApi.prototype.processStreamThumbnails = function(data) {
    if (data && data.data && data.data.length) {
      data.data = data.data.map(function(s) {
        if (s.thumbnail_url && typeof s.thumbnail_url === 'string') {
          s.thumbnail_url = s.thumbnail_url.replace(/{width}/, 134);
          s.thumbnail_url = s.thumbnail_url.replace(/{height}/, 70);
        }
        return s;
      });
    }
    return data;
  };

  TwitchApi.prototype.send = async function(endpoint, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = {};
    }

    const requestParams = this.getRequestParams();
    let url = `${this.basePath}/${endpoint}`;

    // Add query parameters
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        searchParams.append(key, value);
      }
      url += '?' + searchParams.toString();
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: requestParams.headers,
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid - trigger revocation
          console.log('[SW API] 401 Unauthorized - token expired, revoking');
          // Note: We can't directly access twitchOauth here, so we'll throw a specific error
          throw new Error(`HTTP 401: Token expired or invalid`);
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (callback) callback(null, data);
      return data;
    } catch (err) {
      console.error('Twitch API error:', err);
      if (callback) callback(err);
      throw err;
    }
  };

  TwitchApi.prototype.getUserInfo = async function(callback) {
    if (!this.token) {
      const error = new Error('Not authorized - no token');
      if (callback) callback(error);
      throw error;
    }

    try {
      const data = await this.send('users');
      if (data && data.data && data.data[0]) {
        this.userId = data.data[0].id;
        this.userName = data.data[0].display_name;
        console.log('[SW] User info retrieved - ID:', this.userId, 'Name:', this.userName);
        if (callback) callback(null, data.data[0]);
        return data.data[0];
      } else {
        const error = new Error('Invalid user data received');
        if (callback) callback(error);
        throw error;
      }
    } catch (err) {
      if (callback) callback(err);
      throw err;
    }
  };

  TwitchApi.prototype.getFollowedStreams = async function(callback) {
    if (!this.isAuthorized()) {
      const error = new Error('Not authorized');
      if (callback) callback(error);
      throw error;
    }

    // Ensure we have user ID
    if (!this.userId) {
      try {
        await this.getUserInfo();
        console.log('[SW] Got user info, userId:', this.userId);
      } catch (err) {
        console.log('[SW] Failed to get user info:', err.message);
        if (callback) callback(err);
        throw err;
      }
    }

    try {
      const data = await this.send('streams/followed', { user_id: this.userId });
      const processedData = this.processStreamThumbnails(data);
      
      if (callback) callback(null, processedData);
      return processedData;
    } catch (err) {
      if (callback) callback(err);
      throw err;
    }
  };

  TwitchApi.prototype.getTopGames = async function(callback) {
    if (!this.isAuthorized()) {
      const error = new Error('Not authorized');
      if (callback) callback(error);
      throw error;
    }

    try {
      const data = await this.send('games/top');
      
      // Process response similar to existing Games collection
      if (data && data.data) {
        data.data = Array.isArray(data.data) ? data.data : [];
        data.data.forEach(function (g) {
          g.box_art_url = g.box_art_url.replace(/{width}/, 136);
          g.box_art_url = g.box_art_url.replace(/{height}/, 190);
        });
      }
      
      if (callback) callback(null, data);
      return data;
    } catch (err) {
      if (callback) callback(err);
      throw err;
    }
  };

  TwitchApi.prototype.getGameStreams = async function(gameId, callback) {
    if (!this.isAuthorized()) {
      const error = new Error('Not authorized');
      if (callback) callback(error);
      throw error;
    }

    if (!gameId) {
      const error = new Error('Game ID is required');
      if (callback) callback(error);
      throw error;
    }

    try {
      const data = await this.send('streams', { game_id: gameId });
      const processedData = this.processStreamThumbnails(data);
      
      if (callback) callback(null, processedData);
      return processedData;
    } catch (err) {
      if (callback) callback(err);
      throw err;
    }
  };

  TwitchApi.prototype.getTopStreams = async function(callback) {
    if (!this.isAuthorized()) {
      const error = new Error('Not authorized');
      if (callback) callback(error);
      throw error;
    }

    try {
      const data = await this.send('streams');
      const processedData = this.processStreamThumbnails(data);
      
      if (callback) callback(null, processedData);
      return processedData;
    } catch (err) {
      if (callback) callback(err);
      throw err;
    }
  };

  TwitchApi.prototype.searchStreams = async function(searchQuery, callback) {
    if (!this.isAuthorized()) {
      const error = new Error('Not authorized');
      if (callback) callback(error);
      throw error;
    }

    if (!searchQuery) {
      const error = new Error('Search query is required');
      if (callback) callback(error);
      throw error;
    }

    try {
      // Use search/channels endpoint as that's what actually exists
      const data = await this.send('search/channels', { query: searchQuery });
      
      // Filter only live channels and transform to match stream format
      if (data && data.data) {
        const liveChannels = data.data.filter(channel => channel.is_live);
        
        // Transform channel data to match stream format expected by the UI
        const transformedStreams = liveChannels.map(channel => ({
          id: channel.id,
          user_id: channel.id,
          user_name: channel.broadcaster_login,
          user_login: channel.broadcaster_login,
          game_id: channel.game_id,
          game_name: channel.game_name,
          type: 'live',
          title: channel.title,
          viewer_count: 0, // Channel search doesn't provide viewer count
          started_at: channel.started_at || new Date().toISOString(),
          language: channel.broadcaster_language || 'en',
          thumbnail_url: `https://static-cdn.jtvnw.net/previews-ttv/live_user_${channel.broadcaster_login}-{width}x{height}.jpg`,
          tag_ids: [],
          is_mature: false,
          // Additional channel-specific fields
          name: channel.display_name,
          display_name: channel.display_name,
          profile_image_url: ''
        }));
        
        const processedData = {
          data: transformedStreams,
          pagination: data.pagination || {}
        };
        
        // Process thumbnails using existing function
        const finalData = this.processStreamThumbnails(processedData);
        
        if (callback) callback(null, finalData);
        return finalData;
      } else {
        const emptyData = { data: [], pagination: {} };
        if (callback) callback(null, emptyData);
        return emptyData;
      }
    } catch (err) {
      if (callback) callback(err);
      throw err;
    }
  };

  // Make TwitchApi available globally
  if (typeof self !== 'undefined') {
    self.TwitchApi = TwitchApi;
  }

}).call(this);