(function(){
  var GA_ID = 'G-X54DSEF7KS';
  var KEY = 'ls_analytics_consent';
  var saved = localStorage.getItem(KEY);

  function loadGA(){
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  if (saved === 'granted') { loadGA(); return; }
  if (saved === 'denied') { return; }

  function showBanner(){
    var bar = document.createElement('div');
    bar.className = 'cookie-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Cookie notice');
    bar.innerHTML =
      '<p>This site uses analytics cookies to see how it’s doing — no ads, nothing sold on.</p>' +
      '<div class="cookie-actions">' +
      '<button type="button" class="btn btn-secondary btn-sm" id="cookie-reject">Reject</button>' +
      '<button type="button" class="btn btn-primary btn-sm" id="cookie-accept">Accept</button>' +
      '</div>';
    document.body.appendChild(bar);
    document.getElementById('cookie-accept').addEventListener('click', function(){
      localStorage.setItem(KEY, 'granted');
      loadGA();
      bar.remove();
    });
    document.getElementById('cookie-reject').addEventListener('click', function(){
      localStorage.setItem(KEY, 'denied');
      bar.remove();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showBanner);
  } else {
    showBanner();
  }
})();
