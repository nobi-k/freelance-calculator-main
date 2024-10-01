// Adding detailed checks for missing inputs in the complex formula calculation

const getInput = (id) => {
  const input = document.getElementById(id);
  if (!input) {
      console.error(`Input element not found: ${id}`);
      return null;
  }
  console.log(`Found input element: ${id}`);
  return input;
};

let inputMonth, inputWeek, inputDay, inputHourlyRate, inputApproximateTime, inputSfTotalPrice, inputRate, inputRapTotalPrice;
let inputAmountFixed, inputWorkingHours, inputRangeRisk, ratioRangeRisk, inputCfTotalPrice;

const initializeElements = () => {
  console.log('Initializing elements...');

  inputMonth = getInput('input-month');
  inputWeek = getInput('input-week');
  inputDay = getInput('input-day');
  inputHourlyRate = getInput('input-hourly-rate');

  inputApproximateTime = getInput('approximate-time');
  inputSfTotalPrice = getInput('input-sf-total-price');

  inputRate = getInput('input-rate');
  inputRapTotalPrice = getInput('input-rap-total-price');

  inputAmountFixed = getInput('input-amount-fixed');
  inputWorkingHours = getInput('input-working-hours');
  inputRangeRisk = getInput('input-range-risk');
  ratioRangeRisk = getInput('ratio-range-risk');
  inputCfTotalPrice = getInput('input-cf-total-price');

// Обработчик для ползунка диапазона рисков
if (inputRangeRisk && ratioRangeRisk) {
  inputRangeRisk.addEventListener('input', (e) => {
      ratioRangeRisk.value = e.target.value;
      console.log(`Range risk updated: ${inputRangeRisk.value}`);
      calculateComplexPrice(); // Пересчитываем сложную формулу при изменении диапазона рисков
  });
}


  bindEventListeners();
};

// Default values
const defaultWeek = 20;
const defaultDay = 8;

// Convert input string to number with fallback for empty values and check for undefined inputs
const parseInput = (str, fallback = 0) => {
  if (!str || !str.value) {
      console.error('Input is undefined or empty:', str);
      return fallback;
  }
  console.log(`Parsing input: ${str.id} with value ${str.value}`);
  return parseFloat(str.value) || fallback;
};

// Format number with currency
const formatCurrency = (value) => {
  const formatter = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });
  console.log(`Formatting value: ${value}`);
  return formatter.format(value);
};

// Calculate hourly rate
function calculateHourlyRate() {
  console.log('Calculating hourly rate...');
  const monthIncome = parseInput(inputMonth); // Месячный доход
  const totalDays = parseInput(inputWeek); // Теперь это общее количество дней в месяц
  const hoursPerDay = parseInput(inputDay, defaultDay); // Количество часов в день

  if (monthIncome && totalDays && hoursPerDay) {
      const hourlyRate = monthIncome / (totalDays * hoursPerDay); // Рассчитываем на основе дней и часов
      inputHourlyRate.value = formatCurrency(hourlyRate);
      console.log(`Hourly rate calculated: ${hourlyRate}`);
  } else {
      console.log("Not enough data to calculate hourly rate.");
  }
}


// Calculate project price with basic formula
function calculateSimplePrice() {
  console.log('Calculating simple formula price...');
  if (!inputApproximateTime || !inputSfTotalPrice || !inputHourlyRate) {
      console.error("Inputs for simple price calculation are missing.");
      return;
  }
  
  const timeRequired = parseInput(inputApproximateTime);
  const hourlyRate = parseInput(inputHourlyRate);
  
  if (timeRequired && hourlyRate) {
      const totalPrice = timeRequired * hourlyRate;
      inputSfTotalPrice.value = formatCurrency(totalPrice);
      console.log(`Simple price calculated: ${totalPrice}`);
  }
}

// Calculate project price with RAP method
function calculateRapPrice() {
  console.log('Calculating RAP price...');
  if (!inputRate || !inputRapTotalPrice) {
      console.error("Inputs for RAP price calculation are missing.");
      return;
  }
  
  const rate = parseInput(inputRate);
  
  if (rate) {
      const totalPrice = rate * 1.2;
      inputRapTotalPrice.value = formatCurrency(totalPrice);
      console.log(`RAP price calculated: ${totalPrice}`);
  }
}

// Calculate project price with complex formula
function calculateComplexPrice() {
  console.log('Calculating complex formula price...');
  
  // Checking for each individual input before the calculation
  if (!inputHourlyRate) console.error("Missing input: inputHourlyRate");
  if (!inputWorkingHours) console.error("Missing input: inputWorkingHours");
  if (!inputAmountFixed) console.error("Missing input: inputAmountFixed");
  if (!inputRangeRisk) console.error("Missing input: inputRangeRisk");
  if (!inputCfTotalPrice) console.error("Missing input: inputCfTotalPrice");

  if (!inputHourlyRate || !inputWorkingHours || !inputAmountFixed || !inputRangeRisk || !inputCfTotalPrice) {
      console.error("Inputs for complex price calculation are missing.");
      return;
  }
  
  const hourlyRate = parseInput(inputHourlyRate);
  const hoursWorked = parseInput(inputWorkingHours);
  const correctionFactor = calculateEditFactor(parseInput(inputAmountFixed));
  const riskMultiplier = parseInput(inputRangeRisk);

  if (hourlyRate && hoursWorked && correctionFactor && riskMultiplier) {
      const totalPrice = hourlyRate * hoursWorked * correctionFactor * riskMultiplier;
      inputCfTotalPrice.value = formatCurrency(totalPrice);
      console.log(`Complex formula price calculated: ${totalPrice}`);
  }
}

// Calculate edit factor based on corrections
function calculateEditFactor(corrections) {
  console.log('Calculating edit factor...');
  if (corrections === 0 || corrections === 1) return 1;
  return 1 + Math.floor(corrections / 3) * 0.5;
}

// Bind event listeners to inputs
const bindEventListeners = () => {
  console.log('Binding event listeners...');
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
          console.log(`Range risk updated: ${inputRangeRisk.value}`);
      });
  }
};

// Функция для переключения между вкладками
function openTab(event, tabName) {
  var i, tabcontent, tabbuttons;
  
  // Скрываем все табы
  tabcontent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }

  // Удаляем класс "active" со всех кнопок
  tabbuttons = document.getElementsByClassName("tab-button");
  for (i = 0; i < tabbuttons.length; i++) {
      tabbuttons[i].className = tabbuttons[i].className.replace(" active", "");
  }

  // Отображаем выбранный таб и добавляем класс "active" к кнопке
  document.getElementById(tabName).style.display = "block";
  event.currentTarget.className += " active";
}


// Initialize everything after the DOM content is fully loaded
window.addEventListener('DOMContentLoaded', initializeElements);
