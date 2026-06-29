/* ══════════════════════════════════════════════════════════
   KAVITHA BIRTHDAY WEBSITE — script.js (upgraded)
   ══════════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger, TextPlugin);

/* ─── LENIS ─── */
let lenis;
function initLenis() {
  lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ─── LOADER ─── */
(function initLoader() {
  const canvas = document.getElementById('loader-stars');
  const ctx    = canvas.getContext('2d');
  const quote  = document.getElementById('loader-quote');
  const bar    = document.getElementById('loader-bar');
  const label  = document.getElementById('loader-label');
  const icon   = document.getElementById('loader-icon');
  let W, H, stars = [], raf;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 250; i++) {
    stars.push({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.5 + 0.2,
      o: 0,
      speed: Math.random() * 0.007 + 0.002,
      twinkle: Math.random() * Math.PI * 2,
      color: Math.random() > 0.8 ? '196,181,253' : Math.random() > 0.9 ? '251,191,36' : '255,255,255'
    });
  }

  let elapsed = 0;
  const TOTAL = 9000; // Extended to 9 seconds for reflection time
  const surpriseMessages = [
    "You light up every room ✨",
    "Your creativity is inspiring 💫",
    "Keep shining, always 🌟",
    "UPSC dreams = your reality 📚",
    "You're one of a kind 💎",
    "Brilliance looks good on you ⚡",
    "The world needs your light 🌙",
    "More fabulous than any meteor 🌠"
  ];

  // Interactive star clicking
  canvas.style.cursor = 'pointer';
  function handleStarClick(e) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    stars.forEach(s => {
      const starX = s.x * W;
      const starY = s.y * H;
      const distance = Math.sqrt((clickX - starX) ** 2 + (clickY - starY) ** 2);
      if (distance < 35) {
        const msgDiv = document.getElementById('loader-messages');
        const randomMsg = surpriseMessages[Math.floor(Math.random() * surpriseMessages.length)];
        msgDiv.textContent = randomMsg;
        msgDiv.style.opacity = '1';
        setTimeout(() => { msgDiv.style.opacity = '0'; }, 2000);
        s.o = 1;
      }
    });
  }
  canvas.addEventListener('click', handleStarClick);

  function drawStars(ts) {
    if (!elapsed) elapsed = ts;
    const delta    = ts - elapsed;
    const progress = Math.min(delta / TOTAL, 1);

    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.twinkle += s.speed;
      const flicker    = 0.5 + 0.5 * Math.sin(s.twinkle);
      const maxOpacity = Math.min(progress * 2, 1) * flicker;
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.color},${maxOpacity * s.r * 0.65})`;
      ctx.fill();
    });

    bar.style.width = (progress * 100) + '%';

    if (delta >= 400) gsap.to([icon, quote, label], { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: 'power2.out' });

    if (progress < 1) {
      raf = requestAnimationFrame(drawStars);
    } else {
      cancelAnimationFrame(raf);
      gsap.to('#loader', {
        opacity: 0, duration: 1.2, delay: 0.6, ease: 'power2.inOut',
        onComplete: () => {
          document.getElementById('loader').style.display = 'none';
          showSite();
        }
      });
    }
  }

  // Pre-set elements for animation
  gsap.set([icon, quote, label], { opacity: 0, y: 10 });
  // Begin drawing loader and prefetch music for smoother startup on mobile
  try { preloadMusic(); } catch (e) { /* ignore */ }
  requestAnimationFrame(drawStars);
})();

function showSite() {
  const site = document.getElementById('site');
  site.classList.remove('hidden');

  initLenis();
  initMouseGlow();
  initParticles();
  initGallery();
  initTimelineAnims();
  initEnvelope();
  initGift();
  initNightSky();
  initFinalCanvas();
  initMusicPlayer();
  startMusic();

  // Try again on first interaction for mobile browsers
  const userStart = () => {
    startMusic();
    document.documentElement.removeEventListener('pointerdown', userStart);
    document.documentElement.removeEventListener('touchstart', userStart);
  };
  document.documentElement.addEventListener('pointerdown', userStart, { once: true, passive: true });
  document.documentElement.addEventListener('touchstart', userStart, { once: true, passive: true });

  // Staggered welcome card entrance
  const tl = gsap.timeline({ delay: 0.15 });
  tl.from('.welcome-card',    { opacity: 0, y: 70, scale: 0.93, duration: 1.4, ease: 'power3.out' })
    .from('.welcome-eyebrow', { opacity: 0, y: 20, duration: 0.9, ease: 'power2.out' }, '-=0.9')
    .from('.welcome-title',   { opacity: 0, y: 30, duration: 1,   ease: 'power2.out' }, '-=0.7')
    .from('.name-kavitha',    { opacity: 0, y: 20, duration: 1,   ease: 'power2.out' }, '-=0.8')
    .from('.welcome-sub',     { opacity: 0, y: 20, duration: 0.9, ease: 'power2.out' }, '-=0.7')
    .from('#btn-begin',       { opacity: 0, y: 20, scale: 0.9, duration: 0.9, ease: 'back.out(1.7)' }, '-=0.6')
    .from('.welcome-hint',    { opacity: 0, duration: 0.8 }, '-=0.3');

  document.getElementById('btn-begin').addEventListener('click', () => {
    document.getElementById('particles-canvas').classList.add('active');
    startMusic();
    lenis.scrollTo(document.getElementById('sec-gallery'), {
      duration: 2.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
  });
}

/* ─── MUSIC PLAYER ─── */
let audio, isPlaying = false, autoPlayBlocked = false;
let preloadedBlobUrl = null, musicPrefetched = false;

async function preloadMusic() {
  if (musicPrefetched) return;
  musicPrefetched = true;
  try {
    const resp = await fetch('assets/music.mp3');
    if (!resp.ok) return;
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    preloadedBlobUrl = url;
    // If audio element already exists, assign and load
    if (audio) {
      audio.src = url;
      try { audio.load(); } catch (e) { /* ignore */ }
    }
    // Try a lightweight decode to warm the audio subsystem on mobile
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        const actx = new AC();
        await actx.decodeAudioData(arrayBuffer).catch(() => {});
        try { actx.close(); } catch (e) {}
      }
    } catch (e) { /* ignore decode failures */ }
  } catch (e) {
    // network / CORS failures are non-fatal — fallback to usual audio element source
  }
}

function initMusicPlayer() {
  audio = document.getElementById('audio');
  audio.volume = 0.75;
  audio.muted = false;

  // If we prefetched the audio as a blob, use that URL for smoother playback
  if (preloadedBlobUrl) {
    try { audio.src = preloadedBlobUrl; audio.load(); } catch (e) { /* ignore */ }
  }

  audio.addEventListener('play', () => { isPlaying = true; });
  audio.addEventListener('pause', () => { isPlaying = false; });
  audio.addEventListener('ended', () => { isPlaying = false; });
}

function tryPlayMusic() {
  if (!audio || isPlaying) return;
  audio.play().then(() => {
    isPlaying = true;
    autoPlayBlocked = false;
  }).catch(() => {
    autoPlayBlocked = true;
    isPlaying = false;
  });
}

function startMusic() {
  if (!audio) return;
  tryPlayMusic();
}

/* ─── MOUSE GLOW & RIPPLE ─── */
function initMouseGlow() {
  const glow = document.getElementById('mouse-glow');
  let mx = -100, my = -100, cx = -100, cy = -100;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  document.addEventListener('click', e => {
    const r = document.createElement('div');
    r.className = 'ripple';
    r.style.left = e.clientX + 'px';
    r.style.top  = e.clientY + 'px';
    document.body.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  });

  function animGlow() {
    cx += (mx - cx) * 0.13;
    cy += (my - cy) * 0.13;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(animGlow);
  }
  animGlow();

  document.addEventListener('touchstart', () => { glow.style.display = 'none'; }, { once: true });
}

/* ─── FLOATING PARTICLES ─── */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['196,181,253', '251,191,36', '103,232,249', '249,168,212'];
  const particles = Array.from({ length: 75 }, () => createParticle(true));

  function createParticle(random = false) {
    return {
      x: Math.random() * (W || 800),
      y: random ? Math.random() * (H || 600) : (H || 600) + 5,
      r: Math.random() * 2 + 0.4,
      dx: (Math.random() - 0.5) * 0.35,
      dy: -Math.random() * 0.55 - 0.1,
      o: Math.random() * 0.55 + 0.1,
      phase: Math.random() * Math.PI * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.phase += 0.008;
      p.x += p.dx + 0.15 * Math.sin(p.phase);
      p.y += p.dy;
      if (p.y < -5 || p.x < -5 || p.x > W + 5) Object.assign(particles[i], createParticle());
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.o})`;
      ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

/* ─── GALLERY & LIGHTBOX ─── */
function initGallery() {
  const polaroids = document.querySelectorAll('.polaroid-wrap');
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lightbox-img');
  const lbCaption = document.getElementById('lightbox-caption');
  const lbClose   = document.getElementById('lightbox-close');
  const lbPrev    = document.getElementById('lightbox-prev');
  const lbNext    = document.getElementById('lightbox-next');
  let currentIdx  = 0;
  let focusableElements = [];

  const trapFocus = e => {
    if (e.key !== 'Tab' || !lightbox.classList.contains('open')) return;
    focusableElements = [lbClose, lbPrev, lbNext].filter(Boolean);
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const galleryImages = document.querySelectorAll('.gallery-img');
  const imageObserver = 'IntersectionObserver' in window ? new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      const src = img.dataset.src;
      if (!src) {
        observer.unobserve(img);
        return;
      }
      img.src = src;
      img.addEventListener('load', () => img.classList.remove('loading'), { once: true });
      img.removeAttribute('data-src');
      observer.unobserve(img);
    });
  }, { rootMargin: '180px 0px', threshold: 0.05 }) : null;

  galleryImages.forEach(img => {
    if (img.complete && !img.dataset.src) img.classList.remove('loading');
    if (imageObserver && img.dataset.src) imageObserver.observe(img);
    else if (img.dataset.src) {
      img.src = img.dataset.src;
      img.addEventListener('load', () => img.classList.remove('loading'), { once: true });
    }
  });

  // ScrollTrigger reveal + start float animation
  polaroids.forEach((wrap, i) => {
    gsap.to(wrap, {
      opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
      scrollTrigger: { trigger: wrap, start: 'top 90%', toggleActions: 'play none none reverse' },
      delay: (i % 5) * 0.08,
      onComplete: () => wrap.classList.add('floating')
    });
    wrap.querySelector('.polaroid').setAttribute('tabindex', '0');
  });

  function openLightbox(idx) {
    const wrap    = polaroids[idx];
    const img     = wrap.querySelector('img');
    const caption = wrap.querySelector('p').textContent;
    const src     = img.dataset.src || img.src;
    lbImg.src = src;
    lbImg.alt = caption;
    lbCaption.textContent = caption;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    currentIdx = idx;
    gsap.fromTo('#lightbox-inner', { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out' });
    setTimeout(() => lbClose.focus(), 60);
  }

  polaroids.forEach((wrap, i) => {
    const p = wrap.querySelector('.polaroid');
    p.addEventListener('click', () => openLightbox(i));
    p.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openLightbox(i); });
  });

  function closeLightbox() {
    gsap.to('#lightbox-inner', { opacity: 0, scale: 0.92, duration: 0.3, ease: 'power2.in', onComplete: () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      gsap.set('#lightbox-inner', { opacity: 1, scale: 1 });
    }});
  }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => { currentIdx = (currentIdx - 1 + polaroids.length) % polaroids.length; openLightbox(currentIdx); });
  lbNext.addEventListener('click', () => { currentIdx = (currentIdx + 1) % polaroids.length; openLightbox(currentIdx); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lbPrev.click();
    if (e.key === 'ArrowRight') lbNext.click();
    trapFocus(e);
  });
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  lightbox.setAttribute('aria-hidden', 'true');

  // Touch swipe in lightbox
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? lbNext.click() : lbPrev.click(); }
  });
}

/* ─── TIMELINE ─── */
function initTimelineAnims() {
  document.querySelectorAll('.tl-item').forEach((item, i) => {
    gsap.to(item, {
      opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: item, start: 'top 87%', toggleActions: 'play none none reverse' },
      delay: i * 0.06
    });
  });

  document.querySelectorAll('.section-header').forEach(header => {
    gsap.from(header, {
      opacity: 0, y: 40, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: header, start: 'top 90%', toggleActions: 'play none none reverse' }
    });
  });
}

/* ─── ENVELOPE & LETTER ─── */
function initEnvelope() {
  const envelope    = document.getElementById('envelope');
  const letterModal = document.getElementById('letter-modal');
  const letterClose = document.getElementById('letter-close');
  let letterFocusable = [];
  const letterBody  = document.getElementById('letter-body');
  const letterSign  = document.querySelector('.letter-sign');
  const letterPaper = document.getElementById('letter-paper');
  const envHint     = document.querySelector('.envelope-hint');

  /* ✏️ Edit this letter text */
  const letterText = `Happy Birthday, Kavitha!\n\nI hope today brings you countless reasons to smile — the kind that stay with you long after the day is over.\n\nYou have a rare quality: the ability to smile even in difficult times (konchem modidanive 😂). That's not something everyone has, and it's something worth celebrating.\n\nI know that sometimes you feel exhausted and pressured from home because of few things. That feeling is common, and it is a part of life — it does not take away from your strength or your dreams.\n\nYou have a very big dream of UPSC, and the day you achieve it, all of this will feel smaller. When that day comes, I expect a good handmade kakarkay from you as a celebration treat.\n\nThis year, I want you to feel proud of your UPSC dreams and confident in every step you take toward them. I will always support you, and I know you can achieve this.\n\nI am sorry 3000 times if I have ever hurt you because of my so-called childishness. I know I can accidentally hurt the people who are closest to my soul and feel regret later on, and I never want that to happen again.\n\nMay this year be filled with exciting opportunities, wonderful memories, good health, and the kind of success that feels true to who you are.\n\nThank you for being the amazing person you are. The world is genuinely a better place with you in it.\n\nEnjoy every single moment of your special day.\n\nHappy Birthday, once again! 🎂`;

  const trapLetterFocus = e => {
    if (e.key !== 'Tab' || !letterModal.classList.contains('open')) return;
    const contBtn = document.getElementById('btn-letter-continue');
    letterFocusable = [letterClose, contBtn].filter(Boolean);
    const first = letterFocusable[0];
    const last = letterFocusable[letterFocusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  let opened = false;
  function openEnvelope() {
    if (opened) return;
    opened = true;
    if (envHint) envHint.style.display = 'none';
    envelope.classList.add('open');
    gsap.timeline()
      .to('#envelope', { scale: 0.88, duration: 0.25, ease: 'power2.in' })
      .to('#envelope', { scale: 1,    duration: 0.4,  ease: 'back.out(1.8)' })
      .call(() => {
        letterModal.classList.add('open');
        letterModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        gsap.from('#letter-paper', { opacity: 0, y: 60, scale: 0.93, duration: 0.65, ease: 'power3.out' });
        typeLetterText(letterText);
        setTimeout(() => letterClose.focus(), 60);
      }, null, '+=0.5');
  }

  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openEnvelope(); });

  letterClose.addEventListener('click', () => {
    gsap.to('#letter-paper', { opacity: 0, y: 40, duration: 0.4, ease: 'power2.in', onComplete: () => {
      // remove the continue button and hint if present
      const cont = document.getElementById('btn-letter-continue');
      if (cont) cont.remove();
      const hint = document.getElementById('letter-hint');
      if (hint) hint.remove();
      letterModal.classList.remove('open');
      letterModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      // return focus to the envelope so keyboard users continue logically
      try { envelope.focus(); } catch (e) {}
      gsap.set('#letter-paper', { opacity: 1, y: 0 });
    }});
  });
  letterModal.addEventListener('click', e => { if (e.target === letterModal) letterClose.click(); });
  document.addEventListener('keydown', e => {
    if (!letterModal.classList.contains('open')) return;
    if (e.key === 'Escape') letterClose.click();
    trapLetterFocus(e);
  });

  letterModal.setAttribute('aria-hidden', 'true');

  function typeLetterText(text) {
    letterBody.innerHTML = '';
    letterBody.classList.remove('done');
    letterSign.classList.remove('visible');

    const paragraphs = text.split('\n\n');
    const nodes = paragraphs.map((para, pi) => {
      const p = document.createElement('p');
      p.style.marginBottom = '1em';
      if (pi === 0) p.style.fontWeight = '700';
      letterBody.appendChild(p);
      return p;
    });

    const totalChars = paragraphs.reduce((s, p) => s + p.length, 0);
    let paraIdx = 0, lineIdx = 0, globalChar = 0;

    function typeNext() {
      if (paraIdx >= paragraphs.length) {
        letterBody.classList.add('done');
        letterSign.classList.add('visible');
        // add a continue button so the reader knows the page continues
        try {
          if (letterPaper && !document.getElementById('btn-letter-continue')) {
            const cont = document.createElement('button');
            cont.id = 'btn-letter-continue';
            cont.setAttribute('type', 'button');
            cont.className = 'glow-btn';
            cont.setAttribute('aria-controls', 'gift-stage');
            cont.setAttribute('aria-label', 'Continue to surprise and close letter');
            cont.textContent = 'Continue the Surprise ✨';
            cont.style.display = 'block';
            cont.style.marginTop = '1rem';
            cont.addEventListener('click', () => {
              // close modal
              letterClose.click();
              // scroll to surprise/gift area
              const target = document.getElementById('gift-stage') || document.getElementById('sec-surprise');
              if (typeof lenis !== 'undefined' && lenis && target) {
                lenis.scrollTo(target, { duration: 1.6, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
              } else if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
              }
            });
            letterPaper.appendChild(cont);
            // add a small hint so visual users notice the continue button
            const hint = document.createElement('div');
            hint.id = 'letter-hint';
            hint.style.opacity = '0.86';
            hint.style.marginTop = '0.6rem';
            hint.style.fontSize = '0.9rem';
            hint.style.color = 'rgba(255,255,255,0.78)';
            hint.textContent = 'When you’re ready, tap Continue to see the surprise.';
            letterPaper.appendChild(hint);
            // move focus so keyboard/screenreader users know next action is available
            setTimeout(() => { try { cont.focus(); } catch (e) {} }, 80);
          }
        } catch (e) { /* silent */ }
        return;
      }
      const para = paragraphs[paraIdx];
      if (lineIdx < para.length) {
        nodes[paraIdx].textContent += para[lineIdx];
        lineIdx++; globalChar++;
        const speed = Math.max(16, 36 - (globalChar / totalChars) * 18);
        setTimeout(typeNext, speed);
      } else {
        paraIdx++; lineIdx = 0;
        setTimeout(typeNext, 90);
      }
    }
    typeNext();
  }
}

/* ─── GIFT BOX & CAKE ─── */
function initGift() {
  const giftBox  = document.getElementById('gift-box');
  const cakeWrap = document.getElementById('cake-wrap');
  const giftLid  = document.querySelector('.gift-lid');
  const wishMsg  = document.getElementById('wish-msg');
  const btnBlow  = document.getElementById('btn-blow');
  const blowHint = document.getElementById('blow-hint');
  const flames   = document.querySelectorAll('#cake .flame');
  const giftHint = document.querySelector('.gift-hint');
  let giftOpened = false;

  function openGift() {
    if (giftOpened) return;
    giftOpened = true;
    if (giftHint) giftHint.style.display = 'none';

    gsap.timeline()
      .to('#gift-box', { x: -12, duration: 0.07, ease: 'none', repeat: 7, yoyo: true })
      .call(() => {
        giftLid.classList.add('open');
        launchConfetti();
        launchFireworks();
        launchBalloons();
      })
      .call(() => {
        giftBox.style.display = 'none';
        cakeWrap.classList.remove('hidden');
        gsap.from('#cake-wrap', { opacity: 0, y: 50, scale: 0.88, duration: 0.9, ease: 'back.out(1.5)' });
        initMicDetection();
      }, null, '+=0.85');
  }

  giftBox.addEventListener('click', openGift);
  giftBox.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openGift(); });
  btnBlow.addEventListener('click', blowCandles);

  function blowCandles() {
    flames.forEach((flame, i) => {
      setTimeout(() => flame.classList.add('blown'), i * 130);
    });
    setTimeout(() => {
      wishMsg.classList.remove('hidden');
      gsap.from('#wish-msg', { opacity: 0, scale: 0.55, duration: 0.9, ease: 'back.out(2)' });
      launchConfetti();
      setTimeout(launchConfetti, 800);
    }, flames.length * 130 + 200);
    document.getElementById('candle-controls').style.display = 'none';
  }

  function initMicDetection() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      blowHint.textContent = '🕯️ Use the button to blow out the candles!';
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const actx     = new (window.AudioContext || window.webkitAudioContext)();
        const src      = actx.createMediaStreamSource(stream);
        const analyser = actx.createAnalyser();
        analyser.fftSize = 256;
        src.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        let blown = false;

        function check() {
          if (blown) return;
          analyser.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b, 0) / data.length;
          if (avg > 22) { blown = true; blowCandles(); stream.getTracks().forEach(t => t.stop()); return; }
          requestAnimationFrame(check);
        }
        check();
      })
      .catch(() => { blowHint.textContent = '🕯️ Use the button to blow out the candles!'; });
  }
}

/* ─── CONFETTI ─── */
function launchConfetti() {
  const colors = ['#7c3aed','#c4b5fd','#fbbf24','#67e8f9','#ffffff','#ec4899','#f9a8d4'];
  confetti({ particleCount: 200, spread: 95, origin: { y: 0.55 }, colors, ticks: 320 });
  setTimeout(() => confetti({ particleCount: 90, spread: 130, origin: { y: 0.4 }, colors, angle: 60 }), 350);
  setTimeout(() => confetti({ particleCount: 90, spread: 130, origin: { y: 0.4 }, colors, angle: 120 }), 550);
}

/* ─── FIREWORKS ─── */
function launchFireworks() {
  const canvas = document.getElementById('fireworks-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;
  function resize() {
    const r = canvas.parentElement.getBoundingClientRect();
    W = canvas.width  = r.width;
    H = canvas.height = r.height;
  }
  resize();
  const particles = [];
  const colors = ['#7c3aed','#c4b5fd','#fbbf24','#67e8f9','#ec4899','#ffffff','#f9a8d4'];

  function explode(x, y) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < 70; i++) {
      const angle = (Math.PI * 2 / 70) * i;
      const speed = Math.random() * 4.5 + 1;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        r: Math.random() * 2 + 0.5,
        color,
        decay: Math.random() * 0.014 + 0.009
      });
    }
  }

  let fwRaf;
  function drawFW() {
    ctx.clearRect(0, 0, W, H);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.alpha -= p.decay;
      if (p.alpha <= 0) { particles.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.round(Math.max(0, p.alpha) * 255).toString(16).padStart(2,'0');
      ctx.fill();
    }
    fwRaf = requestAnimationFrame(drawFW);
    if (particles.length === 0) cancelAnimationFrame(fwRaf);
  }
  drawFW();

  [0, 350, 700, 1100, 1500, 1900].forEach(delay => {
    setTimeout(() => {
      if (W && H) explode(W * (0.15 + Math.random() * 0.7), H * (0.1 + Math.random() * 0.45));
    }, delay);
  });
}

/* ─── BALLOONS ─── */
function launchBalloons() {
  const colors = ['#7c3aed','#ec4899','#fbbf24','#67e8f9','#a78bfa','#f9a8d4'];
  for (let i = 0; i < 16; i++) {
    setTimeout(() => {
      const balloon = document.createElement('div');
      balloon.className = 'balloon';
      const color    = colors[i % colors.length];
      const size     = 40 + Math.random() * 32;
      const duration = 4 + Math.random() * 4;
      balloon.style.cssText = `
        width:${size}px; height:${size * 1.2}px;
        background:${color};
        left:${5 + Math.random() * 90}%;
        opacity:0.88;
        box-shadow: inset -4px -4px 10px rgba(0,0,0,0.2), 0 0 12px ${color}99;
        animation-duration:${duration}s;
      `;
      document.body.appendChild(balloon);
      balloon.addEventListener('animationend', () => balloon.remove());
    }, i * 180);
  }
}

/* ─── INTERACTIVE NIGHT SKY ─── */
function initNightSky() {
  const section = document.getElementById('sec-sky');
  const canvas  = document.getElementById('sky-canvas');
  const ctx     = canvas.getContext('2d');

  /* ⭐ Edit wishes here */
  const wishes = [
    '⭐ May all your dreams come true.',
    '🌙 Wishing you endless happiness.',
    '✨ Keep shining wherever you go.',
    '💫 May every new day bring new reasons to smile.',
    '🌟 Wishing you success in everything you do.',
    '🌸 May you always find beauty in the ordinary.',
    '💛 Stay curious, stay kind, stay you.',
    '🌺 May laughter follow you everywhere.',
    '🔮 May this year exceed every expectation.',
    '🌙 May you sleep well and wake up inspired.',
    '⚡ May your confidence be unshakeable.',
    '🎶 May music always find you in the quiet.',
    '🌈 May colour find its way into your every day.',
    '🌿 May good health be your constant companion.',
    '💜 May the people around you lift you higher.',
    '🌊 May you find calm in the middle of chaos.',
    '🕊️ May peace be something you carry within.',
    '🎯 May you hit every goal you set this year.',
    '🌍 May the world surprise you in the best ways.',
    '🎂 Happy Birthday — you deserve every good thing.'
  ];

  let W, H, stars = [];
  const tooltip = { x: 0, y: 0, text: '', alpha: 0, targetAlpha: 0 };

  function resize() {
    W = canvas.width  = section.offsetWidth;
    H = canvas.height = section.offsetHeight;
    buildStars();
  }

  function buildStars() {
    stars = wishes.map(wish => ({
      x: (0.05 + Math.random() * 0.9) * W,
      y: (0.25 + Math.random() * 0.68) * H,
      r: 2 + Math.random() * 2.5,
      baseR: 2 + Math.random() * 2.5,
      wish,
      twinkle: Math.random() * Math.PI * 2,
      speed: 0.018 + Math.random() * 0.022,
      hovered: false,
      pulseR: 0,
      color: Math.random() > 0.3 ? '255,255,255' : Math.random() > 0.5 ? '196,181,253' : '251,191,36'
    }));
  }

  resize();
  window.addEventListener('resize', resize);

  function drawConstellations() {
    ctx.strokeStyle = 'rgba(167,139,250,0.055)';
    ctx.lineWidth = 0.7;
    stars.forEach((s, i) => {
      stars.slice(i + 1).forEach(s2 => {
        if (Math.hypot(s.x - s2.x, s.y - s2.y) < 160) {
          ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s2.x, s2.y); ctx.stroke();
        }
      });
    });
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    drawConstellations();

    stars.forEach(s => {
      s.twinkle += s.speed;
      const flicker = 0.6 + 0.4 * Math.sin(s.twinkle);

      if (s.hovered) {
        s.pulseR = Math.min(s.pulseR + 0.7, 20);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${s.color},${0.55 * (1 - s.pulseR / 20)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        s.r = s.baseR + 3;
      } else {
        s.pulseR = Math.max(s.pulseR - 1, 0);
        s.r = s.baseR;
      }

      const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3.5);
      grd.addColorStop(0, `rgba(${s.color},${flicker * 0.85})`);
      grd.addColorStop(1, `rgba(${s.color},0)`);
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = grd; ctx.fill();

      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.color},${flicker})`; ctx.fill();
    });

    // Tooltip fade
    if (tooltip.targetAlpha > tooltip.alpha) tooltip.alpha = Math.min(tooltip.alpha + 0.07, tooltip.targetAlpha);
    else tooltip.alpha = Math.max(tooltip.alpha - 0.05, tooltip.targetAlpha);

    if (tooltip.alpha > 0.01) {
      const pad = 14;
      ctx.font = '14px Inter, sans-serif';
      const tw = ctx.measureText(tooltip.text).width;
      let tx = Math.min(tooltip.x + 16, W - tw - pad * 2 - 10);
      let ty = tooltip.y - 42;
      if (ty < 10) ty = tooltip.y + 24;

      ctx.fillStyle = `rgba(12,4,42,${tooltip.alpha * 0.92})`;
      roundRect(ctx, tx - pad, ty - pad, tw + pad * 2, 20 + pad * 2, 9);
      ctx.fill();

      ctx.strokeStyle = `rgba(167,139,250,${tooltip.alpha * 0.55})`;
      ctx.lineWidth = 1;
      roundRect(ctx, tx - pad, ty - pad, tw + pad * 2, 20 + pad * 2, 9);
      ctx.stroke();

      ctx.fillStyle = `rgba(255,255,255,${tooltip.alpha})`;
      ctx.fillText(tooltip.text, tx, ty + 20);
    }

    requestAnimationFrame(drawFrame);
  }
  drawFrame();

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const isTouch = e.touches && e.touches.length;
    return {
      x: (isTouch ? e.touches[0].clientX : e.clientX) - rect.left,
      y: (isTouch ? e.touches[0].clientY : e.clientY) - rect.top
    };
  }

  function onMove(e) {
    const { x, y } = getPos(e);
    let found = null;
    stars.forEach(s => {
      s.hovered = Math.hypot(s.x - x, s.y - y) < s.r * 5 + 10;
      if (s.hovered) {
        found = s;
        tooltip.x = x; tooltip.y = y;
        tooltip.text = s.wish;
        tooltip.targetAlpha = 1;
      }
    });
    if (!found) tooltip.targetAlpha = 0;
    canvas.style.cursor = found ? 'pointer' : 'crosshair';
  }

  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('touchmove', onMove, { passive: true });
  canvas.addEventListener('touchstart', onMove, { passive: true });

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

/* ─── FINAL CANVAS ─── */
function initFinalCanvas() {
  const section = document.getElementById('sec-final');
  const canvas  = document.getElementById('final-canvas');
  const ctx     = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = section.offsetWidth;
    H = canvas.height = section.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const fireflies = Array.from({ length: 45 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 2 + 0.4,
    vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
    phase: Math.random() * Math.PI * 2,
    speed: 0.018 + Math.random() * 0.022,
    color: Math.random() > 0.5 ? '196,181,253' : Math.random() > 0.5 ? '251,191,36' : '103,232,249'
  }));

  const petals = Array.from({ length: 30 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: 4 + Math.random() * 5,
    vx: (Math.random() - 0.5) * 0.5,
    vy: -0.25 - Math.random() * 0.4,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.035,
    alpha: 0.35 + Math.random() * 0.4,
    color: ['#f9a8d4','#c4b5fd','#fde68a'][Math.floor(Math.random() * 3)]
  }));

  let aurora = 0;
  function drawFinal() {
    ctx.clearRect(0, 0, W, H);
    aurora += 0.0025;

    const grd = ctx.createLinearGradient(0, 0, W, H);
    grd.addColorStop(0, `rgba(124,58,237,${0.055 + 0.025 * Math.sin(aurora)})`);
    grd.addColorStop(0.5, `rgba(103,232,249,${0.04  + 0.02  * Math.sin(aurora + 1)})`);
    grd.addColorStop(1, `rgba(196,181,253,${0.045 + 0.02  * Math.sin(aurora + 2)})`);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    fireflies.forEach(f => {
      f.phase += f.speed;
      f.x += f.vx + 0.35 * Math.sin(f.phase);
      f.y += f.vy + 0.25 * Math.cos(f.phase * 0.7);
      if (f.x < 0) f.x = W; if (f.x > W) f.x = 0;
      if (f.y < 0) f.y = H; if (f.y > H) f.y = 0;
      const bright = 0.5 + 0.5 * Math.sin(f.phase * 2);
      const glow = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 5);
      glow.addColorStop(0, `rgba(${f.color},${bright * 0.75})`);
      glow.addColorStop(1, `rgba(${f.color},0)`);
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 5, 0, Math.PI * 2);
      ctx.fillStyle = glow; ctx.fill();
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${f.color},${bright})`; ctx.fill();
    });

    petals.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rotation += p.rotSpeed;
      if (p.y < -20) { p.y = H + 10; p.x = Math.random() * W; }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 1.65, 0, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2,'0');
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(drawFinal);
  }
  drawFinal();

  // Scroll reveal for final content
  gsap.from('.final-content > *', {
    opacity: 0, y: 55, stagger: 0.18, duration: 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: '#sec-final', start: 'top 68%', toggleActions: 'play none none none' }
  });

  // Auto confetti on enter
  ScrollTrigger.create({
    trigger: '#sec-final',
    start: 'top 62%',
    once: true,
    onEnter: () => { launchConfetti(); setTimeout(launchConfetti, 1400); }
  });
}

/* ─── REPLAY ─── */
document.getElementById('btn-replay').addEventListener('click', () => {
  lenis.scrollTo(0, { duration: 2.8, easing: t => 1 - Math.pow(1 - t, 4) });
});
