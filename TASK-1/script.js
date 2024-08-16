// JavaScript for Calculator Functionality

const display = document.getElementById('result');
const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.classList.contains('operator')) {
            handleOperator(button.textContent);
        } else if (button.classList.contains('equal')) {
            calculate();
        } else if (button.classList.contains('clear')) {
            clearDisplay();
        } else {
            updateDisplay(button.textContent);
        }
    });
});

function updateDisplay(value) {
    display.value += value;
}

function handleOperator(operator) {
    if (display.value !== '' && !display.value.endsWith(' ')) {
        display.value += ` ${operator} `;
    }
}

function calculate() {
    try {
        display.value = eval(display.value.replace(/ /g, ''));
    } catch (error) {
        display.value = 'Error';
    }
}

function clearDisplay() {
    display.value = '';
}