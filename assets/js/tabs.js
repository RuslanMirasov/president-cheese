export const initTabs = () => {
  const tabButtons = document.querySelectorAll('[data-tab-target]');

  if (tabButtons.length === 0) return;

  const openTab = (e, number) => {
    const button = document.querySelector(`[data-tab-target="${number}"]`) || e.target;
    const tabNumber = number || button.dataset.tabTarget;
    const activButton = document.querySelector('[data-tab-target].active');
    const activTab = document.querySelector('[data-tab].active');
    const targetTab = document.querySelector(`[data-tab="${tabNumber}"]`);

    if (activButton) {
      activButton.classList.remove('active');
      activTab.classList.remove('active');
      activTab.style.height = '0px';
    }

    button.classList.add('active');
    targetTab.classList.add('active');
    targetTab.style.height = targetTab.scrollHeight + 'px';
  };

  tabButtons.forEach(btn => btn.addEventListener('click', openTab));

  openTab(null, 1);
};
