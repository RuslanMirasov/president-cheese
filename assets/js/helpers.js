export const throttle = (func, limit) => {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};

export const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

export const hidePreloader = () => {
  const preloader = document.querySelector('[data-preloader]');
  if (!preloader) return;

  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 300);

  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 400);

  setTimeout(() => {
    preloader.remove();
  }, 2000);
};

export const fixHeaderOnScroll = () => {
  const header = document.querySelector('.header');

  if (!header) return;

  const updateHeader = () => {
    if (window.scrollY > 0) {
      header.classList.add('fix');
      return;
    }
    header.classList.remove('fix');
  };

  const throttledScroll = throttle(updateHeader, 100);
  const debouncedScrollEnd = debounce(updateHeader, 100);

  updateHeader();
  window.addEventListener('scroll', () => {
    throttledScroll();
    debouncedScrollEnd();
  });
};

export const initNavigationMenu = () => {
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.navigation ');
  const menuLinks = document.querySelectorAll('.menu__link');

  const toggleMenu = () => {
    burger.classList.toggle('open');
    menu.classList.toggle('open');
  };

  if (burger) burger.addEventListener('click', toggleMenu);
  menuLinks.forEach(link => link.addEventListener('click', toggleMenu));
};

export const checkFixedBg = () => {
  const elements = document.querySelectorAll('[data-fixed-bg]');

  if (elements.length == 0) return;

  const top = window.scrollY;
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const absTop = rect.top + window.scrollY;
    if (absTop <= top) {
      el.classList.add('fix');
    } else {
      el.classList.remove('fix');
    }
  });

  window.addEventListener('scroll', checkFixedBg);
  window.addEventListener('resize', checkFixedBg);
};
