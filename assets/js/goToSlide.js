const REGISTRY = (window.swipers ||= Object.create(null));

export function registerNamedSwiper(key, instance) {
  const name = String(key || '').trim();
  if (!name) return;
  REGISTRY[name] = instance;
}

function resolveIndex(swiper, target, base = 1) {
  const s = String(target).trim();
  const num = Number(s);
  if (s !== '' && Number.isFinite(num)) {
    return base === 1 ? num - 1 : num;
  }
  return Array.from(swiper.slides).findIndex(el => el.dataset.step === s);
}

export function goToSlide(target, { key, base = 1 } = {}) {
  const keys = Object.keys(REGISTRY);
  const swiper = key ? REGISTRY[key] : keys.length === 1 ? REGISTRY[keys[0]] : null;

  if (!swiper) {
    console.warn('[goToSlide] no swiper found. Pass { key } or name your data-slider.');
    return;
  }

  const idx = resolveIndex(swiper, target, base);
  if (idx < 0 || idx >= swiper.slides.length) {
    console.warn('[goToSlide] target not found:', target);
    return;
  }
  swiper.slideTo(idx);
}

export function nextSlide(key) {
  const swiper = REGISTRY[key];

  if (!swiper) {
    console.warn('[nextSlide] swiper not found:', key);
    return;
  }

  swiper.slideNext();
}

export function prevSlide(key) {
  const swiper = REGISTRY[key];

  if (!swiper) {
    console.warn('[prevSlide] swiper not found:', key);
    return;
  }

  swiper.slidePrev();
}

window.goToSlide = goToSlide;
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.registerNamedSwiper = registerNamedSwiper;
