/* ===========================
   WIN MYEIK FOOD - script.js
   =========================== */

// === LANGUAGE TOGGLE ===
let currentLang = 'my';

function setLanguage(lang) {
  currentLang = lang;
  document.getElementById('langLabel').textContent = lang === 'my' ? 'EN' : 'မြန်မာ';
  document.querySelectorAll('[data-my][data-en]').forEach(el => {
    el.textContent = lang === 'my' ? el.dataset.my : el.dataset.en;
  });
  localStorage.setItem('wmf-lang', lang);
}

document.getElementById('langBtn').addEventListener('click', () => {
  setLanguage(currentLang === 'my' ? 'en' : 'my');
});

const savedLang = localStorage.getItem('wmf-lang');
if (savedLang) setLanguage(savedLang);


// === BANNER SLIDER ===
let currentSlide = 0;
let sliderTimer  = null;

const slides = document.querySelectorAll('.slide');
const dots   = document.querySelectorAll('.dot');

function goToSlide(n) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');

  // Dot နှိပ်ရင် timer reset လုပ်မယ်
  stopSlider();
  startSlider();
}

function startSlider() {
  sliderTimer = setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 5000); // 5 စက္ကန့်
}

function stopSlider() {
  clearInterval(sliderTimer);
}

// Hover / Touch မှာ pause
const sliderEl = document.getElementById('slider');
sliderEl.addEventListener('mouseenter', stopSlider);
sliderEl.addEventListener('mouseleave', startSlider);
sliderEl.addEventListener('touchstart', stopSlider, { passive: true });
sliderEl.addEventListener('touchend', () => {
  setTimeout(startSlider, 4000);
}, { passive: true });

// Swipe support
let touchStartX = 0;
sliderEl.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });

sliderEl.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) {
    goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
  }
}, { passive: true });

startSlider();


// === PRODUCT GALLERY ===
function switchImg(thumbEl, idx) {
  const card   = thumbEl.closest('.product-card');
  const imgs   = card.querySelectorAll('.gallery-img');
  const thumbs = card.querySelectorAll('.thumb');

  imgs.forEach(img => img.classList.remove('active'));
  thumbs.forEach(t   => t.classList.remove('active'));

  imgs[idx].classList.add('active');
  thumbEl.classList.add('active');
}


// === PWA INSTALL PROMPT ===
let deferredPrompt = null;
const installBanner = document.getElementById('installBanner');
const installBtn    = document.getElementById('installBtn');
const dismissBtn    = document.getElementById('dismissBtn');

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  if (!localStorage.getItem('wmf-install-dismissed')) {
    installBanner.style.display = 'flex';
  }
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') installBanner.style.display = 'none';
  deferredPrompt = null;
});

dismissBtn.addEventListener('click', () => {
  installBanner.style.display = 'none';
  localStorage.setItem('wmf-install-dismissed', '1');
});

window.addEventListener('appinstalled', () => {
  installBanner.style.display = 'none';
});


// === SERVICE WORKER ===
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.log('SW error:', err));
  });
}


// === SCROLL REVEAL ===
const revealEls = document.querySelectorAll('.product-card, .contact-btn');

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}
