// Simple calculator logic

const display = document.getElementById('display');
const buttons = document.querySelectorAll('.calc-btn');
const clearBtn = document.getElementById('clear');

let currentExpression = '';

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.getAttribute('data-value');
        if (value === '=') {
            calculate();
        } else {
            append(value);
        }
    });
});

clearBtn.addEventListener('click', () => {
    currentExpression = '';
    updateDisplay();
});

function append(value) {
    // avoid multiple dots
    if (value === '.' && currentExpression.slice(-1) === '.') return;
    currentExpression += value;
    updateDisplay();
}

function updateDisplay() {
    display.value = currentExpression;
}

function calculate() {
    try {
        // Use eval cautiously; input is controlled via buttons
        const result = eval(currentExpression);
        currentExpression = result;
        updateDisplay();
    } catch (e) {
        display.value = 'Error';
        currentExpression = '';
    }
}