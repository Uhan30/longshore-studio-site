(function(){
  var KEY = 'ls_attribution';
  var WINDOW_MS = 30 * 24 * 60 * 60 * 1000; // 30 days -- see 01 Business/Process/ga4-event-tracking.md
  var FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];

  function captureFromUrl(){
    var params = new URLSearchParams(window.location.search);
    var found = {};
    var any = false;
    FIELDS.forEach(function(f){
      var v = params.get(f);
      if (v) { found[f] = v; any = true; }
    });
    // Last-touch model: a new UTM-tagged landing overwrites whatever was stored
    // before, even if that older touch is still inside the 30-day window.
    if (any) {
      found.captured_at = Date.now();
      try { localStorage.setItem(KEY, JSON.stringify(found)); } catch(e) { /* storage unavailable, fail quiet */ }
    }
  }

  function getAttribution(){
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return {};
      var data = JSON.parse(raw);
      if (!data.captured_at || (Date.now() - data.captured_at) > WINDOW_MS) return {};
      var out = {};
      FIELDS.forEach(function(f){
        if (data[f]) out[f] = data[f];
      });
      return out;
    } catch(e) {
      return {};
    }
  }

  // Read-only against the URL -- never rewrites it, so GA4's own standard
  // acquisition tracking sees the same query string it always would.
  captureFromUrl();
  window.getAttribution = getAttribution;
})();
