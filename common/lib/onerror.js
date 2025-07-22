// Guard window access for service worker compatibility
if (typeof window !== 'undefined') {
  window.onerror = function (msg, url, line, column, err){
    var msgError = msg + " in " + url + " (line: " + line + ")";
    console.error(msgError);

    chrome.runtime.sendMessage({
      action: "stat",
      method: "sendEvent",
      args  : [
        "Errors",
        chrome.runtime.getManifest().version,
        {
          ua   : window.navigator.userAgent,
          msg  : msg,
          url  : url,
          line : line,
          trace: err && err.stack || ""
        }
      ]
    })
  };
} else {
  // Service worker error handling
  self.addEventListener('error', function(event) {
    var msg = event.message || 'Unknown error';
    var filename = event.filename || 'unknown';
    var line = event.lineno || 0;
    var msgError = msg + " in " + filename + " (line: " + line + ")";
    console.error(msgError);

    chrome.runtime.sendMessage({
      action: "stat",
      method: "sendEvent",
      args  : [
        "Errors",
        chrome.runtime.getManifest().version,
        {
          ua   : 'ServiceWorker',
          msg  : msg,
          url  : filename,
          line : line,
          trace: event.error && event.error.stack || ""
        }
      ]
    })
  });
}