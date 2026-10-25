/* ============================================================
   CONFIG
   Change the email below, everything else is wired.
   ============================================================ */
const CONFIG = {
  email: 'work.contactmax@gmail.com',
  linkedin: 'https://www.linkedin.com/in/sagnik-ghosh-3b4a25446/',
  github: 'https://github.com/sagnikgitmax'
};

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, n) => a + (b - a) * n;

  /* ---------------- config wiring ---------------- */
  document.querySelectorAll('[data-email-text]').forEach(el => el.textContent = CONFIG.email);
  document.querySelectorAll('[data-email-link]').forEach(el => {
    el.href = 'mailto:' + CONFIG.email + '?subject=Hello%20Sagnik';
  });
  document.querySelectorAll('[data-linkedin]').forEach(el => {
    el.href = CONFIG.linkedin; el.target = '_blank'; el.rel = 'noopener';
  });
  document.querySelectorAll('[data-github]').forEach(el => {
    el.href = CONFIG.github; el.target = '_blank'; el.rel = 'noopener';
  });
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- copy email ---------------- */
  const emailLink = document.querySelector('[data-email-link]');
  const copyNote = document.getElementById('copy-note');
  if (emailLink) {
    emailLink.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      if (!navigator.clipboard) return;
      e.preventDefault();
      navigator.clipboard.writeText(CONFIG.email).then(() => {
        if (!copyNote) return;
        copyNote.style.opacity = '1';
        clearTimeout(window.__copyT);
        window.__copyT = setTimeout(() => { copyNote.style.opacity = '0'; }, 1800);
      }).catch(() => { window.location.href = 'mailto:' + CONFIG.email; });
    });
  }

  /* ---------------- giant band ---------------- */
  const bandTrack = document.getElementById('band-track');
  if (bandTrack) {
    const words = ['Safety tech', 'Hardware', 'Community', 'Leadership', 'Java', 'Building'];
    let html = '';
    for (let pass = 0; pass < 2; pass++) {
      for (const w of words) {
        html += `<span${w === 'Safety tech' ? ' class="fill"' : ''}>${w}</span><i>✳</i>`;
      }
    }
    bandTrack.innerHTML = html;
  }

  /* ---------------- skill marquees ---------------- */
  function fillMarquee(id, items) {
    const el = document.getElementById(id);
    if (!el) return;
    const group = items.map(t => `<span class="pill"><i></i>${t}</span>`).join('');
    el.innerHTML = group + group;
  }
  fillMarquee('marquee-1', ['Java', 'ESP32', 'GPS modules', 'Embedded systems', 'App development', 'AI agents', 'Prompt engineering', 'Cybersecurity', 'Prototyping', 'Public speaking', 'Team management', 'Leadership']);
  fillMarquee('marquee-2', ['Personal safety tech', 'Hardware hacking', 'Community networks', 'Emergency response', 'Student government', 'Physics Olympiad', 'Chemistry Olympiad', 'Open schooling', 'English', 'Bengali', 'Hindi']);

  /* ============================================================
     Shared pointer state
     ============================================================ */
  const pointer = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.3 };

  window.addEventListener('pointermove', e => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  }, { passive: true });

  /* ============================================================
     Custom cursor + ambient light
     ============================================================ */
  const cursor = document.getElementById('cursor');
  const cDot = document.getElementById('cursor-dot');
  const cRing = document.getElementById('cursor-ring');
  const cLabel = document.getElementById('cursor-label');
  const glow = document.getElementById('glow');

  const cur = { x: pointer.x, y: pointer.y };
  const ring = { x: pointer.x, y: pointer.y };
  const gl = { x: pointer.x, y: pointer.y };

  if (finePointer) {
    document.documentElement.classList.add('cursorless');

    window.addEventListener('pointermove', () => {
      cursor.classList.add('on');
      glow.classList.add('on');
    }, { passive: true });

    window.addEventListener('pointerdown', () => cursor.classList.add('press'));
    window.addEventListener('pointerup', () => cursor.classList.remove('press'));
    document.addEventListener('pointerleave', () => {
      cursor.classList.remove('on');
      glow.classList.remove('on');
    });

    document.querySelectorAll('a, button, [data-cursor]').forEach(t => {
      t.addEventListener('pointerenter', () => {
        const label = t.getAttribute('data-cursor');
        cursor.classList.add('grow');
        if (label && cLabel) cLabel.textContent = label;
      });
      t.addEventListener('pointerleave', () => {
        cursor.classList.remove('grow');
        if (cLabel) cLabel.textContent = 'View';
      });
    });
  }

  function cursorTick() {
    if (!finePointer) return;
    const dx = pointer.x - cur.x, dy = pointer.y - cur.y;
    const rx = pointer.x - ring.x, ry = pointer.y - ring.y;
    const gx = pointer.x - gl.x, gy = pointer.y - gl.y;
    if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05 &&
        Math.abs(rx) < 0.05 && Math.abs(ry) < 0.05 &&
        Math.abs(gx) < 0.05 && Math.abs(gy) < 0.05) return;

    cur.x = lerp(cur.x, pointer.x, 0.55); cur.y = lerp(cur.y, pointer.y, 0.55);
    ring.x = lerp(ring.x, pointer.x, 0.16); ring.y = lerp(ring.y, pointer.y, 0.16);
    gl.x = lerp(gl.x, pointer.x, 0.08); gl.y = lerp(gl.y, pointer.y, 0.08);

    cDot.style.transform = `translate3d(${cur.x}px,${cur.y}px,0) translate(-50%,-50%)`;
    cRing.style.transform = `translate3d(${ring.x}px,${ring.y}px,0) translate(-50%,-50%)`;
    glow.style.transform = `translate3d(${gl.x}px,${gl.y}px,0) translate(-50%,-50%)`;
  }

  /* ============================================================
     Hero: name shine + card parallax
     ============================================================ */
  const hero = document.querySelector('.hero');
  const displayWrap = document.getElementById('display-wrap');
  const idcard = document.getElementById('idcard');
  let heroHover = false;
  let hxT = 0, hyT = 0, hx = 0, hy = 0;

  if (hero && finePointer && !reduceMotion) {
    hero.addEventListener('pointerenter', () => { heroHover = true; });
    hero.addEventListener('pointerleave', () => {
      heroHover = false;
      hxT = 0; hyT = 0;
      if (displayWrap) {
        displayWrap.style.setProperty('--mx', '-999px');
        displayWrap.style.setProperty('--my', '-999px');
      }
    });
    hero.addEventListener('pointermove', e => {
      const hr = hero.getBoundingClientRect();
      hxT = ((e.clientX - hr.left) / hr.width - 0.5) * 2;
      hyT = ((e.clientY - hr.top) / hr.height - 0.5) * 2;
      if (displayWrap) {
        const r = displayWrap.getBoundingClientRect();
        displayWrap.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        displayWrap.style.setProperty('--my', (e.clientY - r.top) + 'px');
      }
    }, { passive: true });
  }

  function heroTick() {
    if (!finePointer || reduceMotion || !idcard) return;
    if (!heroHover && Math.abs(hx) < 0.001 && Math.abs(hy) < 0.001) return;
    hx = lerp(hx, hxT, 0.07); hy = lerp(hy, hyT, 0.07);
    idcard.style.transform = `perspective(1200px) rotateY(${hx * 4}deg) rotateX(${-hy * 4}deg) translate3d(${hx * 6}px, ${hy * 6}px, 0)`;
  }

  /* ============================================================
     Spotlight (composited, no repaint) + 3D tilt + magnetic buttons
     ============================================================ */
  if (finePointer) {
    document.querySelectorAll('[data-glow]').forEach(el => {
      const target = el.querySelector('[data-glow-target]') || el;
      el.addEventListener('pointermove', e => {
        const r = target.getBoundingClientRect();
        const tx = (e.clientX - r.left - 230).toFixed(0) + 'px';
        const ty = (e.clientY - r.top - 230).toFixed(0) + 'px';
        target.style.setProperty('--tx', tx);
        target.style.setProperty('--ty', ty);
        if (target !== el) { el.style.setProperty('--tx', tx); el.style.setProperty('--ty', ty); }
      }, { passive: true });
    });

    document.querySelectorAll('[data-tilt]').forEach(el => {
      if (reduceMotion) return;
      let raf = null;
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = null;
          el.style.transform = `perspective(1100px) rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 8}deg)`;
        });
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg)';
      });
    });

    if (!reduceMotion) {
      document.querySelectorAll('[data-magnetic]').forEach(btn => {
        btn.addEventListener('pointermove', e => {
          const r = btn.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * 0.12;
          const y = (e.clientY - r.top - r.height / 2) * 0.18;
          btn.style.transform = `translate(${x}px, ${y}px)`;
          btn.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
          btn.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
        });
        btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
      });
    }
  }

  /* ============================================================
     Aurora — low-res canvas upscaled by the browser (no CSS blur)
     ============================================================ */
  const aurora = document.getElementById('aurora');
  let drawAurora = function () {};
  if (aurora) {
    const actx = aurora.getContext('2d');
    const blobs = [
      { x: .22, y: .26, r: .42, c: [20, 184, 166], o: .5 },
      { x: .76, y: .18, r: .34, c: [15, 118, 110], o: .42 },
      { x: .60, y: .70, r: .36, c: [56, 189, 178], o: .28 },
      { x: .12, y: .80, r: .32, c: [13, 148, 136], o: .26 }
    ];
    const SCALE = 0.2;

    function sizeAurora() {
      const w = aurora.clientWidth || window.innerWidth;
      const h = aurora.clientHeight || window.innerHeight;
      aurora.width = Math.max(2, Math.round(w * SCALE));
      aurora.height = Math.max(2, Math.round(h * SCALE));
    }

    drawAurora = function (now) {
      const w = aurora.width, h = aurora.height;
      const t = now * 0.001;
      actx.clearRect(0, 0, w, h);
      actx.globalCompositeOperation = 'lighter';
      const mx = (pointer.x / Math.max(1, window.innerWidth)) * w;
      const my = (pointer.y / Math.max(1, window.innerHeight)) * h;

      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];
        const bx = (b.x + Math.sin(t * 0.11 + i * 2.1) * 0.045) * w;
        const by = (b.y + Math.cos(t * 0.09 + i * 1.7) * 0.04) * h;
        const pullX = bx + (mx - bx) * 0.12;
        const pullY = by + (my - by) * 0.12;
        const radius = b.r * Math.max(w, h) * (1 + Math.sin(t * 0.23 + i) * 0.06);
        const g = actx.createRadialGradient(pullX, pullY, 0, pullX, pullY, radius);
        g.addColorStop(0, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},${b.o * 0.5})`);
        g.addColorStop(0.5, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},${b.o * 0.14})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        actx.fillStyle = g;
        actx.fillRect(pullX - radius, pullY - radius, radius * 2, radius * 2);
      }
      actx.globalCompositeOperation = 'source-over';
    };

    sizeAurora();
    window.addEventListener('resize', () => {
      clearTimeout(window.__auroraT);
      window.__auroraT = setTimeout(sizeAurora, 220);
    });
  }

  /* ============================================================
     Particle constellation — one batched path for all links
     ============================================================ */
  const fieldCanvas = document.getElementById('field');
  let drawField = function () {};
  if (fieldCanvas) {
    const ctx = fieldCanvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, particles = [];
    const LINK = 125, LINK2 = LINK * LINK;

    function resizeField() {
      W = fieldCanvas.clientWidth || window.innerWidth;
      H = fieldCanvas.clientHeight || window.innerHeight;
      fieldCanvas.width = Math.round(W * dpr);
      fieldCanvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = clamp(Math.round((W * H) / 26000), 16, 56);
      particles = new Array(count).fill(0).map(() => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.3 + 0.4
      }));
    }

    drawField = function () {
      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20;
        if (p.y > H + 20) p.y = -20;

        if (finePointer) {
          const dx = p.x - pointer.x, dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 20000 && d2 > 0.01) {
            const f = (1 - d2 / 20000) * 1.1;
            const d = Math.sqrt(d2);
            p.x += (dx / d) * f; p.y += (dy / d) * f;
          }
        }
      }

      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          if (dx * dx + dy * dy < LINK2) {
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
          }
        }
      }
      ctx.strokeStyle = 'rgba(127,214,208,0.12)';
      ctx.lineWidth = 0.7;
      ctx.stroke();

      ctx.beginPath();
      for (const p of particles) {
        ctx.moveTo(p.x + p.r, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      }
      ctx.fillStyle = 'rgba(127,214,208,0.45)';
      ctx.fill();
    };

    resizeField();
    window.addEventListener('resize', () => {
      clearTimeout(window.__fieldT);
      window.__fieldT = setTimeout(resizeField, 180);
    });
  }

  /* ============================================================
     Radar — conic-gradient sweep (no 44 wedges = no fan aliasing)
     ============================================================ */
  const radar = document.getElementById('radar');
  let drawRadar = function () {};
  let radarInView = true;
  if (radar) {
    const rctx = radar.getContext('2d');
    const blips = [
      { r: 0.34, a: 0.4 }, { r: 0.58, a: 1.9 }, { r: 0.42, a: 3.1 },
      { r: 0.74, a: 4.2 }, { r: 0.5, a: 5.2 }, { r: 0.86, a: 2.4 },
      { r: 0.66, a: 0.9 }
    ];
    let sweep = -0.6, hover = 0, targetHover = 0, prev = 0;
    window.__radar = { get sweep() { return sweep; }, get hover() { return hover; } };
    const wrap = radar.parentElement;

    if (wrap) {
      wrap.addEventListener('pointerenter', () => { targetHover = 1; });
      wrap.addEventListener('pointerleave', () => { targetHover = 0; });
    }

    drawRadar = function (now) {
      const dt = prev ? Math.min(now - prev, 90) : 16;      prev = now;
      hover += (targetHover - hover) * 0.06;
      // accumulated, clamped delta: a throttled tab can never make it spin
      sweep = (sweep + dt * 0.00042 * (1 + hover * 0.55)) % (Math.PI * 2);

      const size = radar.width, c = size / 2, R = c * 0.86;
      rctx.clearRect(0, 0, size, size);

      for (let i = 1; i <= 4; i++) {
        rctx.beginPath();
        rctx.arc(c, c, (R / 4) * i, 0, Math.PI * 2);
        rctx.strokeStyle = `rgba(127,214,208,${0.05 + i * 0.018})`;
        rctx.lineWidth = 1.3;
        rctx.stroke();
      }
      rctx.strokeStyle = 'rgba(127,214,208,0.06)';
      rctx.lineWidth = 1;
      rctx.beginPath();
      rctx.moveTo(c - R, c); rctx.lineTo(c + R, c);
      rctx.moveTo(c, c - R); rctx.lineTo(c, c + R);
      rctx.stroke();

      const WEDGE = 1.15;
      if (rctx.createConicGradient) {
        const g = rctx.createConicGradient(sweep - WEDGE, c, c);
        const f = WEDGE / (Math.PI * 2);
        g.addColorStop(0, 'rgba(127,214,208,0)');
        g.addColorStop(f * 0.45, 'rgba(127,214,208,0.035)');
        g.addColorStop(f * 0.8, 'rgba(127,214,208,0.13)');
        g.addColorStop(f * 0.97, 'rgba(127,214,208,0.3)');
        g.addColorStop(f * 0.999, 'rgba(163,240,233,0.34)');
        g.addColorStop(f, 'rgba(127,214,208,0)');
        g.addColorStop(1, 'rgba(127,214,208,0)');
        rctx.fillStyle = g;
        rctx.beginPath();
        rctx.moveTo(c, c);
        rctx.arc(c, c, R, 0, Math.PI * 2);
        rctx.fill();
      } else {
        rctx.beginPath();
        rctx.moveTo(c, c);
        rctx.arc(c, c, R, sweep - WEDGE, sweep);
        rctx.closePath();
        rctx.fillStyle = 'rgba(127,214,208,0.16)';
        rctx.fill();
      }

      rctx.beginPath();
      rctx.moveTo(c, c);
      rctx.lineTo(c + Math.cos(sweep) * R, c + Math.sin(sweep) * R);
      rctx.strokeStyle = 'rgba(163,240,233,0.5)';
      rctx.lineWidth = 1.6;
      rctx.stroke();

      for (const b of blips) {
        const bx = c + Math.cos(b.a) * R * b.r;
        const by = c + Math.sin(b.a) * R * b.r;
        let diff = Math.abs(((sweep - b.a) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2));
        if (diff > Math.PI) diff = Math.PI * 2 - diff;
        const glowAmt = Math.max(0, 1 - diff / 1.5);
        const alpha = clamp(0.16 + glowAmt * 0.85, 0, 1);

        rctx.beginPath();
        rctx.arc(bx, by, 3.2 + glowAmt * 2.6, 0, Math.PI * 2);
        rctx.fillStyle = `rgba(20,184,166,${alpha})`;
        rctx.fill();

        rctx.beginPath();
        rctx.arc(bx, by, 11 + glowAmt * 11, 0, Math.PI * 2);
        rctx.strokeStyle = `rgba(127,214,208,${alpha * 0.32})`;
        rctx.lineWidth = 1.1;
        rctx.stroke();
      }

      const cp = 0.6 + Math.sin(now * 0.004) * 0.4;
      const cg = rctx.createRadialGradient(c, c, 0, c, c, 34);
      cg.addColorStop(0, `rgba(127,214,208,${0.28 + cp * 0.14})`);
      cg.addColorStop(0.4, `rgba(127,214,208,${0.1 + cp * 0.05})`);
      cg.addColorStop(1, 'rgba(127,214,208,0)');
      rctx.fillStyle = cg;
      rctx.beginPath();
      rctx.arc(c, c, 34, 0, Math.PI * 2);
      rctx.fill();

      rctx.beginPath();
      rctx.arc(c, c, 6, 0, Math.PI * 2);
      rctx.fillStyle = '#7fd6d0';
      rctx.fill();
    };

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => {
        es.forEach(e => { radarInView = e.isIntersecting; });
      }, { rootMargin: '80px' }).observe(radar);
    }

    const resp = document.getElementById('responders');
    if (resp && !reduceMotion) {
      const counts = [5, 6, 7, 8, 7, 6, 9, 7];
      let ci = 0;
      setInterval(() => {
        ci = (ci + 1) % counts.length;
        resp.textContent = counts[ci];
      }, 4200);
    }
  }

  /* ============================================================
     Marquees — direction follows the scroll, speed follows velocity
     ============================================================ */
  const drifts = [];
  function measureDrift(d) {
    const kids = d.el.children;
    if (kids.length > d.halfIndex + 1) {
      d.half = Math.abs(kids[d.halfIndex].offsetLeft - kids[0].offsetLeft);
    } else {
      d.half = d.el.scrollWidth / 2;
    }
  }
  function makeDrift(el, opts) {
    if (!el || reduceMotion) return;
    const d = { el, x: 0, dir: opts.dir, baseDir: opts.dir, base: opts.base, boost: 0, half: 0, halfIndex: opts.halfIndex, pause: false };
    measureDrift(d);
    const host = el.parentElement;
    if (host) {
      host.addEventListener('pointerenter', () => { d.pause = true; });
      host.addEventListener('pointerleave', () => { d.pause = false; });
    }
    drifts.push(d);
  }
  makeDrift(document.getElementById('band-track'), { base: 0.045, dir: 1, halfIndex: 12 });
  makeDrift(document.getElementById('marquee-1'), { base: 0.03, dir: 1, halfIndex: 12 });
  makeDrift(document.getElementById('marquee-2'), { base: 0.026, dir: -1, halfIndex: 11 });

  function remeasureDrifts() {
    for (const d of drifts) measureDrift(d);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasureDrifts);
  window.addEventListener('load', remeasureDrifts);
  window.addEventListener('resize', () => {
    clearTimeout(window.__driftT);
    window.__driftT = setTimeout(remeasureDrifts, 200);
  });

  function driftTick(dt) {
    const k = Math.pow(0.94, dt / 16.7);
    for (let i = 0; i < drifts.length; i++) {
      const d = drifts[i];
      d.boost *= k;
      if (d.pause) continue;
      d.x -= d.dir * (d.base * dt + d.boost * dt * 0.11);
      if (d.half > 0) {
        if (d.x <= -d.half) d.x += d.half;
        else if (d.x > 0) d.x -= d.half;
      }
      d.el.style.transform = `translate3d(${d.x.toFixed(2)}px,0,0)`;
    }
  }

  /* ============================================================
     Scroll: progress, nav state, scrollspy, showcase, marquee kick
     ============================================================ */
  const bar = document.getElementById('progress-bar');
  const nav = document.getElementById('nav');
  const navLinks = [...document.querySelectorAll('.nav-links a')];
  const sectionEls = [...document.querySelectorAll('main section[id]')];
  let sectionTops = [];
  let lastScrollY = window.scrollY;
  let navActive = '';

  function measureSections() {
    sectionTops = sectionEls.map(s => ({
      id: s.id,
      top: s.getBoundingClientRect().top + window.scrollY
    }));
  }
  measureSections();
  window.addEventListener('load', measureSections);
  window.addEventListener('resize', () => {
    clearTimeout(window.__secT);
    window.__secT = setTimeout(measureSections, 200);
  });

  function onScroll() {
    const h = document.documentElement;
    const y = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    if (bar) bar.style.transform = 'scaleX(' + clamp(y / (max || 1), 0, 1) + ')';
    if (nav) nav.classList.toggle('scrolled', y > 24);

    const probe = y + window.innerHeight * 0.34;
    let active = '';
    for (const s of sectionTops) if (s.top <= probe) active = s.id;
    if (active !== navActive) {
      navActive = active;
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + active));
    }

    // marquees react to the direction and speed of the scroll
    const delta = y - lastScrollY;
    lastScrollY = y;
    if (delta !== 0 && drifts.length) {
      const dir = delta > 0 ? 1 : -1;
      const kick = Math.min(Math.abs(delta) * 0.55, 16);
      for (const d of drifts) {
        d.dir = d.baseDir * dir;
        d.boost = Math.max(d.boost, kick);
      }
    }

    updateShowcase();
  }

  const stage = document.getElementById('showcase-stage');
  const sgCard = document.getElementById('safeguard-card');
  const mobMQ = window.matchMedia('(max-width: 980px)');

  function updateShowcase() {
    if (!stage || !sgCard) return;
    if (mobMQ.matches) { sgCard.style.transform = ''; return; }
    const rect = stage.getBoundingClientRect();
    const total = stage.offsetHeight - window.innerHeight;
    const p = clamp(-rect.top / (total || 1), 0, 1);
    const e = 1 - Math.pow(1 - p, 3);
    sgCard.style.transform = `rotateX(${(1 - e) * 17}deg) scale(${0.9 + e * 0.1}) translateY(${(1 - e) * 26 - 16}px)`;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ============================================================
     Reveals, counters, scramble
     ============================================================ */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const delay = entry.target.style.getPropertyValue('--d') || '0ms';
        entry.target.style.transitionDelay = delay;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01#$%&*';
  function scramble(el) {
    const final = el.dataset.final || el.textContent;
    el.dataset.final = final;
    if (reduceMotion) { el.textContent = final; return; }
    let frame = 0;
    const len = final.length;
    function tick() {
      el.textContent = final.split('').map((ch, i) => {
        if (ch === ' ') return ' ';
        if (i < frame / 2) return ch;
        return glyphs[Math.floor(Math.random() * glyphs.length)];
      }).join('');
      frame++;
      if (frame / 2 < len + 1) requestAnimationFrame(tick);
      else el.textContent = final;
    }
    tick();
  }
  if ('IntersectionObserver' in window && !reduceMotion) {
    const so = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        scramble(e.target);
        so.unobserve(e.target);
      });
    }, { threshold: 0.9 });
    document.querySelectorAll('[data-scramble]').forEach(el => so.observe(el));
  }

  const counters = document.querySelectorAll('.count');
  function runCounter(el) {
    const end = parseInt(el.dataset.count, 10);
    const dur = 1500;
    const start = performance.now();
    function tick(now) {
      const t = clamp((now - start) / dur, 0, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - t, 3))).toLocaleString('en-IN');
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window && !reduceMotion) {
    const co = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        runCounter(e.target);
        co.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(el => co.observe(el));
  } else {
    counters.forEach(el => el.textContent = parseInt(el.dataset.count, 10).toLocaleString('en-IN'));
  }

  /* ============================================================
     Safeguard: interactive 3D module scene
     ============================================================ */
  const sgHost = document.getElementById('sg-scene');
  const sgTip = document.getElementById('sg-tip');
  const sgLoad = document.getElementById('sg-load');
  const moduleEls = [...document.querySelectorAll('.sg-modules li')];
  const fallbackEls = [...document.querySelectorAll('.sg-fallback [data-fb]')];
  let hoverId = null;
  let tick3d = null;
  let softGL = false;
  let sceneErr = null;

  /* Start fetching three.js long before the card is reached, so the download and
     parse happen while the visitor is reading the hero. */
  let threePromise = null;
  function loadThree() {
    if (!threePromise) {
      threePromise = import('https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js')
        .catch(() => import('https://unpkg.com/three@0.161.0/build/three.module.js'));
    }
    return threePromise;
  }

  /* status chip: only appears if the build is genuinely slow, or fails */
  let loadTimer = null, stallTimer = null;
  function setLoadChip(state, text) {
    if (!sgLoad) return;
    if (state === 'off') { sgLoad.classList.remove('on', 'stalled'); return; }
    const label = sgLoad.querySelector('b');
    if (text && label) label.textContent = text;
    sgLoad.classList.toggle('stalled', state === 'stalled');
    sgLoad.classList.add('on');
  }
  function beginSceneLoad() {
    if (loadTimer || tick3d) return;
    loadTimer = setTimeout(() => {
      if (!sgHost.classList.contains('ready')) setLoadChip('loading', 'Preparing 3D view');
    }, 1200);
    stallTimer = setTimeout(() => {
      if (!sgHost.classList.contains('ready')) setLoadChip('stalled', '3D unavailable — showing diagram');
    }, 12000);
  }
  function clearSceneLoad() {
    clearTimeout(loadTimer); clearTimeout(stallTimer);
    loadTimer = stallTimer = null;
    setLoadChip('off');
  }
  function sceneFailed(why) {
    sceneErr = why;
    clearTimeout(loadTimer); clearTimeout(stallTimer);
    loadTimer = stallTimer = null;
    setLoadChip('stalled', '3D unavailable — showing diagram');
  }

  const MODULES = {
    esp32: { label: 'ESP32 control board', desc: 'Reads the SOS button, drives the siren and hands GPS coordinates to the app.' },
    gps: { label: 'GPS + antenna', desc: 'Locks the position before the alert leaves, so responders get a real pin.' },
    siren: { label: 'Siren & strobe', desc: 'Physical alarm plus flashing light — attention on the spot, instantly.' },
    button: { label: 'SOS button', desc: 'One press starts the sequence. No unlocking, no dialling, no speaking.' },
    battery: { label: 'Li-ion battery', desc: 'Keeps the board, GPS and siren alive on a single charge.' },
    phone: { label: 'Companion app', desc: 'Sends the live pin to everyone in range and auto-dials 112.' }
  };

  function setHover(id) {
    hoverId = id;
    moduleEls.forEach(li => li.classList.toggle('hot', li.dataset.module === id));
    fallbackEls.forEach(g => g.classList.toggle('hot', g.dataset.fb === id));
  }

  function positionTip(x, y) {
    if (!sgHost || !sgTip) return;
    const r = sgHost.getBoundingClientRect();
    const px = clamp(x - r.left, 106, r.width - 106);
    const py = clamp(y - r.top - 8, 74, r.height - 8);
    sgTip.style.left = px + 'px';
    sgTip.style.top = py + 'px';
  }

  let tipFor = null;
  function setTip(id, xy) {
    if (!sgTip) return;
    if (id !== tipFor) {
      tipFor = id;
      if (!id) { sgTip.classList.remove('on'); return; }
      const m = MODULES[id];
      if (!m) { sgTip.classList.remove('on'); return; }
      sgTip.querySelector('b').textContent = m.label;
      sgTip.querySelector('span').textContent = m.desc;
      sgTip.classList.add('on');
    }
    if (id && xy) positionTip(xy.x, xy.y);
  }

  // the fallback diagram is interactive even when WebGL is unavailable
  fallbackEls.forEach(g => {
    g.addEventListener('pointerenter', () => {
      setHover(g.dataset.fb);
      const r = g.getBoundingClientRect();
      setTip(g.dataset.fb, { x: r.left + r.width / 2, y: r.top });
    });
    g.addEventListener('pointerleave', () => {
      setHover(null);
      setTip(null);
    });
  });

  moduleEls.forEach(li => {
    li.addEventListener('pointerenter', () => setHover(li.dataset.module));
    li.addEventListener('pointerleave', () => setHover(null));
  });

  if (sgHost) {
    let started = false;
    const initScene = async () => {
      if (started) return;
      started = true;
      beginSceneLoad();

      let THREE;
      try {
        THREE = await loadThree();
      } catch (e) {
        sceneFailed('three-load');
        return;
      }

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      } catch (e) {
        sceneFailed('webgl');
        return;
      }

      /* SwiftShader/llvmpipe means no real GPU: drop the expensive extras rather
         than render the scene at a crawl. */
      try {
        const gl = renderer.getContext();
        const dbg = gl.getExtension('WEBGL_debug_renderer_info');
        const gpu = String(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
        softGL = /swiftshader|llvmpipe|softpipe|software|basic render|generic renderer/i.test(gpu);
      } catch (e) { softGL = false; }

      const mobile = window.matchMedia('(max-width: 760px)').matches;
      renderer.setPixelRatio(softGL ? 1 : Math.min(window.devicePixelRatio || 1, 1.8));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.shadowMap.enabled = !mobile && !softGL;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      if (renderer.shadowMap.enabled) {
        renderer.shadowMap.autoUpdate = false;   // refresh every other frame; the rig moves slowly
        renderer.shadowMap.needsUpdate = true;
      }
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.inset = '0';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      sgHost.insertBefore(renderer.domElement, sgHost.firstChild);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, 4 / 3, 0.1, 60);
      camera.position.set(0, 5.62, 7.78);
      camera.lookAt(0, 0.3, 0);

      scene.add(new THREE.HemisphereLight(0x9fd8d4, 0x04070c, 1.05));

      /* procedural studio environment so metal has something to reflect */
      if (!softGL) {
        const envCanvas = document.createElement('canvas');
        envCanvas.width = 256; envCanvas.height = 128;
        const ectx = envCanvas.getContext('2d');
        const envGrad = ectx.createLinearGradient(0, 0, 0, 128);
        envGrad.addColorStop(0, '#9fe2da');
        envGrad.addColorStop(0.45, '#123038');
        envGrad.addColorStop(1, '#04070b');
        ectx.fillStyle = envGrad;
        ectx.fillRect(0, 0, 256, 128);
        const hot = ectx.createRadialGradient(74, 24, 0, 74, 24, 52);
        hot.addColorStop(0, 'rgba(255,255,255,1)');
        hot.addColorStop(1, 'rgba(255,255,255,0)');
        ectx.fillStyle = hot;
        ectx.fillRect(0, 0, 256, 128);
        const bounce = ectx.createRadialGradient(196, 98, 0, 196, 98, 64);
        bounce.addColorStop(0, 'rgba(20,184,166,0.8)');
        bounce.addColorStop(1, 'rgba(20,184,166,0)');
        ectx.fillStyle = bounce;
        ectx.fillRect(0, 0, 256, 128);
        const envTex = new THREE.CanvasTexture(envCanvas);
        envTex.mapping = THREE.EquirectangularReflectionMapping;
        envTex.colorSpace = THREE.SRGBColorSpace;
        const pmrem = new THREE.PMREMGenerator(renderer);
        pmrem.compileEquirectangularShader();
        const envRT = pmrem.fromEquirectangular(envTex);
        scene.environment = envRT.texture;
        envTex.dispose();
        pmrem.dispose();
      }
      await new Promise(r => setTimeout(r, 0));   // let the placeholder paint before the build

      const key = new THREE.DirectionalLight(0xdef7f4, 2.1);
      key.position.set(3.6, 7.2, 4.4);
      if (!mobile) {
        key.castShadow = true;
        key.shadow.mapSize.set(1024, 1024);
        key.shadow.radius = 3;
        key.shadow.bias = -0.0009;
        const sc = key.shadow.camera;
        sc.left = -5; sc.right = 5; sc.top = 5; sc.bottom = -5; sc.near = 1; sc.far = 22;
        sc.updateProjectionMatrix();
      }
      scene.add(key);

      const rim = new THREE.PointLight(0x14b8a6, 18, 16, 2);
      rim.position.set(-4.5, 2.6, -3.2);
      scene.add(rim);

      const rim2 = new THREE.PointLight(0x6ee7de, 10, 14, 2);
      rim2.position.set(3.6, 2.2, -2.4);
      scene.add(rim2);

      /* white LED that follows the cursor */
      const ledRig = new THREE.Group();
      const led = new THREE.PointLight(0xffffff, 0, 5, 2);
      ledRig.add(led);

      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 10, 10),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      bulb.visible = false;
      ledRig.add(bulb);

      const glowCanvas = document.createElement('canvas');
      glowCanvas.width = glowCanvas.height = 64;
      const gctx = glowCanvas.getContext('2d');
      const gg = gctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gg.addColorStop(0, 'rgba(255,255,255,1)');
      gg.addColorStop(0.3, 'rgba(225,255,252,0.5)');
      gg.addColorStop(1, 'rgba(190,255,250,0)');
      gctx.fillStyle = gg;
      gctx.fillRect(0, 0, 64, 64);
      const glowTex = new THREE.CanvasTexture(glowCanvas);
      glowTex.colorSpace = THREE.SRGBColorSpace;

      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTex, color: 0xffffff, transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false
      }));
      sprite.scale.set(0.85, 0.85, 1);
      ledRig.add(sprite);
      scene.add(ledRig);

      /* shadow catcher under the board */
      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(24, 24),
        new THREE.ShadowMaterial({ opacity: 0.34 })
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.16;
      ground.receiveShadow = true;
      scene.add(ground);

      /* soft contact shadow so the board always sits on something */
      const shCanvas = document.createElement('canvas');
      shCanvas.width = shCanvas.height = 128;
      const sctx = shCanvas.getContext('2d');
      const sg = sctx.createRadialGradient(64, 64, 4, 64, 64, 64);
      sg.addColorStop(0, 'rgba(0,0,0,0.72)');
      sg.addColorStop(0.55, 'rgba(0,0,0,0.34)');
      sg.addColorStop(1, 'rgba(0,0,0,0)');
      sctx.fillStyle = sg;
      sctx.fillRect(0, 0, 128, 128);
      const shTex = new THREE.CanvasTexture(shCanvas);
      shTex.colorSpace = THREE.SRGBColorSpace;
      const contact = new THREE.Mesh(
        new THREE.PlaneGeometry(8.8, 6.4),
        new THREE.MeshBasicMaterial({ map: shTex, transparent: true, opacity: 0.85, depthWrite: false })
      );
      contact.rotation.x = -Math.PI / 2;
      contact.position.set(0.05, -0.15, 0.3);
      scene.add(contact);

      const rig = new THREE.Group();
      scene.add(rig);

      const mat = (color, rough, metal, extra) => new THREE.MeshStandardMaterial(
        Object.assign({ color, roughness: rough, metalness: metal }, extra || {})
      );

      function slabGeo(w, d, depth, radius) {
        const s = new THREE.Shape();
        const x = -w / 2, y = -d / 2;
        s.moveTo(x + radius, y);
        s.lineTo(x + w - radius, y);
        s.quadraticCurveTo(x + w, y, x + w, y + radius);
        s.lineTo(x + w, y + d - radius);
        s.quadraticCurveTo(x + w, y + d, x + w - radius, y + d);
        s.lineTo(x + radius, y + d);
        s.quadraticCurveTo(x, y + d, x, y + d - radius);
        s.lineTo(x, y + radius);
        s.quadraticCurveTo(x, y, x + radius, y);
        const g = new THREE.ExtrudeGeometry(s, {
          depth, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015,
          bevelSegments: 2, curveSegments: 10
        });
        g.rotateX(-Math.PI / 2);
        return g;
      }

      function box(w, h, d, color, rough, metal, extra) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, rough, metal, extra));
        m.position.y = h / 2;
        return m;
      }

      /* ---- breadboard ---- */
      function breadboardTexture() {
        const c = document.createElement('canvas');
        c.width = 1024; c.height = 640;
        const x = c.getContext('2d');
        x.fillStyle = '#dcc9a4';
        x.fillRect(0, 0, 1024, 640);

        // plastic mottling
        for (let i = 0; i < 1400; i++) {
          const px = Math.random() * 1024, py = Math.random() * 640;
          x.fillStyle = `rgba(${Math.random() > 0.5 ? '255,250,238' : '110,98,78'},${0.03 + Math.random() * 0.05})`;
          x.beginPath();
          x.arc(px, py, 2 + Math.random() * 18, 0, Math.PI * 2);
          x.fill();
        }

        // centre channel (the gap between the two halves)
        x.fillStyle = '#c2ac83';
        x.fillRect(0, 296, 1024, 48);
        x.fillStyle = 'rgba(62,52,36,.62)';
        x.fillRect(0, 296, 1024, 4);
        x.fillRect(0, 340, 1024, 4);
        x.fillStyle = 'rgba(255,252,244,.28)';
        x.fillRect(0, 300, 1024, 2);
        x.fillRect(0, 336, 1024, 2);

        // through-holes: dark pit + a lit lip reads as a drilled hole
        const dot = (px, py, r) => {
          x.fillStyle = 'rgba(48,42,32,.82)';
          x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill();
          x.fillStyle = 'rgba(255,250,238,.42)';
          x.beginPath(); x.arc(px - r * 0.28, py - r * 0.34, r * 0.5, 0, Math.PI * 2); x.fill();
        };
        const P = 17;
        const field = (top, bottom) => {
          for (let y = top; y <= bottom; y += P) {
            for (let px = 24; px < 1004; px += P) dot(px, y, 3.5);
          }
        };
        field(52, 288);
        field(352, 588);

        // power rails: two per long edge, with their own hole row
        const rail = (y, col) => {
          x.strokeStyle = col; x.lineWidth = 3;
          x.beginPath(); x.moveTo(10, y); x.lineTo(1014, y); x.stroke();
          for (let px = 24; px < 1004; px += P) dot(px, y, 3.1);
        };
        rail(18, 'rgba(176,52,46,.8)');
        rail(34, 'rgba(44,84,168,.78)');
        rail(606, 'rgba(44,84,168,.78)');
        rail(622, 'rgba(176,52,46,.8)');

        // slight edge darkening so the slab edge is not a flat cut
        const vg = x.createLinearGradient(0, 0, 0, 640);
        vg.addColorStop(0, 'rgba(58,48,32,.16)');
        vg.addColorStop(0.12, 'rgba(58,48,32,0)');
        vg.addColorStop(0.88, 'rgba(58,48,32,0)');
        vg.addColorStop(1, 'rgba(58,48,32,.16)');
        x.fillStyle = vg;
        x.fillRect(0, 0, 1024, 640);

        const tex = new THREE.CanvasTexture(c);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
        return tex;
      }

      const BB_W = 5.9, BB_D = 3.8, BB_TOP = 0.278;
      const board = new THREE.Mesh(slabGeo(BB_W, BB_D, 0.26, 0.22), mat(0xd8c49d, 0.82, 0.02));
      board.receiveShadow = true;
      rig.add(board);

      const bbTop = new THREE.Mesh(
        new THREE.PlaneGeometry(BB_W - 0.04, BB_D - 0.04),
        new THREE.MeshStandardMaterial({ map: breadboardTexture(), roughness: 0.86, metalness: 0.02 })
      );
      bbTop.rotation.x = -Math.PI / 2;
      bbTop.position.y = 0.28;
      bbTop.receiveShadow = true;
      rig.add(bbTop);

      // teal rim glow under the breadboard
      const underglow = new THREE.Mesh(
        slabGeo(BB_W + 0.12, BB_D + 0.12, 0.02, 0.24),
        mat(0x0f2a30, 0.4, 0.6, { emissive: 0x0e4f49, emissiveIntensity: 0.5 })
      );
      underglow.position.y = -0.035;
      rig.add(underglow);

      const hitMeshes = [];
      const groups = {};

      function addModule(id, x, z, build) {
        const g = new THREE.Group();
        g.position.set(x, BB_TOP, z);
        build(g);
        g.userData.id = id;
        g.userData.baseY = g.position.y;
        g.traverse(o => {
          if (o.isMesh) {
            o.castShadow = !o.userData.noShadow;
            o.receiveShadow = true;
            o.userData.moduleId = id;
            hitMeshes.push(o);
          }
        });
        rig.add(g);
        groups[id] = g;
        return g;
      }

      /* ---- prototype parts ---- */
      addModule('esp32', 0, -0.2, g => {
        g.rotation.y = 0.05;
        // dev board PCB
        const pcb = box(2.0, 0.06, 1.05, 0x0d1218, 0.62, 0.25);
        g.add(pcb);
        // RF shield
        const shield = box(1.08, 0.11, 0.7, 0x9aa6b0, 0.3, 0.92);
        shield.position.y = 0.115;
        g.add(shield);
        // pin headers along both long edges
        for (const z of [-0.46, 0.46]) {
          const strip = box(1.78, 0.085, 0.085, 0x14171c, 0.62, 0.2);
          strip.position.set(0, 0.1, z);
          g.add(strip);
          for (let i = 0; i < 10; i++) {
            const pin = box(0.028, 0.05, 0.028, 0xc9a24c, 0.32, 0.95);
            pin.position.set(-0.78 + i * 0.173, 0.135, z);
            pin.userData.noShadow = true;
            g.add(pin);
          }
        }
        // micro-USB
        const usb = box(0.2, 0.11, 0.17, 0xb6bcc4, 0.3, 0.9);
        usb.position.set(-1.0, 0.115, 0);
        g.add(usb);
        // antenna trace + power LED
        const ant = box(0.34, 0.007, 0.22, 0xc9a44c, 0.35, 0.9);
        ant.position.set(0.74, 0.062, 0);
        g.add(ant);
        const led = box(0.05, 0.022, 0.05, 0xff5750, 0.4, 0.1, { emissive: 0xff2b25, emissiveIntensity: 1.6 });
        led.position.set(-0.6, 0.068, 0.33);
        g.add(led);
      });

      addModule('gps', -2.0, -1.35, g => {
        g.rotation.y = -0.07;
        g.add(box(0.95, 0.05, 0.95, 0x1d4f86, 0.62, 0.2));
        // ceramic patch antenna
        const patch = box(0.56, 0.09, 0.56, 0xe9e6da, 0.85, 0.03);
        patch.position.y = 0.095;
        g.add(patch);
        // backup cell
        const cell = new THREE.Mesh(
          new THREE.CylinderGeometry(0.145, 0.145, 0.045, 20),
          mat(0xc3c9d0, 0.35, 0.85)
        );
        cell.position.set(0.28, 0.072, 0.3);
        g.add(cell);
        // 4-pin header
        const hdr = box(0.3, 0.07, 0.06, 0x15181d, 0.6, 0.2);
        hdr.position.set(0, 0.085, 0.44);
        g.add(hdr);
        for (let i = 0; i < 4; i++) {
          const p = box(0.024, 0.048, 0.024, 0xd0aa52, 0.32, 0.95);
          p.position.set(-0.1 + i * 0.066, 0.125, 0.44);
          p.userData.noShadow = true;
          g.add(p);
        }
      });

      addModule('button', -2.0, 1.2, g => {
        const base = box(0.46, 0.06, 0.46, 0x2a2f36, 0.5, 0.35);
        g.add(base);
        const ring = new THREE.Mesh(
          new THREE.CylinderGeometry(0.185, 0.185, 0.04, 24),
          mat(0xcbd1d6, 0.35, 0.8)
        );
        ring.position.y = 0.08;
        g.add(ring);
        const cap = new THREE.Mesh(
          new THREE.CylinderGeometry(0.15, 0.15, 0.1, 24),
          mat(0xd23c3c, 0.42, 0.1, { emissive: 0x5c1010, emissiveIntensity: 0.45 })
        );
        cap.position.y = 0.12;
        g.add(cap);
      });

      addModule('siren', 1.58, -1.12, g => {
        // piezo buzzer can
        const body = new THREE.Mesh(
          new THREE.CylinderGeometry(0.24, 0.24, 0.2, 24),
          mat(0x1a1d22, 0.52, 0.35)
        );
        body.position.y = 0.1;
        g.add(body);
        const lip = new THREE.Mesh(
          new THREE.CylinderGeometry(0.25, 0.25, 0.028, 24),
          mat(0x262b32, 0.45, 0.45)
        );
        lip.position.y = 0.205;
        g.add(lip);
        const port = new THREE.Mesh(
          new THREE.CylinderGeometry(0.05, 0.05, 0.012, 16),
          mat(0x05070a, 0.95, 0)
        );
        port.position.y = 0.222;
        g.add(port);
        // tiny status LED next to it
        const strobe = box(0.08, 0.05, 0.08, 0xff4a44, 0.4, 0.1, { emissive: 0xff2418, emissiveIntensity: 1.8 });
        strobe.position.set(0.36, 0.05, 0.02);
        g.add(strobe);
      });

      addModule('battery', 1.5, 1.25, g => {
        g.rotation.y = -0.09;
        // LiPo pouch
        g.add(box(1.34, 0.2, 0.78, 0x2f6f92, 0.44, 0.35));
        const seal = box(1.34, 0.028, 0.06, 0xc7d0d6, 0.35, 0.85);
        seal.position.set(0, 0.202, 0.35);
        g.add(seal);
        const tab = box(0.16, 0.02, 0.1, 0xd8b25a, 0.35, 0.9);
        tab.position.set(0.4, 0.208, 0.33);
        g.add(tab);
      });

      /* phone floats off the board, on the end of a long wire */
      const phone = new THREE.Group();
      phone.position.set(2.46, 1.12, 0.18);
      phone.rotation.set(0, -0.42, -0.1);
      phone.userData.baseY = phone.position.y;
      phone.userData.id = 'phone';
      const pBody = box(0.74, 1.46, 0.07, 0x0a0f15, 0.32, 0.6);
      pBody.position.y = 0;
      phone.add(pBody);
      const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(0.61, 1.3),
        new THREE.MeshBasicMaterial({ color: 0x0a3330 })
      );
      screen.position.set(0, 0, 0.037);
      phone.add(screen);
      const screenGlow = new THREE.Mesh(
        new THREE.PlaneGeometry(0.61, 1.3),
        new THREE.MeshBasicMaterial({
          color: 0x2ad4c4, transparent: true, opacity: 0.18,
          blending: THREE.AdditiveBlending, depthWrite: false
        })
      );
      screenGlow.position.set(0, 0, 0.039);
      phone.add(screenGlow);
      phone.traverse(o => {
        if (o.isMesh) {
          o.castShadow = true;
          o.userData.moduleId = 'phone';
          hitMeshes.push(o);
        }
      });
      rig.add(phone);
      groups.phone = phone;

      function wire(a, b, lift, color, radius) {
        const v1 = new THREE.Vector3(a[0], a[1], a[2]);
        const v2 = new THREE.Vector3(b[0], b[1], b[2]);
        const mid = v1.clone().lerp(v2, 0.5);
        mid.y = Math.max(v1.y, v2.y) + lift;
        mid.x += (v2.x - v1.x) * 0.1;   // slight sideways bow, like a real jumper
        const curve = new THREE.CatmullRomCurve3([v1, mid, v2]);
        const geo = new THREE.TubeGeometry(curve, 30, radius || 0.021, 6, false);
        const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.22,
          roughness: 0.58,
          metalness: 0.05
        }));
        m.castShadow = true;
        rig.add(m);
      }

      const W = { red: 0xcf4640, black: 0x23262b, yellow: 0xd6b23f, green: 0x3f9e63, blue: 0x3f6fb8, teal: 0x14b8a6 };

      // GPS: 5V, GND, TX, RX
      wire([-0.9, 0.42, -0.55], [-2.0, 0.4, -0.9], 0.1, W.red, 0.022);
      wire([-0.9, 0.42, -0.45], [-1.98, 0.4, -0.84], 0.15, W.black, 0.022);
      wire([-0.9, 0.42, -0.35], [-1.94, 0.4, -0.9], 0.28, W.blue, 0.019);
      // siren
      wire([0.55, 0.42, -0.62], [1.4, 0.45, -1.1], 0.14, W.yellow, 0.021);
      // button
      wire([-0.9, 0.42, 0.28], [-1.95, 0.44, 1.12], 0.13, W.green, 0.021);
      // battery power pair
      wire([0.75, 0.42, 0.28], [1.15, 0.47, 1.2], 0.12, W.red, 0.023);
      wire([0.7, 0.42, 0.36], [1.05, 0.47, 1.14], 0.17, W.black, 0.023);
      // long teal run up to the phone
      wire([0.85, 0.44, -0.3], [2.3, 0.75, 0.2], 0.9, W.teal, 0.022);
      await new Promise(r => setTimeout(r, 0));   // paint the built scene before shader compile

      /* debug hook: where each module lands on screen (0..1 of the canvas) */
      window.__scene = {
        rect() {
          const r = renderer.domElement.getBoundingClientRect();
          return { x: r.x, y: r.y, w: r.width, h: r.height };
        },
        project(id) {
          const g = groups[id];
          if (!g) return null;
          const v = new THREE.Vector3();
          g.getWorldPosition(v);
          v.project(camera);
          return { x: +(v.x * 0.5 + 0.5).toFixed(3), y: +(-v.y * 0.5 + 0.5).toFixed(3) };
        },
        ids: Object.keys(groups),
        at(x, y, z) {
          const v = new THREE.Vector3(x, y, z).project(camera);
          return { x: +(v.x * 0.5 + 0.5).toFixed(3), y: +(-v.y * 0.5 + 0.5).toFixed(3) };
        },
        bounds() {
          let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
          const v = new THREE.Vector3();
          rig.updateWorldMatrix(true, true);
          rig.traverse(o => {
            if (!o.isMesh || !o.geometry.boundingBox) {
              if (o.isMesh) o.geometry.computeBoundingBox();
              if (!o.isMesh) return;
            }
            const bb = o.geometry.boundingBox;
            for (let i = 0; i < 8; i++) {
              v.set(i & 1 ? bb.max.x : bb.min.x, i & 2 ? bb.max.y : bb.min.y, i & 4 ? bb.max.z : bb.min.z)
                .applyMatrix4(o.matrixWorld)
                .project(camera);
              x0 = Math.min(x0, v.x); x1 = Math.max(x1, v.x);
              y0 = Math.min(y0, v.y); y1 = Math.max(y1, v.y);
            }
          });
          return {
            x0: +(x0 * 0.5 + 0.5).toFixed(3), x1: +(x1 * 0.5 + 0.5).toFixed(3),
            y0: +(-y1 * 0.5 + 0.5).toFixed(3), y1: +(-y0 * 0.5 + 0.5).toFixed(3)
          };
        }
      };

      /* ------- interaction ------- */
      const raycaster = new THREE.Raycaster();
      const ndc = new THREE.Vector2(-2, -2);
      const ledPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.25);
      const ledTarget = new THREE.Vector3(0, 1.25, 0);
      const tmp = new THREE.Vector3();
      const hitPoint = new THREE.Vector3();
      let ledActive = false;
      let inView = true;
      let lastRender = 0;
      let frameNo = 0;

      function sceneMove(e) {
        const r = renderer.domElement.getBoundingClientRect();
        if (!r.width || !r.height) return;
        ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;

        raycaster.setFromCamera(ndc, camera);
        if (raycaster.ray.intersectPlane(ledPlane, hitPoint)) {
          ledTarget.copy(hitPoint);
          ledActive = true;
        }

        const hits = raycaster.intersectObjects(hitMeshes, false);
        if (hits.length) {
          const id = hits[0].object.userData.moduleId;
          setHover(id);
          const g = groups[id];
          if (g && MODULES[id]) {
            g.getWorldPosition(tmp);
            tmp.y += 0.55;
            tmp.project(camera);
            setTip(id, {
              x: r.left + (tmp.x * 0.5 + 0.5) * r.width,
              y: r.top + (-tmp.y * 0.5 + 0.5) * r.height
            });
          }
        } else {
          setHover(null);
          setTip(null);
        }
      }

      sgHost.addEventListener('pointermove', sceneMove, { passive: true });
      sgHost.addEventListener('pointerleave', () => {
        ledActive = false;
        setHover(null);
        setTip(null);
      });

      let targetRY = -0.06, targetRX = 0;
      if (!reduceMotion) {
        sgHost.addEventListener('pointermove', e => {
          const r = sgHost.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          targetRY = -0.06 + (px - 0.5) * 0.42;
          targetRX = (py - 0.5) * 0.2;
        }, { passive: true });
        sgHost.addEventListener('pointerleave', () => {
          targetRY = -0.06; targetRX = 0;
        });
      }

      if ('IntersectionObserver' in window) {
        new IntersectionObserver(es => {
          es.forEach(e => { inView = e.isIntersecting; });
        }, { rootMargin: '100px' }).observe(sgHost);
      }

      function resize() {
        const w = sgHost.clientWidth || 480;
        const h = sgHost.clientHeight || 360;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      resize();
      if ('ResizeObserver' in window) new ResizeObserver(resize).observe(sgHost);

      tick3d = function (now) {
        if (!inView) return;
        rig.rotation.y += (targetRY - rig.rotation.y) * 0.075;
        rig.rotation.x += (targetRX - rig.rotation.x) * 0.075;

        for (const id in groups) {
          const g = groups[id];
          const on = id === hoverId;
          const s = g.scale.x + ((on ? 1.1 : 1) - g.scale.x) * 0.12;
          g.scale.setScalar(s);
        }
        ledRig.position.lerp(ledTarget, 0.22);
        led.intensity += ((ledActive ? 26 : 0) - led.intensity) * 0.12;
        sprite.material.opacity = (led.intensity / 26) * 0.5;
        bulb.visible = led.intensity > 0.5;

        if (now - lastRender < 21) return;
        lastRender = now;
        if (renderer.shadowMap.enabled) renderer.shadowMap.needsUpdate = (frameNo++ & 1) === 0;
        renderer.render(scene, camera);
        if (!sgHost.classList.contains('ready')) sgHost.classList.add('ready');
      };

      if (renderer.compileAsync) {
        try {
          await Promise.race([
            renderer.compileAsync(scene, camera),
            new Promise(resolve => setTimeout(resolve, 3000))
          ]);
        } catch (e) { /* fall through */ }
      }
      renderer.render(scene, camera);
      sgHost.classList.add('ready');
      clearSceneLoad();
    };

    if ('IntersectionObserver' in window) {
      const lio = new IntersectionObserver(es => {
        es.forEach(e => {
          if (!e.isIntersecting) return;
          lio.disconnect();
          initScene();
        });
      }, { rootMargin: '700px' });
      lio.observe(sgHost);
    } else {
      initScene();
    }

    /* Build while the page is idle: the first shader compile costs a few hundred ms,
       so pay it while the visitor is reading the hero instead of while they scroll.
       requestIdleCallback is deferred during scrolling, which is exactly what we want. */
    if (!window.matchMedia('(max-width: 760px)').matches) {
      const warm = () => initScene();
      if ('requestIdleCallback' in window) window.requestIdleCallback(warm);
      else window.addEventListener('load', () => setTimeout(warm, 3000), { once: true });
    } else {
      /* on small screens still prefetch the engine so the card is instant */
      const prime = () => { loadThree().catch(() => {}); };
      if ('requestIdleCallback' in window) window.requestIdleCallback(prime);
      else window.addEventListener('load', () => setTimeout(prime, 1500), { once: true });
    }
  }

  /* ============================================================
     One loop for everything
     ============================================================ */
  let lastNow = performance.now();
  let lastAurora = 0, lastField = 0, lastRadar = 0;

  function frame(now) {
    const dt = Math.min(now - lastNow, 50);
    lastNow = now;

    if (!document.hidden) {
      if (!reduceMotion) {
        cursorTick();
        heroTick();
        driftTick(dt);
        if (now - lastAurora >= 50) { lastAurora = now; drawAurora(now); }
        if (now - lastField >= 33) { lastField = now; drawField(); }
        if (now - lastRadar >= 33 && radarInView) { lastRadar = now; drawRadar(now); }
      }
      if (tick3d) tick3d(now);
    }
    requestAnimationFrame(frame);
  }

  if (reduceMotion) {
    drawAurora(performance.now());
    drawField();
    drawRadar(performance.now());
  }
  requestAnimationFrame(frame);

  window.__site = {
    drifts,
    get hoverId() { return hoverId; },
    get has3d() { return !!tick3d; },
    get softgl() { return softGL; },
    get err() { return sceneErr; }
  };
})();
