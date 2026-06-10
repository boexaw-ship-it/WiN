/* ===========================
   WIN MYEIK FOOD - script.js
   =========================== */

// === PRODUCT DATA ===
const PRODUCTS = {
  puzun: {
    my: 'ပုဇွန်ခြောက်', en: 'Dried Shrimp',
    imgs: ['images/products/puzun/p1.jpg','images/products/puzun/p2.jpg','images/products/puzun/p3.jpg']
  },
  ngar: {
    my: 'ငါးခြောက်', en: 'Dried Fish',
    imgs: ['images/products/ngar/p1.jpg','images/products/ngar/p2.jpg','images/products/ngar/p3.jpg']
  },
  hmyin: {
    my: 'မျှင်ငပိ', en: 'Ngapi String',
    imgs: ['images/products/hmyin/p1.jpg','images/products/hmyin/p2.jpg','images/products/hmyin/p3.jpg']
  },
  ngapi: {
    my: 'ငပိထောင်း', en: 'Ngapi Paste',
    imgs: ['images/products/ngapi/p1.jpg','images/products/ngapi/p2.jpg','images/products/ngapi/p3.jpg']
  },
  siho: {
    my: 'သိဟိုစေ့', en: 'Siho Seeds',
    imgs: ['images/products/siho/p1.jpg','images/products/siho/p2.jpg','images/products/siho/p3.jpg']
  },
  ayeku: {
    my: 'ရေခူ', en: 'Seaweed',
    imgs: ['images/products/ayeku/p1.jpg','images/products/ayeku/p2.jpg','images/products/ayeku/p3.jpg']
  },
  durian: {
    my: 'ဒူရင်းယို', en: 'Durian Paste',
    imgs: ['images/products/durian/p1.jpg','images/products/durian/p2.jpg','images/products/durian/p3.jpg']
  }
};

// Price rows - update these when prices are ready
const PRICES = [
  { my: '၁၀ ကျပ်သား', en: '10 Kyat-Tha', val: '—' },
  { my: '၅၀ ကျပ်သား', en: '50 Kyat-Tha', val: '—' },
  { my: '၁ ပိဿာ',    en: '1 Peittha',   val: '—' }
];


// === LANGUAGE ===
let currentLang = localStorage.getItem('wmf-lang') || 'my';

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

setLanguage(currentLang);


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
  stopSlider();
  startSlider();
}

function startSlider() {
  sliderTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
}

function stopSlider() {
  clearInterval(sliderTimer);
}

const sliderEl = document.getElementById('slider');
sliderEl.addEventListener('mouseenter', stopSlider);
sliderEl.addEventListener('mouseleave', startSlider);
sliderEl.addEventListener('touchstart', stopSlider, { passive: true });
sliderEl.addEventListener('touchend', () => setTimeout(startSlider, 4000), { passive: true });

let sliderTouchX = 0;
sliderEl.addEventListener('touchstart', e => { sliderTouchX = e.touches[0].clientX; }, { passive: true });
sliderEl.addEventListener('touchend', e => {
  const diff = sliderTouchX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
}, { passive: true });

startSlider();


// === MODAL ===
let modalCurrentImg = 0;
let modalTouchStartX = 0;

const overlay   = document.getElementById('modalOverlay');
const modalImgs = document.getElementById('modalImgs');
const mdots     = document.querySelectorAll('.mdot');

function openModal(key) {
  const p = PRODUCTS[key];
  if (!p) return;

  // Set images
  for (let i = 0; i < 3; i++) {
    const img = document.getElementById('mImg' + i);
    img.src = p.imgs[i] || '';
    img.alt = p[currentLang] || p.my;
    img.classList.toggle('active', i === 0);
  }
  modalCurrentImg = 0;
  mdots.forEach((d, i) => d.classList.toggle('active', i === 0));

  // Set title
  document.getElementById('modalTitle').textContent = currentLang === 'my' ? p.my : p.en;

  // Set prices
  const tbody = document.getElementById('modalPrices');
  tbody.innerHTML = PRICES.map(r => `
    <tr>
      <td>${currentLang === 'my' ? r.my : r.en}</td>
      <td class="price-val">${r.val} ${currentLang === 'my' ? 'ကျပ်' : 'Ks'}</td>
    </tr>
  `).join('');

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function modalGoTo(n) {
  const imgs = document.querySelectorAll('.modal-img');
  imgs[modalCurrentImg].classList.remove('active');
  mdots[modalCurrentImg].classList.remove('active');
  modalCurrentImg = (n + 3) % 3;
  imgs[modalCurrentImg].classList.add('active');
  mdots[modalCurrentImg].classList.add('active');
}

// Swipe inside modal gallery
modalImgs.addEventListener('touchstart', e => {
  modalTouchStartX = e.touches[0].clientX;
}, { passive: true });

modalImgs.addEventListener('touchend', e => {
  const diff = modalTouchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 35) modalGoTo(diff > 0 ? modalCurrentImg + 1 : modalCurrentImg - 1);
}, { passive: true });

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});


// === PWA INSTALL ===
let deferredPrompt = null;
const installBanner = document.getElementById('installBanner');

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  if (!localStorage.getItem('wmf-dismissed')) {
    installBanner.style.display = 'flex';
  }
});

document.getElementById('installBtn').addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') installBanner.style.display = 'none';
  deferredPrompt = null;
});

document.getElementById('dismissBtn').addEventListener('click', () => {
  installBanner.style.display = 'none';
  localStorage.setItem('wmf-dismissed', '1');
});

window.addEventListener('appinstalled', () => {
  installBanner.style.display = 'none';
});


// === SERVICE WORKER ===
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}


// === SCROLL REVEAL ===
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity   = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.product-card, .contact-btn').forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(20px)';
    el.style.transition = 'opacity .45s ease, transform .45s ease';
    obs.observe(el);
  });
}
