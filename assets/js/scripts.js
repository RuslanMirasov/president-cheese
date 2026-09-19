import { popup } from './popup.js';
import { fixHeaderOnScroll, hidePreloader, initNavigationMenu, checkFixedBg } from './helpers.js';
import { initSliders } from './sliders.js';
import { initScrollToBlock } from './scrollToBlock.js';
import { initAccordeons } from './accordeon.js';
import { initTabs } from './tabs.js';
import { initMamoryGame } from './memoryGame.js';

popup.init();
window.popup = popup;
initNavigationMenu();
checkFixedBg();
initSliders();
fixHeaderOnScroll();
initScrollToBlock();
initAccordeons();
initTabs();
initMamoryGame();

setTimeout(() => {
  hidePreloader();
}, 300);
