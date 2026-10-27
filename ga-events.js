(function(){
  function trackEvent(name, params){
    if (window.gtag) {
      window.gtag('event', name, params || {});
    }
  }
  window.trackEvent = trackEvent;

  // Chat widget opened (the widget loads from another site, so listen for clicks on its launcher button).
  document.addEventListener('click', function(e){
    var t = e.target && e.target.closest ? e.target.closest('.ls-assistant-toggle') : null;
    if (t && t.getAttribute('aria-expanded') !== 'true') { trackEvent('chat_open'); }
  }, true); // capture phase: runs before the widget flips aria-expanded

  function wire(){
    document.querySelectorAll('a[href^="tel:"]').forEach(function(a){
      a.addEventListener('click', function(){
        trackEvent('phone_click', { link_url: a.getAttribute('href') });
      });
    });

    document.querySelectorAll('a[href^="mailto:"]').forEach(function(a){
      a.addEventListener('click', function(){
        trackEvent('email_click', { link_url: a.getAttribute('href') });
      });
    });

    document.querySelectorAll('[data-cta]').forEach(function(a){
      a.addEventListener('click', function(e){
        if (!window.gtag) return; // no consent yet -- let the click through untouched

        var href = a.getAttribute('href') || '';
        var samePage = href.charAt(0) === '#';
        if (samePage) {
          trackEvent('cta_click', { cta_location: a.dataset.cta });
          return;
        }

        // This link navigates to a different page. Firing the event and letting
        // the browser unload immediately risks losing the hit, so hold navigation
        // briefly until the event has a chance to send (Google's own recommended
        // pattern for tracking clicks that leave the page).
        e.preventDefault();
        var navigated = false;
        function go(){
          if (navigated) return;
          navigated = true;
          window.location.href = href;
        }
        window.gtag('event', 'cta_click', {
          cta_location: a.dataset.cta,
          event_callback: go,
          event_timeout: 500
        });
        setTimeout(go, 500);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
