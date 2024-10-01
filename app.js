// Функция для безопасного получения элемента по ID и логирования его наличия
const getInput = (id) => {
  const input = document.getElementById(id);
  if (!input) {
      console.error(`Элемент с ID ${id} не найден.`);
      return null;
  }
  console.log(`Найден элемент с ID: ${id}`);
  return input;
};

// Инициализация переменных для инпутов
let inputMonth, inputWeek, inputDay, inputHourlyRate, inputApproximateTime, inputSfTotalPrice, inputRate, inputRapTotalPrice;
let inputAmountFixed, inputWorkingHours, inputRangeRisk, ratioRangeRisk, inputCfTotalPrice;

// Функция для инициализации всех элементов на странице после загрузки DOM
const initializeElements = () => {
  console.log('Инициализация элементов...');

  // Получаем все необходимые элементы
  inputMonth = getInput('input-month');
  inputWeek = getInput('input-week');
  inputDay = getInput('input-day');
  inputHourlyRate = document.querySelectorAll('.input-hourly-rate');

  inputApproximateTime = getInput('approximate-time');
  inputSfTotalPrice = getInput('input-sf-total-price');

  inputRate = getInput('input-rate');
  inputRapTotalPrice = getInput('input-rap-total-price');

  inputAmountFixed = getInput('input-amount-fixed');
  inputWorkingHours = getInput('input-working-hours');
  inputRangeRisk = getInput('input-range-risk');
  ratioRangeRisk = getInput('ratio-range-risk');
  inputCfTotalPrice = getInput('input-cf-total-price');

  if (inputRangeRisk && ratioRangeRisk) {
      ratioRangeRisk.value = inputRangeRisk.value;
      console.log(`Инициализировано значение диапазона рисков: ${inputRangeRisk.value}`);
  }

  // Привязываем обработчики событий после инициализации элементов
  bindEventListeners();
};

// Значения по умолчанию для недель и часов
const defaultWeek = 20;
const defaultDay = 8;

// Функция для преобразования значения инпута в число, с проверкой на отсутствие и значение по умолчанию
const parseInput = (str, fallback = 0) => {
  if (!str || !str.value) {
      console.error('Элемент пуст или не определен:', str);
      return fallback;
  }
  console.log(`Разбираем значение инпута: ${str.id} со значением ${str.value}`);
  return parseFloat(str.value) || fallback;
};

// Функция для форматирования числа в валютный формат
const formatCurrency = (value) => {
  const formatter = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });
  console.log(`Форматируем значение: ${value}`);
  return formatter.format(value);
};

// Функция для расчета почасовой ставки
function calculateHourlyRate() {
  console.log('Расчет почасовой ставки...');
  const monthIncome = parseInput(inputMonth);
  const workDays = parseInput(inputWeek, defaultWeek);
  const hoursPerDay = parseInput(inputDay, defaultDay);
  
  if (monthIncome && workDays && hoursPerDay) {
      const hourlyRate = monthIncome / (workDays * hoursPerDay);
      inputHourlyRate.forEach(input => {
          if (input) input.value = formatCurrency(hourlyRate);
      });
      console.log(`Почасовая ставка рассчитана: ${hourlyRate}`);
  } else {
      console.log("Недостаточно данных для расчета почасовой ставки.");
  }
}

// Функция для расчета стоимости проекта по простой формуле
function calculateSimplePrice() {
  console.log('Расчет стоимости по простой формуле...');
  if (!inputApproximateTime || !inputSfTotalPrice || !inputHourlyRate[0]) {
      console.error("Отсутствуют данные для расчета по простой формуле.");
      return;
  }
  
  const timeRequired = parseInput(inputApproximateTime);
  const hourlyRate = parseInput(inputHourlyRate[0]);
  
  if (timeRequired && hourlyRate) {
      const totalPrice = timeRequired * hourlyRate;
      inputSfTotalPrice.value = formatCurrency(totalPrice);
      console.log(`Стоимость проекта рассчитана (простая формула): ${totalPrice}`);
  }
}

// Функция для расчета стоимости проекта по методу RAP
function calculateRapPrice() {
  console.log('Расчет стоимости по методу RAP...');
  if (!inputRate || !inputRapTotalPrice) {
      console.error("Отсутствуют данные для расчета по методу RAP.");
      return;
  }
  
  const rate = parseInput(inputRate);
  
  if (rate) {
      const totalPrice = rate * 1.2; // Добавляем 20%
      inputRapTotalPrice.value = formatCurrency(totalPrice);
      console.log(`Стоимость проекта рассчитана (метод RAP): ${totalPrice}`);
  }
}

// Функция для расчета стоимости проекта по сложной формуле
function calculateComplexPrice() {
  console.log('Расчет стоимости по сложной формуле...');
  
  // Проверяем наличие каждого инпута перед расчетом
  if (!inputHourlyRate[0]) console.error("Отсутствует inputHourlyRate");
  if (!inputWorkingHours) console.error("Отсутствует inputWorkingHours");
  if (!inputAmountFixed) console.error("Отсутствует inputAmountFixed");
  if (!inputRangeRisk) console.error("Отсутствует inputRangeRisk");
  if (!inputCfTotalPrice) console.error("Отсутствует inputCfTotalPrice");

  if (!inputHourlyRate[0] || !inputWorkingHours || !inputAmountFixed || !inputRangeRisk || !inputCfTotalPrice) {
      console.error("Недостаточно данных для расчета по сложной формуле.");
      return;
  }
  
  const hourlyRate = parseInput(inputHourlyRate[0]);
  const hoursWorked = parseInput(inputWorkingHours);
  const correctionFactor = calculateEditFactor(parseInput(inputAmountFixed));
  const riskMultiplier = parseInput(inputRangeRisk);

  if (hourlyRate && hoursWorked && correctionFactor && riskMultiplier) {
      const totalPrice = hourlyRate * hoursWorked * correctionFactor * riskMultiplier;
      inputCfTotalPrice.value = formatCurrency(totalPrice);
      console.log(`Стоимость проекта рассчитана (сложная формула): ${totalPrice}`);
  }
}

// Функция для расчета коэффициента правок
function calculateEditFactor(corrections) {
  console.log('Расчет коэффициента правок...');
  if (corrections === 0 || corrections === 1) return 1;
  return 1 + Math.floor(corrections / 3) * 0.5;
}

// Функция для привязки обработчиков событий к инпутам
const bindEventListeners = () => {
  console.log('Привязка обработчиков событий...');
  if (inputMonth && inputWeek && inputDay) {
      [inputMonth, inputWeek, inputDay].forEach(input => input.addEventListener('input', calculateHourlyRate));
  }
  if (inputApproximateTime) {
      inputApproximateTime.addEventListener('input', calculateSimplePrice);
  }
  if (inputRate) {
      inputRate.addEventListener('input', calculateRapPrice);
  }
  if (inputAmountFixed && inputWorkingHours && ratioRangeRisk) {
      [inputAmountFixed, inputWorkingHours, ratioRangeRisk].forEach(input => input.addEventListener('input', calculateComplexPrice));
  }
  if (ratioRangeRisk) {
      ratioRangeRisk.addEventListener('input', (e) => {
          inputRangeRisk.value = e.target.value;
          console.log(`Обновлено значение риска: ${inputRangeRisk.value}`);
      });
  }
};

// Инициализируем все элементы и привязываем события после полной загрузки DOM
window.addEventListener('DOMContentLoaded', initializeElements);
