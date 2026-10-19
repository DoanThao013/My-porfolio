(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hero = document.getElementById('top');

  /* ---- Theme toggle ---- */
  var themeBtn = document.getElementById('theme');
  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function themeLabel() {
    themeBtn.textContent = isDark() ? 'Day sky' : 'Night sky';
    themeBtn.setAttribute('aria-pressed', String(isDark()));
  }
  try { var saved = localStorage.getItem('storybook-theme'); if (saved) root.setAttribute('data-theme', saved); } catch (e) {}
  themeLabel();
  themeBtn.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('storybook-theme', next); } catch (e) {}
    themeLabel();
  });

  /* ---- Lanterns ---- */
  var field = document.getElementById('lanterns');
  function lantern(opts) {
    var el = document.createElement('span');
    var size = opts.size;
    el.className = 'lantern' + (opts.once ? ' once' : '');
    el.style.width = size + 'px';
    el.style.height = Math.round(size * 1.3) + 'px';
    el.style.left = opts.left + '%';
    el.style.setProperty('--dur', opts.dur + 's');
    el.style.setProperty('--delay', opts.delay + 's');
    el.style.setProperty('--sway', opts.sway + 'px');
    el.style.setProperty('--rise', opts.rise + 'px');
    if (reduce) { el.style.bottom = 'auto'; el.style.top = opts.top + '%'; }
    field.appendChild(el);
    return el;
  }
  function seedLanterns() {
    var n = window.innerWidth < 600 ? 10 : 18;
    var rise = hero.offsetHeight + 120;
    for (var i = 0; i < n; i++) {
      var dur = 16 + Math.random() * 14;
      lantern({
        size: 12 + Math.random() * 24,
        left: 3 + Math.random() * 94,
        dur: dur,
        delay: -Math.random() * dur,
        sway: (Math.random() - 0.5) * 70,
        rise: rise,
        top: 8 + Math.random() * 70
      });
    }
  }
  seedLanterns();

  /* ---- Fireworks ---- */
  var cv = document.getElementById('fx');
  var ctx = cv.getContext ? cv.getContext('2d') : null;
  var parts = [], raf = 0, fw = 0, fh = 0;
  var palette = ['#FFD98A', '#FF9ECB', '#C9B6FF', '#FFFFFF', '#9FD8FF', '#FFB36B'];
  function fitCanvas() {
    var r = hero.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    fw = r.width; fh = r.height;
    cv.width = Math.round(fw * dpr); cv.height = Math.round(fh * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function burst(x, y) {
    var c1 = palette[Math.floor(Math.random() * palette.length)];
    var c2 = palette[Math.floor(Math.random() * palette.length)];
    var n = 46;
    for (var i = 0; i < n; i++) {
      var a = (Math.PI * 2 * i) / n + Math.random() * 0.12;
      var sp = 1.6 + Math.random() * 2.8;
      parts.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, decay: 0.010 + Math.random() * 0.010, c: i % 3 ? c1 : c2, r: 1.5 + Math.random() * 1.5 });
    }
  }
  function tick() {
    ctx.clearRect(0, 0, fw, fh);
    var alive = [];
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.985; p.vy = p.vy * 0.985 + 0.04;
      p.life -= p.decay;
      if (p.life > 0) {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        alive.push(p);
      }
    }
    ctx.globalAlpha = 1;
    parts = alive;
    raf = parts.length ? requestAnimationFrame(tick) : 0;
  }
  function fireworks() {
    if (reduce || !ctx) return;
    fitCanvas();
    [0, 260, 540].forEach(function (delay) {
      setTimeout(function () {
        burst(fw * (0.15 + Math.random() * 0.7), fh * (0.1 + Math.random() * 0.35));
        if (!raf) raf = requestAnimationFrame(tick);
      }, delay);
    });
  }

  /* ---- Castle wish ---- */
  var wishes = [
    'I wish for the courage to keep learning, even when the path is uncertain.',
    'I wish to build things that make life a little better for others.',
    'I wish for meaningful work, kind people, and the chance to grow together.',
    'I wish to meet every challenge with patience, curiosity, and resilience.',
    'I wish for success that leaves room for health, family, and joy.',
    'I wish to be proud not only of what I achieve, but also of how I get there.',
    'I wish to turn setbacks into lessons and keep moving forward with hope.',
    'I wish to have the wisdom to choose what matters and the courage to follow it.',
    'I wish to share what I learn and help others find their own way forward.',
    'I wish for small moments of gratitude to make even ordinary days feel special.'
  ];
  var wishEl = document.getElementById('wish');
  var castleBtn = document.getElementById('castle');
  castleBtn.addEventListener('animationend', function (e) {
    if (e.animationName === 'castle-glow') castleBtn.classList.remove('glowing');
  });
  castleBtn.addEventListener('click', function () {
    wishEl.textContent = wishes[Math.floor(Math.random() * wishes.length)];
    wishEl.classList.remove('pop');
    void wishEl.offsetWidth;
    wishEl.classList.add('pop');
    fireworks();
    if (!reduce) {
      castleBtn.classList.remove('glowing');
      void castleBtn.offsetWidth;
      castleBtn.classList.add('glowing');
      for (var i = 0; i < 4; i++) {
        var el = lantern({ size: 18 + Math.random() * 14, left: 38 + Math.random() * 24, dur: 9 + Math.random() * 4, delay: 0, sway: (Math.random() - 0.5) * 60, rise: hero.offsetHeight + 40, top: 0, once: true });
        el.style.bottom = (4 + Math.random() * 12) + '%';
        (function (node) { setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, 14000); })(el);
      }
    }
  });

  /* ---- Skill highlighting ---- */
  var chips = Array.prototype.slice.call(document.querySelectorAll('.skill'));
  var tagged = Array.prototype.slice.call(document.querySelectorAll('[data-skills]'));
  var statusEl = document.getElementById('skill-status');
  var clearBtn = document.getElementById('skill-clear');
  var active = null;
  function has(el, k) { return (' ' + el.getAttribute('data-skills') + ' ').indexOf(' ' + k + ' ') > -1; }
  function paintSkill() {
    var quests = 0, notes = 0, label = '';
    chips.forEach(function (c) {
      var on = c.getAttribute('data-skill') === active;
      c.setAttribute('aria-pressed', String(on));
      if (on) label = c.textContent;
    });
    tagged.forEach(function (el) {
      if (!active) { el.classList.remove('dim', 'hit'); return; }
      var m = has(el, active);
      el.classList.toggle('hit', m);
      el.classList.toggle('dim', !m);
      if (m) { if (el.classList.contains('quest')) quests += 1; else notes += 1; }
    });
    clearBtn.hidden = !active;
    if (!active) { statusEl.textContent = 'Nothing selected yet.'; return; }
    if (!quests && !notes) { statusEl.textContent = 'No quest or chapter here is tagged with ' + label + ' yet.'; return; }
    var parts2 = [];
    if (quests) parts2.push(quests + (quests === 1 ? ' quest' : ' quests'));
    if (notes) parts2.push(notes + (notes === 1 ? ' chapter note' : ' chapter notes'));
    statusEl.textContent = label + ' appears in ' + parts2.join(' and ') + '.';
  }
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var k = c.getAttribute('data-skill');
      active = active === k ? null : k;
      paintSkill();
    });
  });
  clearBtn.addEventListener('click', function () { active = null; paintSkill(); });

  /* ---- Sticky tabs: follow the reader ---- */
  var nav = document.querySelector('.tabs');
  var scroller = document.getElementById('tabs-scroll');
  var bar = document.getElementById('progress');
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var secs = tabs.map(function (t) { return document.getElementById(t.getAttribute('data-target')); });
  var lastCur = -1, ticking = false;
  function spy() {
    ticking = false;
    var doc = document.documentElement;
    var y = window.pageYOffset || doc.scrollTop || 0;
    var line = nav.offsetHeight + Math.min(180, window.innerHeight * 0.3);
    var cur = 0;
    secs.forEach(function (s, i) { if (s.getBoundingClientRect().top <= line) cur = i; });
    if (window.innerHeight + y >= doc.scrollHeight - 4) cur = secs.length - 1;
    tabs.forEach(function (t, i) {
      var on = i === cur;
      t.classList.toggle('on', on);
      if (on) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
    });
    if (cur !== lastCur) {
      lastCur = cur;
      var t = tabs[cur];
      var left = t.offsetLeft - (scroller.clientWidth - t.offsetWidth) / 2;
      try { scroller.scrollTo({ left: left, behavior: reduce ? 'auto' : 'smooth' }); } catch (e) { scroller.scrollLeft = left; }
    }
    var max = doc.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? Math.min(1, Math.max(0, y / max)) * 100 : 0) + '%';
  }
  function queue() { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  tabs.forEach(function (t) {
    t.addEventListener('click', function (e) {
      var target = document.getElementById(t.getAttribute('data-target'));
      if (!target) return;
      e.preventDefault();
      try { target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); } catch (err) { target.scrollIntoView(); }
    });
  });
  spy();

  /* ---- Copy buttons ---- */
  var status = document.getElementById('status');
  function fallback(btn) {
    var r = document.createRange(); r.selectNodeContents(btn);
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    status.textContent = 'Selected. Use your keyboard to copy.';
  }
  document.querySelectorAll('.copy[data-value]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var v = btn.getAttribute('data-value');
      try {
        navigator.clipboard.writeText(v).then(function () { status.textContent = 'Copied ' + v; }, function () { fallback(btn); });
      } catch (e) { fallback(btn); }
    });
  });
})();
