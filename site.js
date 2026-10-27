(function(){
  var nav=document.getElementById('nav'),btn=document.getElementById('menu-btn');
  if(btn&&nav){
    btn.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      btn.setAttribute('aria-expanded',open?'true':'false');
    });
    nav.addEventListener('click',function(e){
      if(e.target.tagName==='A'){nav.classList.remove('open');btn.setAttribute('aria-expanded','false');}
    });
  }
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els=document.querySelectorAll('.rise');
  if('IntersectionObserver' in window&&!reduce){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
    },{threshold:.1});
    els.forEach(function(s){io.observe(s);});
  } else { els.forEach(function(s){s.classList.add('in');}); }

  function sync(){document.body.classList.toggle('has-cookie-bar',!!document.querySelector('.cookie-bar'));}
  sync();
  new MutationObserver(sync).observe(document.body,{childList:true});

  var form=document.getElementById('contact-form');
  if(!form)return;
  var submit=document.getElementById('contact-submit'),status=document.getElementById('form-status');
  var SORRY='Something went wrong sending that. Please try again, or email hello@longshorestudio.co.uk.';
  form.addEventListener('submit',function(e){
    e.preventDefault();
    submit.disabled=true;status.textContent='';status.className='form-status';
    var fd=new FormData(form);
    var kind=fd.get('enquiry_type')||'Free trial';
    fd.set('subject','New enquiry ('+kind+') from the Longshore site');
    var attr=window.getAttribution?window.getAttribution():{};
    var pm=location.pathname.match(/^\/r\/([a-z0-9-]+)/);
    if(pm){attr.prospect=pm[1];}
    Object.keys(attr).forEach(function(k){fd.set(k,attr[k]);});
    fetch(form.action,{method:'POST',body:fd,headers:{'Accept':'application/json'}})
      .then(function(r){return r.json();})
      .then(function(d){
        submit.disabled=false;
        if(d.success){
          status.textContent="Thanks, that's with me. I'll reply by email within one working day.";
          status.className='form-status is-visible';
          form.reset();
          if(window.trackEvent){window.trackEvent('generate_lead',Object.assign({form_name:'contact',enquiry_type:kind,currency:'GBP',value:0},attr));}
        } else {status.textContent=SORRY;status.className='form-status is-visible err';}
      })
      .catch(function(){submit.disabled=false;status.textContent=SORRY;status.className='form-status is-visible err';});
  });
})();
