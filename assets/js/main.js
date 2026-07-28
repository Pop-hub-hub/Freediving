/* ==========================================================================
   MARSA ALAM FREEDIVERS — MAIN JS
   Modular, dependency-free ES6. Each module only wires up if its markup
   exists on the current page, so this single file safely runs site-wide.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  await loadComponents();
  initNavbar();
  initMobileMenu();
  initButtonRipple();
  initScrollReveal();
  initBackToTop();
  initAccordion();
  initGalleryFilter();
  initLightbox();
  initDepthGauge();
  initWeatherWidget();
  initForms();
  initYear();
  initReviewsSlider();
});

async function loadComponents() {
  // Load Navbar
  const navbarContainer = document.getElementById('navbar-container');
  if (navbarContainer) {
    const navbarResponse = await fetch('components/navbar.html');
    const navbarHtml = await navbarResponse.text();
    navbarContainer.innerHTML = navbarHtml;
  }

  // Load Footer
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    const footerResponse = await fetch('components/footer.html');
    const footerHtml = await footerResponse.text();
    footerContainer.innerHTML = footerHtml;
  }

  // Set active nav link
  setActiveNavLink();
}

function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
  const navLinks = document.querySelectorAll('.nav-link[data-page]');
  navLinks.forEach(link => {
    link.classList.remove('is-active');
    if (link.dataset.page === currentPage) {
      link.classList.add('is-active');
    }
  });
}

/* -----------------------------
   Navbar: solid background after scroll
------------------------------ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const toggleState = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 40);
  };

  toggleState();
  window.addEventListener('scroll', toggleState, { passive: true });
}

/* -----------------------------
   Mobile menu toggle
------------------------------ */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.classList.toggle('is-active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  links.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.classList.remove('is-active');
      document.body.style.overflow = '';
    });
  });
}

/* -----------------------------
   Button ripple effect
------------------------------ */
function initButtonRipple() {
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'btn__ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}

/* -----------------------------
   Scroll reveal via IntersectionObserver
------------------------------ */
function initScrollReveal() {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((t) => t.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  targets.forEach((t) => observer.observe(t));
}

/* -----------------------------
   Back to top button
------------------------------ */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener(
    'scroll',
    () => btn.classList.toggle('is-visible', window.scrollY > 600),
    { passive: true }
  );

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* -----------------------------
   FAQ accordion
------------------------------ */
function initAccordion() {
  const items = document.querySelectorAll('.accordion__item');
  if (!items.length) return;

  items.forEach((item) => {
    const trigger = item.querySelector('.accordion__trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close siblings within the same accordion group for a cleaner UX
      const group = item.closest('.accordion');
      if (group) {
        group.querySelectorAll('.accordion__item.is-open').forEach((openItem) => {
          if (openItem !== item) {
            openItem.classList.remove('is-open');
            openItem.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
          }
        });
      }

      item.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}

/* -----------------------------
   Gallery filtering
------------------------------ */
function initGalleryFilter() {
  const chips = document.querySelectorAll('.filter-chip');
  const items = document.querySelectorAll('.gallery-item');
  if (!chips.length || !items.length) return;

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      const filter = chip.dataset.filter;

      items.forEach((item) => {
        const matches = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('is-hidden', !matches);
      });
    });
  });
}

/* -----------------------------
   Gallery lightbox
------------------------------ */
function initLightbox() {
  const lightbox = document.querySelector('.lightbox');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  if (!lightbox || !galleryItems.length) return;

  const captionEl = lightbox.querySelector('.lightbox__caption');
  const mediaEl = lightbox.querySelector('.media-placeholder span');
  let currentIndex = 0;

  const openAt = (index) => {
    currentIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    const label = item.dataset.caption || item.querySelector('span')?.textContent || '';
    const img = item.querySelector('img');
    if (captionEl) captionEl.textContent = label;
    if (mediaEl) {
      if (img) {
        mediaEl.innerHTML = `<img src="${img.src}" alt="${img.alt || label}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-md);">`;
      } else {
        mediaEl.textContent = label;
      }
    }
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openAt(index));
  });

  lightbox.querySelector('.lightbox__close')?.addEventListener('click', close);
  lightbox.querySelector('.lightbox__prev')?.addEventListener('click', () => openAt(currentIndex - 1));
  lightbox.querySelector('.lightbox__next')?.addEventListener('click', () => openAt(currentIndex + 1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') openAt(currentIndex + 1);
    if (e.key === 'ArrowLeft') openAt(currentIndex - 1);
  });
}

/* -----------------------------
   Depth gauge fill animation
   Animates the signature "surface to abyss" line once in view.
------------------------------ */
function initDepthGauge() {
  const gauges = document.querySelectorAll('.depth-gauge__fill');
  if (!gauges.length) return;

  if (!('IntersectionObserver' in window)) {
    gauges.forEach((g) => (g.style.height = g.dataset.fill || '100%'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.height = entry.target.dataset.fill || '100%';
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  gauges.forEach((g) => observer.observe(g));
}

/* -----------------------------
   Weather widget
   Auto-loads Dive Daf/Marsa Alam weather immediately using Open-Meteo (no API key needed).
------------------------------ */
function initWeatherWidget() {
  const widget = document.querySelector('[data-weather-widget]');
  if (!widget) return;

  const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
  const defaultLabel = 'Dive Daf, Marsa Alam';
  // Marsa Alam, Egypt coordinates
  const lat = 25.0667;
  const lon = 34.8833;

  const cityEl = widget.querySelector('[data-weather-city]');
  const tempEl = widget.querySelector('[data-weather-temp]');
  const conditionEl = widget.querySelector('[data-weather-condition]');
  const iconEl = widget.querySelector('[data-weather-icon]');
  const statusEl = widget.querySelector('[data-weather-status]');
  const metaEl = widget.querySelector('[data-weather-meta]');

  // WMO weather code mapping to descriptions (from Open-Meteo docs)
  const weatherCodeMap = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Freezing drizzle',
    57: 'Freezing drizzle',
    61: 'Light rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Freezing rain',
    67: 'Freezing rain',
    71: 'Light snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Light showers',
    81: 'Moderate showers',
    82: 'Heavy showers',
    85: 'Light snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Thunderstorm with heavy hail'
  };

  // Weather code to icon mapping (using Open-Meteo's icon set)
  const weatherIconMap = {
    0: '01d',
    1: '01d',
    2: '02d',
    3: '03d',
    45: '50d',
    48: '50d',
    51: '09d',
    53: '09d',
    55: '09d',
    56: '09d',
    57: '09d',
    61: '10d',
    63: '10d',
    65: '10d',
    66: '10d',
    67: '10d',
    71: '13d',
    73: '13d',
    75: '13d',
    77: '13d',
    80: '10d',
    81: '10d',
    82: '10d',
    85: '13d',
    86: '13d',
    95: '11d',
    96: '11d',
    99: '11d'
  };

  const setStatus = (message, isError = false) => {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.style.color = isError ? 'rgba(255, 214, 214, 0.95)' : 'rgba(255,255,255,0.78)';
  };

  const setWeatherState = (data) => {
    const currentWeather = data?.current_weather;
    const weatherCode = currentWeather?.weathercode;
    const temperature = typeof currentWeather?.temperature !== undefined ? `${Math.round(currentWeather.temperature)}°C` : '--°C';
    const condition = weatherCodeMap[weatherCode] || 'Weather data unavailable';
    const iconCode = weatherIconMap[weatherCode] || '01d';

    if (cityEl) cityEl.textContent = defaultLabel;
    if (tempEl) tempEl.textContent = temperature;
    if (conditionEl) conditionEl.textContent = condition;

    if (iconEl) {
      iconEl.src = `https://open-meteo.com/images/weather_icons/${iconCode}.svg`;
      iconEl.alt = condition || 'Current weather icon';
      iconEl.hidden = false;
    }
  };

  const buildUrl = () => {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current_weather: 'true',
      timezone: 'auto'
    });
    return `${WEATHER_URL}?${params.toString()}`;
  };

  const fetchWeather = async () => {
    return fetch(buildUrl())
      .then((response) => {
        if (!response.ok) {
          throw new Error(`weather-request-failed-${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setWeatherState(data);
        setStatus(`Updated moments ago for Dive Daf.`);
        if (metaEl) metaEl.hidden = true;
      })
      .catch((error) => {
        console.error('Weather fetch error:', error);
        setStatus('We could not load Dive Daf weather right now. Please check your internet connection and reload.', true);
        if (metaEl) metaEl.hidden = false;
      });
  };

  // Auto-load Dive Daf weather immediately on page load
  fetchWeather();
}

/* -----------------------------
   Form handling (contact + newsletter)
   Phase 1 has no backend, so this simulates a submission and shows
   a confirmation message. Wire up a real endpoint here in Phase 2.
------------------------------ */
/* -----------------------------
   Form handling (contact + newsletter)
------------------------------ */
function initForms() {
  document.querySelectorAll('form[data-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const status = form.querySelector('.form-status');
      const type = form.dataset.form === 'contact' ? 'message' : 'subscription';

      // Contact form validation
      if (type === 'message') {
        const name = form.querySelector('#name')?.value.trim();
        const email = form.querySelector('#email')?.value.trim();
        const phone = form.querySelector('#phone')?.value.trim();
        const interest = form.querySelector('#interest')?.value;

        if (!name || !email || !phone || !interest) {
          if (status) {
            status.textContent = 'Please fill in all required fields.';
            status.classList.add('is-visible');
          }
          return;
        }
      }

      if (status) {
        status.textContent =
          type === 'message'
            ? "Thanks — your message is in. We'll reply within 24 hours."
            : "You're on the list. Watch your inbox for Red Sea updates.";

        status.classList.add('is-visible');
      }

      form.reset();
    });
  });
}

/* -----------------------------
   Auto footer year
------------------------------ */
function initYear() {
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

/* -----------------------------
   Reviews Slider
   Auto-play every 2.5 seconds + manual navigation with arrows
------------------------------ */
function initReviewsSlider() {
  const slider = document.querySelector('[data-testimonials-slider]');
  if (!slider) return;

  const track = slider.querySelector('[data-slider-track]');
  const originalSlides = Array.from(slider.querySelectorAll('.reviews-slide'));
  const prevBtn = slider.querySelector('[data-slider-prev]');
  const nextBtn = slider.querySelector('[data-slider-next]');
  let currentIndex = 0;
  let autoplayInterval;
  let slideWidthPercent = 25; // Default: 4 slides on desktop
  let totalSlidesCount = originalSlides.length;
  const AUTOPLAY_DELAY = 2500; // 2.5 seconds
  const MAX_VISIBLE_SLIDES = 4;

  // Duplicate slides for infinite loop
  const cloneSlides = () => {
    // Remove any existing clones first
    const existingClones = track.querySelectorAll('.reviews-slide--clone');
    existingClones.forEach(clone => clone.remove());

    // Clone slides and add to end of track
    originalSlides.forEach((slide) => {
      const clone = slide.cloneNode(true);
      clone.classList.add('reviews-slide--clone');
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    totalSlidesCount = track.querySelectorAll('.reviews-slide').length;
  };

  const calculateSlideWidth = () => {
    const viewportWidth = window.innerWidth;
    if (viewportWidth <= 640) {
      slideWidthPercent = 100; // 1 slide
    } else if (viewportWidth <= 1024) {
      slideWidthPercent = 50; // 2 slides
    } else {
      slideWidthPercent = 25; // 4 slides
    }
  };

  const goToSlide = (index) => {
    currentIndex = index;
    track.style.transition = 'transform 0.6s ease';
    track.style.transform = `translateX(-${currentIndex * slideWidthPercent}%)`;

    // Handle infinite loop - snap back without animation when reaching clones
    if (currentIndex >= originalSlides.length) {
      setTimeout(() => {
        track.style.transition = 'none';
        currentIndex = currentIndex - originalSlides.length;
        track.style.transform = `translateX(-${currentIndex * slideWidthPercent}%)`;
      }, 600);
    } else if (currentIndex < 0) {
      setTimeout(() => {
        track.style.transition = 'none';
        currentIndex = currentIndex + originalSlides.length;
        track.style.transform = `translateX(-${currentIndex * slideWidthPercent}%)`;
      }, 600);
    }
  };

  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);

  const startAutoplay = () => {
    if (autoplayInterval) clearInterval(autoplayInterval);
    autoplayInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
  };

  const stopAutoplay = () => {
    if (autoplayInterval) clearInterval(autoplayInterval);
  };

  const handleResize = () => {
    calculateSlideWidth();
    track.style.transition = 'none';
    goToSlide(currentIndex); // Re-align to correct position on resize
    setTimeout(() => {
      track.style.transition = 'transform 0.6s ease';
    }, 50);
  };

  // Initialize
  cloneSlides();
  calculateSlideWidth();
  track.style.transition = 'transform 0.6s ease';

  // Bind events
  if (prevBtn) prevBtn.addEventListener('click', () => {
    prevSlide();
    startAutoplay();
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    nextSlide();
    startAutoplay();
  });

  // Pause autoplay when user hovers slider
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  // Handle window resize
  window.addEventListener('resize', handleResize);

  // Start autoplay
  startAutoplay();
}
