import { popup } from './popup.js';
import { fixHeaderOnScroll, hidePreloader, initNavigationMenu } from './helpers.js';
import { initSliders } from './sliders.js';
import { initScrollToBlock } from './scrollToBlock.js';
import { initAccordeons } from './accordeon.js';
import { initTabs } from './tabs.js';
import { initSelectFields } from './forms.js';
import { initCountdown } from './countdown.js';

popup.init();
window.popup = popup;

initCountdown('05.10.2026 00:00:00');
initNavigationMenu();
initSliders();
initSelectFields();
fixHeaderOnScroll();
initScrollToBlock();
initAccordeons();
initTabs();

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    hidePreloader();
  }, 300);
});
