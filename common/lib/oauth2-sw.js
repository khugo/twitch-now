// Service Worker compatible OAuth2 implementation
(function () {
  const that = {};

  function noop() {}

  that._adapters = {};

  const request = function (opts, callback) {
    const fetchOptions = {
      method: opts.method || 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    if (opts.data && opts.method === 'POST') {
      if (typeof opts.data === 'object') {
        const params = new URLSearchParams();
        for (const key in opts.data) {
          params.append(key, opts.data[key]);
        }
        fetchOptions.body = params.toString();
      } else {
        fetchOptions.body = opts.data;
      }
    }

    fetch(opts.url, fetchOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      })
      .then(data => callback(null, data))
      .catch(err => callback(err));
  };

  const Adapter = function (id, opts, flow) {
    this.lsPath = "oauth2_" + id;
    this.opts = opts;
    this.responseType = this.opts.response_type;
    this.flowType = flow || "codeflow";
    this.apiBase = opts.api;
    this.clientId = opts.client_id;
    this.clientSecret = opts.client_secret;
    this.scope = opts.scope;
    this.redirectUri = opts.redirect_uri;
  };

  Adapter.prototype.getData = async function() {
    return bgApp.get(this.lsPath);
  };

  Adapter.prototype.setData = async function(data) {
    return bgApp.set(this.lsPath, data);
  };

  Adapter.prototype.removeData = async function() {
    return bgApp.del(this.lsPath);
  };

  Adapter.prototype.isAuthorized = async function() {
    const data = await this.getData();
    return !!(data && data.access_token);
  };

  Adapter.prototype.getAccessToken = async function() {
    const data = await this.getData();
    return data ? data.access_token : null;
  };

  Adapter.prototype.authorize = function(callback) {
    callback = callback || noop;
    
    const url = this.apiBase + 
      "?client_id=" + encodeURIComponent(this.clientId) +
      "&redirect_uri=" + encodeURIComponent(this.redirectUri) +
      "&response_type=" + encodeURIComponent(this.responseType) +
      "&scope=" + encodeURIComponent(this.scope);

    chrome.tabs.create({ url: url }, (tab) => {
      const checkTab = () => {
        chrome.tabs.get(tab.id, (currentTab) => {
          if (chrome.runtime.lastError) {
            callback(new Error("Authorization cancelled"));
            return;
          }
          
          if (currentTab && currentTab.url && currentTab.url.includes(this.redirectUri)) {
            const urlParams = new URLSearchParams(currentTab.url.split('#')[1] || '');
            const accessToken = urlParams.get('access_token');
            
            if (accessToken) {
              const tokenData = {
                access_token: accessToken,
                token_type: urlParams.get('token_type'),
                scope: urlParams.get('scope')
              };
              
              this.setData(tokenData).then(() => {
                chrome.tabs.remove(tab.id);
                callback(null, tokenData);
              });
            } else {
              callback(new Error("No access token received"));
            }
          } else {
            setTimeout(checkTab, 1000);
          }
        });
      };
      
      checkTab();
    });
  };

  that.addAdapter = function(config) {
    
    const id = config.id;
    const opts = config.opts;
    const flow = config.codeflow;
    
    
    const adapter = new Adapter(id, opts, flow);
    that._adapters[id] = adapter;
    return adapter;
  };

  if (typeof self !== 'undefined') {
    self.OAuth2 = that;
  }
  
  if (typeof globalThis !== 'undefined') {
    globalThis.OAuth2 = that;
  }

}).call(self);