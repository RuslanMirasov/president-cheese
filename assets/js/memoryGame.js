export const initMamoryGame = () => {
  const root = document.querySelector('[data-memory-game]');

  if (!root) return;

  const IMG_PATH = './assets/img/memory/';
  const IMAGES = [5, 2, 1, 2, 3, 6, 4, 1, 4, 5, 6, 7, 7, 3];
  const FLIP_BACK_DELAY = 600;

  const flip = el => {
    el.classList.add('active');
  };

  const unflip = el => {
    el.classList.remove('active');
  };

  const shuffle = a => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  shuffle(IMAGES);
  root.innerHTML = IMAGES.map(
    id => `
    <li>
      <div class="card" data-id="${id}">
        <div class="flip">
          <div class="flip__front"></div>
          <div class="flip__back">
            <img src="${IMG_PATH}${id}.webp" alt="">
          </div>
        </div>
      </div>
    </li>
  `
  ).join('');

  let first = null;
  let lock = false;
  let matchedPairs = 0;
  const totalPairs = IMAGES.length / 2;

  root.addEventListener('click', e => {
    const card = e.target.closest('.card');
    if (!card || lock) return;
    if (card.classList.contains('active') || card.classList.contains('matched')) return;

    flip(card);

    if (!first) {
      first = card;
      return;
    }

    const isMatch = first.dataset.id === card.dataset.id;
    if (isMatch) {
      first.classList.add('matched');
      card.classList.add('matched');
      first = null;
      if (++matchedPairs === totalPairs) {
        setTimeout(() => {
          // В КОНЦЕ ИГРЫ МЕНЯЕМ СЛАЙД
          window.goToSlide('2');
        }, 800);
      }
    } else {
      lock = true;
      setTimeout(() => {
        unflip(first);
        unflip(card);
        first = null;
        lock = false;
      }, FLIP_BACK_DELAY);
    }
  });
};
