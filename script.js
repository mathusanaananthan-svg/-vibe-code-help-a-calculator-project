let expression = '';
let justCalculated = false;

const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');

function updateDisplay(value) {
  resultEl.textContent = value;
  resultEl.classList.toggle('small', value.toString().length > 10);
}

function appendChar(char) {
  const operators = ['+', '-', '*', '/'];

  if (justCalculated) {
    // If last action was calculation, start fresh for operators or new numbers
    if (operators.includes(char)) {
      expression = resultEl.textContent;
    } else {
      expression = '';
    }
    justCalculated = false;
  }

  const lastChar = expression.slice(-1);

  // Prevent multiple consecutive operators
  if (operators.includes(char) && operators.includes(lastChar)) {
    expression = expression.slice(0, -1);
  }

  // Prevent leading operator (except minus for negative)
  if (expression === '' && operators.includes(char) && char !== '-') return;

  // Prevent multiple dots in the same number segment
  if (char === '.') {
    const parts = expression.split(/[\+\-\*\/]/);
    const lastPart = parts[parts.length - 1];
    if (lastPart.includes('.')) return;
    if (lastPart === '' || lastPart === undefined) {
      expression += '0';
    }
  }

  expression += char;

  // Show live expression
  const display = expression
    .replace(/\*/g, ' × ')
    .replace(/\//g, ' ÷ ')
    .replace(/\+/g, ' + ')
    .replace(/-/g, ' − ');

  expressionEl.textContent = display;
  updateDisplay(char === '.' ? expression : evalSafe(expression));
}

function evalSafe(expr) {
  try {
    const result = Function('"use strict"; return (' + expr + ')')();
    if (!isFinite(result)) return 'Error';
    // Format nicely
    return parseFloat(result.toFixed(10)).toString();
  } catch {
    return expression.slice(-1) === '' ? '0' : expression.replace(/[^0-9.]/g, '') || '0';
  }
}

function calculate() {
  if (!expression) return;
  try {
    let result = Function('"use strict"; return (' + expression + ')')();
    if (!isFinite(result)) {
      updateDisplay('Error');
      expressionEl.textContent = expression.replace(/\*/g, ' × ').replace(/\//g, ' ÷ ');
      expression = '';
      return;
    }
    result = parseFloat(result.toFixed(10)).toString();
    expressionEl.textContent = expression
      .replace(/\*/g, ' × ')
      .replace(/\//g, ' ÷ ')
      .replace(/\+/g, ' + ')
      .replace(/-/g, ' − ') + ' =';
    updateDisplay(result);
    expression = result;
    justCalculated = true;
  } catch {
    updateDisplay('Error');
    expression = '';
  }
}

function clearAll() {
  expression = '';
  justCalculated = false;
  expressionEl.textContent = '';
  updateDisplay('0');
}

function deleteLast() {
  if (justCalculated) {
    clearAll();
    return;
  }
  expression = expression.slice(0, -1);
  const display = expression
    .replace(/\*/g, ' × ')
    .replace(/\//g, ' ÷ ')
    .replace(/\+/g, ' + ')
    .replace(/-/g, ' − ');
  expressionEl.textContent = display;
  updateDisplay(expression ? evalSafe(expression) : '0');
}

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendChar(e.key);
  else if (e.key === '+') appendChar('+');
  else if (e.key === '-') appendChar('-');
  else if (e.key === '*') appendChar('*');
  else if (e.key === '/') { e.preventDefault(); appendChar('/'); }
  else if (e.key === '.') appendChar('.');
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Backspace') deleteLast();
  else if (e.key === 'Escape') clearAll();
});
