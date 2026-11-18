(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const content = window.ZAYNAB_STORY;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The song and gentle chimes start only after a visitor chooses sound on.
  let soundEnabled = false;
  let audioContext;
  const soundToggle = $('#sound-toggle');
  function chime(pitch = 660, duration = .17) {
    if (!soundEnabled) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') audioContext.resume();
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'sine'; osc.frequency.value = pitch;
      gain.gain.setValueAtTime(.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.052, audioContext.currentTime + .018);
      gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + duration);
      osc.connect(gain); gain.connect(audioContext.destination);
      osc.start(); osc.stop(audioContext.currentTime + duration + .01);
    } catch (_) { audioContext = null; }
  }
  const songButton = $('#song-play');
  const songStatus = $('#song-status');
  let songPlayer;
  let songReady = false;
  let songFailed = false;

  function setSound(enabled) {
    soundEnabled = enabled;
    soundToggle.setAttribute('aria-pressed', String(enabled));
    songButton.setAttribute('aria-pressed', String(enabled));
    $('#sound-label').textContent = enabled ? 'sound on' : 'sound off';
    soundToggle.title = enabled ? 'Pause our song and turn off sound effects' : 'Play our song and turn on gentle sound effects';
    songButton.textContent = enabled ? 'Pause our song ♫' : 'Play our song ♫';
  }

  function startSong() {
    if (!songReady) {
      songStatus.textContent = songFailed
        ? 'The song could not load. Try the YouTube link to listen.'
        : 'Getting our song ready… It will start here when it is ready.';
      return;
    }
    songStatus.textContent = 'Starting our song… If it stays quiet, tap play in the video above.';
    songPlayer.unMute();
    songPlayer.playVideo();
  }

  function toggleSound() {
    setSound(!soundEnabled);
    if (soundEnabled) {
      startSong();
      chime(740);
    } else {
      if (songReady) songPlayer.pauseVideo();
      songStatus.textContent = 'Music paused. Turn sound on whenever you like.';
    }
  }
  soundToggle.addEventListener('click', toggleSound);
  songButton.addEventListener('click', toggleSound);

  // Prepare the visible player silently so a later tap can start it immediately.
  window.onYouTubeIframeAPIReady = () => {
    const playerVars = { playsinline: 1, autoplay: 0, controls: 1, rel: 0, loop: 1, playlist: '50VNCymT-Cs' };
    if (/^https?:$/.test(location.protocol)) playerVars.origin = location.origin;
    songPlayer = new YT.Player('song-player', {
      width: '100%', height: '100%', videoId: '50VNCymT-Cs', playerVars,
      events: {
        onReady(event) {
          songPlayer = event.target;
          songReady = true;
          const frame = songPlayer.getIframe();
          frame.title = 'Let Me Down Slowly by Alec Benjamin, official music video';
          frame.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
          frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
          if (soundEnabled) startSong();
        },
        onStateChange(event) {
          if (event.data === YT.PlayerState.PLAYING) {
            setSound(true);
            songStatus.textContent = 'Playing our song ♡ Turn sound off to pause.';
          } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
            setSound(false);
            songStatus.textContent = 'Music paused. Turn sound on whenever you like.';
          }
        },
        onAutoplayBlocked() {
          if (soundEnabled) songStatus.textContent = 'One more tap: press play in the video above to hear our song.';
        },
        onError() {
          songFailed = true;
          songReady = false;
          songStatus.textContent = 'The song cannot play here right now. Try the YouTube link to listen.';
        }
      }
    });
  };
  const songApi = document.createElement('script');
  songApi.src = 'https://www.youtube.com/iframe_api';
  songApi.async = true;
  songApi.onerror = () => {
    songFailed = true;
    songStatus.textContent = 'The song could not load. Try the YouTube link to listen.';
  };
  document.head.append(songApi);

  // Story tabs: five chapters, each a genuinely different little message.
  const tabs = $('#chapter-tabs');
  content.chapters.forEach((chapter, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'chapter-tab';
    button.id = `chapter-tab-${index}`; button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', 'chapter-panel');
    button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    button.tabIndex = index === 0 ? 0 : -1;
    const n = document.createElement('span'); n.className = 'chapter-tab-number'; n.textContent = chapter.num;
    const title = document.createElement('span'); title.className = 'chapter-tab-title'; title.textContent = chapter.short;
    button.append(n, title);
    button.addEventListener('click', () => selectChapter(index));
    button.addEventListener('keydown', e => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      let next = index;
      if (e.key === 'ArrowLeft') next = (index + content.chapters.length - 1) % content.chapters.length;
      if (e.key === 'ArrowRight') next = (index + 1) % content.chapters.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = content.chapters.length - 1;
      selectChapter(next); tabs.children[next].focus();
    });
    tabs.append(button);
  });
  function selectChapter(index) {
    const chapter = content.chapters[index];
    $$('.chapter-tab').forEach((b, i) => {
      b.setAttribute('aria-selected', String(i === index));
      b.tabIndex = i === index ? 0 : -1;
    });
    $('#chapter-panel').setAttribute('aria-labelledby', `chapter-tab-${index}`);
    $('#chapter-icon').textContent = chapter.icon;
    $('#chapter-label').textContent = chapter.label;
    $('#chapter-heading').textContent = chapter.title;
    $('#chapter-description').textContent = chapter.text;
    const panel = $('#chapter-panel');
    panel.style.animation = 'none'; void panel.offsetHeight; panel.style.animation = '';
    chime(560 + index * 58, .13);
  }
  selectChapter(0);

  // Three accessible flip cards. Personal messages are inserted as plain text.
  content.reasons.forEach((reason) => {
    const card = document.createElement('button');
    card.type = 'button'; card.className = 'reason-card';
    card.setAttribute('aria-pressed', 'false');
    card.setAttribute('aria-label', `Flip card: ${reason.title}`);
    const inner = document.createElement('span'); inner.className = 'reason-inner';
    const front = document.createElement('span'); front.className = 'reason-face reason-front';
    const idx = document.createElement('span'); idx.className = 'reason-idx'; idx.textContent = reason.number;
    const symbol = document.createElement('span'); symbol.className = 'reason-symbol'; symbol.textContent = reason.icon;
    const title = document.createElement('span'); title.className = 'reason-card-title';
    title.style.cssText = 'font:31px/1.2 var(--serif);letter-spacing:-.03em;margin-bottom:7px'; title.textContent = reason.title;
    const hint = document.createElement('span'); hint.className = 'reason-hint'; hint.textContent = reason.hint;
    const action = document.createElement('span'); action.className = 'reason-action'; action.textContent = 'turn me over ↗';
    front.append(idx, symbol, title, hint, action);
    const back = document.createElement('span'); back.className = 'reason-face reason-back';
    const reveal = document.createElement('span'); reveal.className = 'reason-back-text'; reveal.style.cssText = 'font:23px/1.45 var(--serif);color:#72546b'; reveal.textContent = reason.reveal;
    const close = document.createElement('span'); close.className = 'reason-action'; close.textContent = 'turn me back ↶';
    back.append(reveal, close); inner.append(front, back); card.append(inner);
    card.addEventListener('click', () => {
      const open = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', String(open));
      card.setAttribute('aria-label', `${open ? 'Close' : 'Flip'} card: ${reason.title}`);
      chime(open ? 750 : 560);
    });
    $('#reason-grid').append(card);
  });

  // Birthday star collection. All 22 are individual, repeatable wishes.
  const found = new Set();
  const starGrid = $('#star-grid');
  content.wishes.forEach((wish, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'star-btn';
    button.textContent = '✦';
    button.setAttribute('aria-label', `Open birthday wish ${index + 1}`);
    button.setAttribute('aria-pressed', 'false');
    button.title = `Birthday wish ${index + 1}`;
    button.addEventListener('click', () => {
      const firstTime = !found.has(index); found.add(index);
      $$('.star-btn').forEach(b => b.classList.remove('is-active'));
      button.classList.add('is-found', 'is-active');
      button.setAttribute('aria-pressed', 'true');
      const display = $('#wish-display');
      display.replaceChildren();
      const small = document.createElement('span'); small.className = 'wish-number'; small.textContent = `wish ${index + 1} of 22`;
      const message = document.createElement('p'); message.textContent = wish;
      display.append(small, message);
      const count = found.size;
      $('#wish-progress-count').textContent = `${count} / 22`;
      $('#wish-progress').setAttribute('aria-valuenow', String(count));
      $('#wish-progress-fill').style.width = `${100 * count / 22}%`;
      if (count === 22 && firstTime) {
        small.textContent = 'all 22 wishes found ♡';
        celebrate(190);
        chime(900, .3);
      } else {
        chime(490 + (index % 8) * 52, .17);
        if (firstTime && count % 5 === 0) celebrate(45);
      }
    });
    starGrid.append(button);
  });

  // Candle experience: blow individually or all at once.
  let finishedCandles = false;
  const candles = $$('.candle');
  function extinguish(candle) {
    if (candle.classList.contains('off')) return;
    candle.classList.add('off');
    candle.setAttribute('aria-pressed', 'true');
    chime(520 + candles.indexOf(candle) * 70, .24);
  }
  function checkCandles() {
    if (finishedCandles || !candles.every(c => c.classList.contains('off'))) return;
    finishedCandles = true;
    $('#cake-done').hidden = false;
    $('#cake-message').textContent = 'wish made. and may it come true. ♡';
    $('#blow-all').textContent = 'Your birthday wish is made ♡';
    celebrate(220);
  }
  candles.forEach(c => c.addEventListener('click', () => { extinguish(c); checkCandles(); }));
  $('#blow-all').addEventListener('click', () => {
    if (!finishedCandles) { candles.forEach(extinguish); checkCandles(); }
    else celebrate(65);
  });

  // Letter in an animated envelope.
  $('#letter-text').textContent = content.letter;
  const envelope = $('#envelope');
  envelope.addEventListener('click', () => {
    const open = envelope.classList.toggle('is-open');
    envelope.setAttribute('aria-expanded', String(open));
    $('#letter-card').hidden = !open;
    $('#env-tap').textContent = open ? 'a letter, written from the heart ♡' : 'tap the little envelope to open it ↗';
    if (open) { chime(720, .23); celebrate(60); }
  });

  // Final present.
  $('#present').addEventListener('click', () => {
    const gift = $('#present'); const open = gift.classList.toggle('is-open');
    gift.setAttribute('aria-expanded', String(open));
    $('#final-reveal').hidden = !open;
    if (open) { celebrate(270); chime(700, .25); }
  });

  // Photo lightbox with keyboard support and no external image hosting.
  const photos = [
    { src: 'assets/together.webp', alt: 'The two of us smiling on a rooftop', caption: 'the smiles ♡' },
    { src: 'assets/little-moment.webp', alt: 'A sweet, blurry candid moment together', caption: 'the beautifully blurry ones ♡' }
  ];
  const dialog = $('#photo-dialog');
  let currentPhoto = 0;
  function showPhoto(i) {
    currentPhoto = (i + photos.length) % photos.length;
    const photo = photos[currentPhoto];
    $('#dialog-image').src = photo.src;
    $('#dialog-image').alt = photo.alt;
    $('#dialog-caption').textContent = photo.caption;
  }
  $$('[data-photo]').forEach(button => button.addEventListener('click', () => {
    showPhoto(Number(button.dataset.photo));
    if (dialog.showModal) dialog.showModal(); else dialog.setAttribute('open', '');
    chime(630, .14);
  }));
  $('#photo-close').addEventListener('click', () => dialog.close());
  $('#photo-prev').addEventListener('click', () => showPhoto(currentPhoto - 1));
  $('#photo-next').addEventListener('click', () => showPhoto(currentPhoto + 1));
  dialog.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); showPhoto(currentPhoto - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); showPhoto(currentPhoto + 1); }
  });
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  // Finger-friendly gallery navigation, including iPhone Safari.
  let touchStartX = 0, touchStartY = 0;
  dialog.addEventListener('touchstart', event => {
    if (!event.changedTouches.length) return;
    touchStartX = event.changedTouches[0].clientX;
    touchStartY = event.changedTouches[0].clientY;
  }, {passive:true});
  dialog.addEventListener('touchend', event => {
    if (!event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchStartX;
    const dy = event.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      showPhoto(currentPhoto + (dx < 0 ? 1 : -1));
    }
  }, {passive:true});

  // A little heart burst from the button (the count is local to the page).
  let heartCount = 0;
  $('#send-heart').addEventListener('click', e => {
    heartCount++;
    const rect = e.currentTarget.getBoundingClientRect();
    $('#heart-tally').textContent = `${heartCount} little heart${heartCount === 1 ? '' : 's'} sent to Zaynab ♡`;
    if (!reducedMotion) {
      for (let i = 0; i < 11; i++) {
        const heart = document.createElement('span');
        heart.className = 'float-heart'; heart.textContent = i % 3 ? '♡' : '♥';
        heart.style.left = `${rect.left + rect.width * (0.1 + Math.random() * .8)}px`;
        heart.style.top = `${rect.top + rect.height / 2}px`;
        heart.style.setProperty('--drift', `${(Math.random() - .5) * 130}px`);
        $('#heart-layer').append(heart);
        heart.addEventListener('animationend', () => heart.remove(), { once: true });
      }
    }
    chime(700, .18);
    if (heartCount % 5 === 0) celebrate(85);
  });
  $('#begin-btn').addEventListener('click', () => celebrate(65));

  // Lightweight, original confetti renderer. Runs only for user-triggered celebrations.
  const canvas = $('#confetti'); const ctx = canvas.getContext('2d');
  let width, height, dpr, particles = [], animation = 0;
  function resize() {
    width = window.innerWidth; height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.ceil(width * dpr); canvas.height = Math.ceil(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize(); window.addEventListener('resize', resize, { passive: true });
  function celebrate(amount = 120) {
    if (reducedMotion) return;
    const colors = ['#f8adc7', '#f1d2a5', '#d9b6ea', '#ffebee', '#c3d8cf', '#fff'];
    for (let i = 0; i < amount; i++) {
      const angle = Math.random() * Math.PI * 2, speed = 2 + Math.random() * 8;
      particles.push({
        x: width * (.2 + Math.random() * .6), y: height * (.24 + Math.random() * .42),
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 3,
        r: Math.random() * Math.PI * 2, vr: (Math.random() - .5) * .19,
        s: 3 + Math.random() * 6, gravity: .13 + Math.random() * .15,
        color: colors[Math.floor(Math.random() * colors.length)], life: 110 + Math.random() * 65
      });
    }
    particles = particles.slice(-500);
    if (!animation) animation = requestAnimationFrame(frame);
  }
  function frame() {
    ctx.clearRect(0, 0, width, height);
    particles = particles.filter(p => p.life-- > 0 && p.y < height + 25);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy; p.vy += p.gravity; p.vx *= .984; p.r += p.vr;
      ctx.save(); ctx.globalAlpha = Math.min(1, p.life / 25);
      ctx.fillStyle = p.color; ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .7); ctx.restore();
    }
    animation = particles.length ? requestAnimationFrame(frame) : 0;
    if (!animation) ctx.clearRect(0, 0, width, height);
  }
})();
