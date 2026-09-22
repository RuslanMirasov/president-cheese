import { popup } from './popup.js';
import { fixHeaderOnScroll, hidePreloader, initNavigationMenu, checkFixedBg } from './helpers.js';
import { initSliders } from './sliders.js';
import { initScrollToBlock } from './scrollToBlock.js';
import { initAccordeons } from './accordeon.js';
import { initTabs } from './tabs.js';
import { initMamoryGame } from './memoryGame.js';
import { initSelectFields } from './forms.js';
import { initCountdown } from './countdown.js';

popup.init();
window.popup = popup;

initCountdown('05.10.2026 00:00:00');
initNavigationMenu();
checkFixedBg();
initSliders();
initSelectFields();
fixHeaderOnScroll();
initScrollToBlock();
initAccordeons();
initTabs();
initMamoryGame();

setTimeout(() => {
  hidePreloader();
}, 300);
