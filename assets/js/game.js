const IMAGE_PATH = './assets/img/game/';
const DATA_PATH = './assets/json/game.json';

const SLIDER_KEY = 'masterpiece-slider';
const POPUP_ID = 'game-step-result';

const ROUND_SIZE = 5;
const MIN_FAKES = 2;
const MAX_FAKES = 3;

const PROGRESS_KEY = 'president-game-progress'; // Незавершённый раунд: картины и ответы
const RESULT_KEY = 'president-game-result'; // Итог последнего завершённого раунда (забирает бэкенд)

const TITLE_CORRECT = 'Абсолютно верно!';
const TITLE_WRONG = 'К сожалению <br />Вы ошиблись.';

// ---------- Данные ----------

const loadGameData = async () => {
  const response = await fetch(DATA_PATH);

  if (!response.ok) {
    throw new Error(`Не удалось загрузить ${DATA_PATH}: ${response.status}`);
  }

  return response.json();
};

const storage = {
  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};

const shuffle = array => {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Номер картины из имени файла: 7.webp и 7-fake.webp → '7'
const getPictureId = image => image.replace(/(-fake)?\.\w+$/, '');

// 5 разных картин, у части из них берём фейк. Оригинал и фейк одной картины в раунд не попадают.
const createRound = gameData => {
  const byId = new Map();

  gameData.forEach(item => {
    const id = getPictureId(item.image);
    const pair = byId.get(id) || {};
    pair[item.isFake ? 'fake' : 'original'] = item;
    byId.set(id, pair);
  });

  const pairs = shuffle([...byId.values()].filter(pair => pair.original && pair.fake)).slice(0, ROUND_SIZE);
  const fakesCount = randomInt(MIN_FAKES, MAX_FAKES);

  return shuffle(pairs.map((pair, index) => (index < fakesCount ? pair.fake : pair.original)));
};

// Восстанавливаем незавершённый раунд, если он валиден для текущего game.json
const restoreProgress = gameData => {
  const progress = storage.get(PROGRESS_KEY);

  if (!progress || !Array.isArray(progress.images) || !Array.isArray(progress.answers)) return null;
  if (progress.images.length !== ROUND_SIZE || progress.answers.length >= ROUND_SIZE) return null;

  const round = progress.images.map(image => gameData.find(item => item.image === image));

  if (round.some(item => !item)) return null;

  return { round, answers: progress.answers };
};

const saveProgress = (round, answers) => {
  storage.set(PROGRESS_KEY, { images: round.map(item => item.image), answers });
};

const saveResult = answers => {
  storage.set(RESULT_KEY, {
    finishedAt: new Date().toISOString(),
    total: answers.length,
    correct: answers.filter(answer => answer.isCorrect).length,
    answers,
  });
  storage.remove(PROGRESS_KEY);
};

// ---------- Рендер ----------

const toPlainText = html => html.replace(/<[^>]*>|&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

const createSlide = ({ image, name }) => `
  <div class="swiper-slide">
    <div class="masterpiece">
      <div class="image">
        <img src="${IMAGE_PATH}${image}" alt="${toPlainText(name)}" />
      </div>
      <div class="border-text">
        <p>${name}</p>
      </div>
    </div>
  </div>
`;

const renderSlides = (container, items, activeIndex = 0) => {
  container.innerHTML = items.map(createSlide).join('');

  const swiper = window.swipers?.[SLIDER_KEY];

  if (swiper) {
    swiper.update();
    swiper.slideTo(activeIndex, 0);
  }
};

const toggle = (element, isVisible) => {
  if (element) element.style.display = isVisible ? '' : 'none';
};

// ---------- Игра ----------

export const initGame = async () => {
  const gameWrapper = document.querySelector('[data-game-zone]');

  if (!gameWrapper) return;

  let gameData;

  try {
    gameData = await loadGameData();
  } catch (error) {
    console.error('[game]', error);
    return;
  }

  const gamePopup = gameWrapper.querySelector('[data-game-step-result]'); // Всплывашка показывает результат выбора
  const popupTitle = gameWrapper.querySelector('[data-result-title]'); // Заголовок: угадал / не угадал
  const popupImage = gameWrapper.querySelector('[data-game-current-image]'); // Картинка текущего шага
  const popupDescription = gameWrapper.querySelector('[data-picture-desc]'); // Описание картины (всегда правда о ней)
  const popupPrize = gameWrapper.querySelector('[data-game-prize]'); // Подзаголовок про спецприз, только на последнем шаге
  const nextButton = gameWrapper.querySelector('[data-game-next]'); // «Далее» — к следующей картине
  const finishLink = gameWrapper.querySelector('[data-game-finish]'); // «В личный кабинет» — на последнем шаге
  const originalButton = gameWrapper.querySelector('[data-original-button]'); // Кнопка выбора что картина оригинал
  const fakeButton = gameWrapper.querySelector('[data-fake-button]'); // Кнопка выбора что картина фейк
  const slidesEl = gameWrapper.querySelector('[data-game-slides]'); // Контейнер для слайдов раунда

  if (!gamePopup || !slidesEl || !originalButton || !fakeButton) return;

  const restored = restoreProgress(gameData);
  const round = restored ? restored.round : createRound(gameData);
  const answers = restored ? restored.answers : [];

  if (!restored) saveProgress(round, answers);

  renderSlides(slidesEl, round, answers.length);

  let isBusy = false;

  const setAnswerButtonsDisabled = isDisabled => {
    originalButton.disabled = isDisabled;
    fakeButton.disabled = isDisabled;
  };

  const fillPopup = (item, isCorrect, isLast) => {
    popupTitle.innerHTML = isCorrect ? TITLE_CORRECT : TITLE_WRONG;
    popupImage.src = `${IMAGE_PATH}${item.image}`;
    popupImage.alt = toPlainText(item.name);
    popupDescription.innerHTML = item.description;

    toggle(popupPrize, isLast);
    toggle(nextButton, !isLast);
    toggle(finishLink, isLast);
  };

  const handleAnswer = async answer => {
    if (isBusy || answers.length >= ROUND_SIZE) return;
    isBusy = true;
    setAnswerButtonsDisabled(true);

    const item = round[answers.length];
    const isCorrect = (answer === 'fake') === item.isFake;
    const isLast = answers.length + 1 === ROUND_SIZE;

    fillPopup(item, isCorrect, isLast);
    await window.popup.open(POPUP_ID, { locked: true });

    // Попап не открылся (шла другая анимация) — ответ не засчитываем, даём нажать ещё раз
    if (gamePopup.style.display !== 'block') {
      isBusy = false;
      setAnswerButtonsDisabled(false);
      return;
    }

    answers.push({ image: item.image, isFake: item.isFake, answer, isCorrect });

    if (isLast) {
      saveResult(answers);
    } else {
      saveProgress(round, answers);
    }
  };

  const goToNextPicture = async () => {
    await window.popup.close(true);

    // Закрытие проигнорировано (попап ещё анимируется) — пусть нажмут ещё раз
    if (gamePopup.style.display === 'block') return;

    window.nextSlide(SLIDER_KEY);
    isBusy = false;
    setAnswerButtonsDisabled(false);
  };

  originalButton.addEventListener('click', () => handleAnswer('original'));
  fakeButton.addEventListener('click', () => handleAnswer('fake'));
  nextButton?.addEventListener('click', goToNextPicture);
};
