export const initCountdown = (deadline, callback) => {
  const countdownEl = document.querySelector('[data-countdown]');

  if (!deadline || !countdownEl) return;

  const daysEl = countdownEl.querySelector('[data-days]');
  const hoursEl = countdownEl.querySelector('[data-hours]');
  const minutesEl = countdownEl.querySelector('[data-minutes]');
  const secondsEl = countdownEl.querySelector('[data-seconds]');

  const [datePart, timePart = '00:00:00'] = deadline.split(' ');
  const [day, month, year] = datePart.split('.').map(Number);
  const [hours = 0, minutes = 0, seconds = 0] = timePart.split(':').map(Number);
  const deadlineTime = new Date(year, month - 1, day, hours, minutes, seconds).getTime();

  const pad = value => String(value).padStart(2, '0');

  const render = (days, hours, minutes, seconds) => {
    if (daysEl) daysEl.innerHTML = pad(days);
    if (hoursEl) hoursEl.innerHTML = pad(hours);
    if (minutesEl) minutesEl.innerHTML = pad(minutes);
    if (secondsEl) secondsEl.innerHTML = pad(seconds);
  };

  let timerId = null;

  const tick = () => {
    const distance = deadlineTime - Date.now();

    if (distance <= 0) {
      render(0, 0, 0, 0);
      clearInterval(timerId);
      if (typeof callback === 'function') callback();
      return;
    }

    const totalSeconds = Math.floor(distance / 1000);

    let d = Math.floor(totalSeconds / 86400);
    let h = Math.floor((totalSeconds % 86400) / 3600);
    let m = Math.floor((totalSeconds % 3600) / 60);
    let s = totalSeconds % 60;

    // если в разметке нет более мелкого блока, "сворачиваем" его остаток в ближайший имеющийся сверху
    if (!daysEl) {
      h += d * 24;
      d = 0;
    }
    if (!hoursEl) {
      m += h * 60;
      h = 0;
    }
    if (!minutesEl) {
      s += m * 60;
      m = 0;
    }

    render(d, h, m, s);
  };

  tick();

  if (deadlineTime > Date.now()) {
    timerId = setInterval(tick, 1000);
  }
};
