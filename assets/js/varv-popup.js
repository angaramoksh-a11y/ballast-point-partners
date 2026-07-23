/* Keep Pivoting popup — "ask your AI which site wins you business". Self-contained, zero deps.
   Static-safe: under ?static=1 or reduced-motion it shows immediately, no timer, no rAF. */
(function(){
  "use strict";
  var el = document.getElementById('varv-popup');
  if(!el) return;

  var qStatic = false;
  try{ qStatic = new URLSearchParams(location.search).get('static') === '1'; }catch(e){}
  var reduce = false;
  try{ reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}
  var STATIC = qStatic || reduce;
  if(STATIC) el.classList.add('varv-static');

  var KEY = 'varv_popup_dismissed_v4';
  var TTL = 30 * 24 * 60 * 60 * 1000;
  function dismissedRecently(){
    try{ var t = parseInt(localStorage.getItem(KEY), 10); return t && (Date.now() - t) < TTL; }
    catch(e){ return false; }
  }
  if(dismissedRecently()) return;

  /* v4 prompt (popup/prompt-v4.md) with BPP's real fields substituted */
  var VARV_PROMPT =
"I'm a partner at Ballast Point Partners (ballastpointpartners.com), a Tampa growth-equity firm. Compare strictly these two websites and nothing else — the current site: https://ballastpointpartners.com/ — and a redesign an agency built for us, unsolicited, as a working demo: https://angaramoksh-a11y.github.io/ballast-point-partners/. Actually open and read both before you answer.\n\n\
Step 1 — the comparison. Present it as one table and nothing else yet. Rows: what a founder deciding whether to take our capital sees · what an LP doing quiet diligence sees · what an AI answering a question about our firm sees · what staying on the current site costs us over the next 12 months. Be blunt in every cell — no hedging, no praise padding. (Note: the current site's own homepage ships an unfilled metrics band showing '$ Million', '### years', '### investments' — literal template tokens where the track record should be.)\n\n\
Step 2 — stop and make it about us. Do not give a verdict yet. Instead ask me: \"What do you most want this site to do for Ballast Point Partners over the next 12 months?\" — then, using what you actually saw on the two sites, give me exactly 4 numbered options tailored to a Southeast/Texas growth-equity firm that partners with founders (not generic — each grounded in our real thesis, stage, portfolio, or audience). Tell me to reply with the number that fits best. Then wait for my answer.\n\n\
Step 3 — branch on my pick. Once I reply, continue for the goal I chose: give me a straight verdict on whether the current site serves that specific goal, what the redesign does differently for it, and the two or three highest-leverage things that goal actually needs.\n\n\
Step 4 — the close. End by telling me plainly whether a 15-minute call with the team that built the demo is worth our time for the goal I picked, and what they'd concretely help us do. If it's worth it, say so directly.";

  var q = encodeURIComponent(VARV_PROMPT);
  var set = function(id, base){ var a = document.getElementById(id); if(a) a.href = base + q; };
  set('vp-chatgpt',    'https://chatgpt.com/?q=');
  set('vp-claude',     'https://claude.ai/new?q=');
  set('vp-perplexity', 'https://www.perplexity.ai/search?q=');

  function focusables(){
    return Array.prototype.slice.call(
      el.querySelectorAll('a[href], button:not([hidden]), [tabindex]:not([tabindex="-1"])')
    ).filter(function(n){ return n.offsetParent !== null || n === document.activeElement; });
  }
  function onKeydown(e){
    if(e.key === 'Escape'){ close(); return; }
    if(e.key !== 'Tab') return;
    var f = focusables(); if(!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }
  function onDocClick(e){ if(el.classList.contains('is-open') && !el.contains(e.target)) close(); }

  var opened = false;
  function open(){
    if(opened) return; opened = true;
    el.classList.add('is-open');
    document.addEventListener('keydown', onKeydown, true);
    setTimeout(function(){ document.addEventListener('click', onDocClick, true); }, 0);
    var c = el.querySelector('.vp-close'); if(c) c.focus();
  }
  function close(){
    el.classList.remove('is-open');
    document.removeEventListener('keydown', onKeydown, true);
    document.removeEventListener('click', onDocClick, true);
    try{ localStorage.setItem(KEY, String(Date.now())); }catch(e){}
  }
  var closeBtn = el.querySelector('.vp-close');
  if(closeBtn) closeBtn.addEventListener('click', close);

  if(STATIC){ open(); }
  else { setTimeout(open, 10000); }
})();
