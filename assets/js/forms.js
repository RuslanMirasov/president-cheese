const showErrors = true;
const labelsForFile = document.querySelectorAll('.label-for-file');
const inputsFile = document.querySelectorAll('.input-file');
const showPasswordButtons = document.querySelectorAll('[data-password-btn]');

const validationRegEx = [
  {
    type: 'tel',
    regex: /^\+7\s\d{3}\s\d{3}-\d{2}-\d{2}$/,
    error: 'Не верный формат телефона!',
  },
  {
    type: 'email',
    regex: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
    error: 'Не верный формат E-mail!',
  },
  {
    type: 'password',
    name: 'password',
    regex: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
    error: 'Не верный формат!',
  },
  {
    type: 'url',
    regex: /^(https?:\/\/)?([\w.-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/,
    error: 'Не верный формат URL',
  },
  {
    type: 'checkbox',
    error: 'Это обязательное поле!',
  },
  {
    type: 'radio',
    error: 'Выберите вариант!',
  },
  {
    type: 'file',
    error: 'Фото не выбрано!',
  },
  {
    name: 'name',
    regex: /^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ\s\-]+$/,
    error: 'Цифры и спец. символы запрещены!',
  },
];

const validateInput = input => {
  if (!input.required) return;

  const validationError = error => {
    addErrorHTML(error, input);
    return false;
  };

  const { name, value, checked, type, files } = input;

  if (type === 'file') {
    const errorEl = input.closest('.label-for-file').querySelector('.label__text');
    const file = files[0];
    const maxSize = 3 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff'];
    if (!file) {
      errorEl.innerHTML = `<span class="error">Фото не выбрано!</span>`;
      return false;
    }
    if (!allowedTypes.includes(file.type)) {
      errorEl.innerHTML = `<span class="error">Не верный формат файла!</span>`;
      return false;
    }
    if (file.size > maxSize) {
      resetFile(input.closest('.label-for-file'));
      errorEl.innerHTML = `<span class="error">Файл больше 3MB!</span>`;
      return false;
    }
  }

  if ((type === 'checkbox' || type === 'radio') && !checked) {
    return validationError(validationRegEx.find(rule => rule.type === type).error);
  }

  if (!value || value === '') {
    return validationError('Это обязательное поле!');
  }

  const typeValidation = validationRegEx.find(v => v.type === type);

  if (typeValidation) {
    const regex = new RegExp(typeValidation.regex);

    if (!regex.test(value.trim())) {
      return validationError(typeValidation.error);
    }
  }

  const nameValidation = validationRegEx.find(v => v.name === name);

  if (nameValidation) {
    const regex = new RegExp(nameValidation.regex);

    if (!regex.test(value.trim())) {
      return validationError(nameValidation.error);
    }
  }

  removeErrorHTML(input);
  return true;
};

const validateForm = form => {
  if (!form) return;
  let errorsCount = 0;

  const inputs = form.querySelectorAll('[required]');
  if (inputs.length === 0) return;

  inputs.forEach(input => {
    const isInputValid = validateInput(input);
    errorsCount = isInputValid ? errorsCount : errorsCount + 1;
  });

  return errorsCount <= 0;
};

const addErrorHTML = (error, input) => {
  if (!input) return;

  const label = input.closest('label');
  const existingError = label?.querySelector('.inputError');

  if (error) {
    input.classList.add('invalid');

    if (existingError) {
      existingError.innerHtml = error;
      return;
    }

    if (showErrors) {
      label.insertAdjacentHTML('beforeend', `<span class="inputError"><span>${error}</span></span>`);
      const newError = label.querySelector('.inputError');
      newError.style.height = newError.scrollHeight + 'px';
    }
    return;
  }

  if (existingError) existingError.remove();
  input.classList.remove('invalid');
};

const removeErrorHTML = input => {
  if (!input) return;

  const label = input.closest('label');
  const error = label?.querySelector('.inputError');
  input.classList.remove('invalid');
  if (error) {
    error.style.height = '0px';
    setTimeout(() => {
      error.remove();
    }, 300);
  }
};

const onRequiredInputFocus = e => {
  const input = e.target;
  removeErrorHTML(input);
};

const setSelectPlaceholderClass = input => {
  if (input.value === '') {
    input.classList.add('placeholder');
  } else {
    input.classList.remove('placeholder');
  }
};

document.addEventListener('focusin', e => {
  if (e.target.matches('[required]')) {
    onRequiredInputFocus(e);
  }

  if (e.target.nodeName === 'SELECT') {
    // e.target.classList.add('open');
    e.target.classList.remove('placeholder');
  }
});

document.addEventListener('click', e => {
  if (e.target.nodeName === 'SELECT') {
    e.target.classList.toggle('open');
  }
});

document.addEventListener('blur', e => {
  if (e.target.nodeName === 'SELECT') {
    e.target.classList.remove('open');
  }
});

document.addEventListener('change', e => {
  if (e.target.nodeName === 'SELECT') {
    setTimeout(() => {
      e.target.classList.remove('open');
    }, 0);
  }

  if (e.target.type === 'checkbox') {
    validateInput(e.target);
  }
});

document.addEventListener(
  'blur',
  e => {
    if (e.target.nodeName === 'SELECT') {
      e.target.classList.remove('open');
      setSelectPlaceholderClass(e.target);
    }
  },
  true
);

// PHONE MASK

const handleTelFocus = e => {
  const tel = e.target;
  if (!tel.value) {
    tel.value = '+7 ___ ___-__-__';
  }
};

const handleTelBlur = e => {
  const tel = e.target;
  if (tel.value === '+7 ___ ___-__-__') {
    tel.value = '';
  }
};

const handleTelInput = e => {
  e.preventDefault();
  const input = e.target;
  const tel = input.closest('form').querySelector("[type='tel']");
  const phonePattern = /^\+7\s\d{3}\s\d{3}-\d{2}-\d{2}$/;
  if (!phonePattern.test(tel.value)) {
    tel.value = '';
  }
};

const handleTelClick = e => {
  const tel = e.target;
  const underscoreIndex = tel.value.indexOf('_');
  tel.setSelectionRange(underscoreIndex, underscoreIndex);
};

const handleTelKeydown = e => {
  if (e.key === 'Enter' || e.key === 'Tab') return;
  if (e.ctrlKey || e.metaKey) return;

  e.preventDefault();

  const tel = e.target;
  const value = tel.value;
  const inputType = e.inputType;
  let cursorPosition = tel.selectionStart;
  if (cursorPosition <= 2) return;

  if (inputType === 'deleteContentBackward') {
    while (cursorPosition > 2 && !/\d/.test(value[cursorPosition - 1])) {
      cursorPosition--;
    }

    if (cursorPosition > 2 && /\d/.test(value[cursorPosition - 1])) {
      const newValue = value.slice(0, cursorPosition - 1) + '_' + value.slice(cursorPosition);
      tel.value = newValue;
      tel.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
    }
    return;
  }

  if (/\d/.test(e.data)) {
    const underscoreIndex = value.indexOf('_');
    if (underscoreIndex !== -1 && underscoreIndex > 2) {
      const newValue = value.slice(0, underscoreIndex) + e.data + value.slice(underscoreIndex + 1);
      tel.value = newValue;
      tel.setSelectionRange(underscoreIndex + 1, underscoreIndex + 1);
    }
  }
};

const telHandlers = {
  focus: handleTelFocus,
  blur: handleTelBlur,
  beforeinput: handleTelKeydown,
  input: handleTelInput,
  click: handleTelClick,
};

Object.entries(telHandlers).forEach(([eventName, handler]) => {
  document.addEventListener(
    eventName,
    event => {
      if (event.target?.type === 'tel') {
        handler(event);
      }
    },
    true
  );
});

// INPUT TYPE FILE

const handleFile = (file, label) => {
  const downloadFile = label.closest('.download-file');
  if (file) {
    const validFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff'];

    if (validFormats.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = function (e) {
        label.classList.add('loaded');
        label.style.setProperty('--uploaded-image', `url(${e.target.result})`);
        label.style.background = `#ffffff url(${e.target.result}) no-repeat center center/cover`;

        // Добавляем кнопку сброса после загрузки изображения
        const existingResetButton = downloadFile.querySelector('.file-reset');
        if (!existingResetButton) {
          const resetButton = document.createElement('button');
          resetButton.type = 'button';
          resetButton.classList.add('file-reset');
          downloadFile.appendChild(resetButton);

          // Обработчик для кнопки сброса
          resetButton.addEventListener('click', function () {
            resetFile(label);
          });
        }
      };
      reader.readAsDataURL(file);
    } else {
      label.querySelector('.label__text').innerHTML = `<span class="error">Не верный формат файла!</span>`;
    }
  } else {
    resetFile(label);
  }
};

const resetFile = label => {
  const inputFile = label.querySelector('.input-file');
  const downloadFile = label.closest('.download-file');
  const labelDefaultText = label.querySelector('.label__text').dataset.text;

  label.classList.remove('loaded');
  label.style.background = '';
  label.querySelector('.label__text').innerHTML = labelDefaultText;

  inputFile.value = '';
  const resetButton = downloadFile.querySelector('.file-reset');
  if (resetButton) {
    resetButton.remove();
  }
};

const fileEvents = {
  dragover(event) {
    if (event.target.classList.contains('label-for-file')) {
      event.preventDefault();
    }
  },
  drop(event) {
    if (event.target.classList.contains('label-for-file')) {
      event.preventDefault();
      handleFile(event.dataTransfer.files[0], event.target);
    }
  },
  change(event) {
    if (event.target.classList.contains('input-file')) {
      const label = event.target.closest('.label-for-file');
      handleFile(event.target.files[0], label);
    }
  },
};

Object.entries(fileEvents).forEach(([eventName, handler]) => {
  document.addEventListener(eventName, handler, false);
});

// SUBMIT MIDDLEWARE
document.addEventListener(
  'submit',
  function (event) {
    const form = event.target;
    if (form.tagName.toLowerCase() !== 'form') return;

    const isValid = validateForm(form);
    if (!isValid) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },
  true
);
