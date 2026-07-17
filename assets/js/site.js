/* Ballast Point Partners — shared behaviour: mobile nav, scroll reveal, seeded count-ups.
   Static-safe: under ?static=1 or prefers-reduced-motion everything is already in its
   final state (set by the inline head script adding html.static), so this bails early. */
(function () {
  'use strict';
  var root = document.documentElement;
  var animOK = root.classList.contains('anim');
  try { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { animOK = false; } }
  catch (e) { animOK = false; }

  /* Close mobile nav after choosing a link */
  var navBox = document.getElementById('nav-t');
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () { if (navBox) { navBox.checked = false; } });
  });

  if (!animOK || !('IntersectionObserver' in window)) { return; }

  /* Scroll reveal */
  var revealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); revealIO.unobserve(en.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { revealIO.observe(el); });

  /* Seeded count-ups: HTML already holds the FINAL real value; animate 40%->target, then restore. */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (!target || target <= 0) { return; }
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var finalText = el.textContent;
    var from = Math.max(1, Math.round(target * 0.4));
    var dur = 1100, start = null;
    function step(ts) {
      if (start === null) { start = ts; }
      var t = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      var val = Math.round(from + (target - from) * eased);
      el.textContent = prefix + val + suffix;
      if (t < 1) { window.requestAnimationFrame(step); }
      else { el.textContent = finalText; }
    }
    window.requestAnimationFrame(step);
  }
  var countIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { countUp(en.target); countIO.unobserve(en.target); }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.count').forEach(function (el) { countIO.observe(el); });
})();
