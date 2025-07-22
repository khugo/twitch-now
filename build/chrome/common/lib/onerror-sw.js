// Service Worker compatible error handling
(function() {
  
  // Replace window.onerror with service worker error handling
  self.addEventListener('error', function(event) {
    const msg = event.message || 'Unknown error';
    const filename = event.filename || 'unknown';
    const line = event.lineno || 0;
    const column = event.colno || 0;
    
    console.error(`Service Worker Error: ${msg} at ${filename}:${line}:${column}`);
    
    // Optional: Send error report to background analytics
    // but avoid external dependencies in service worker
  });

  self.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Prevent the default handling (which would log to console)
    event.preventDefault();
  });

})();