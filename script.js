// Show the selected calculator section and update menu
function showCalculator(type) {
    // Hide all calculator sections
    document.querySelectorAll('.calculator-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the selected calculator
    document.getElementById(`${type}-calculator`).classList.add('active');
    
    // Update navigation menu to hide current calculator
    updateNavigationMenu(type);
}

// Update navigation menu to show only other calculators
function updateNavigationMenu(currentType) {
    const nav = document.querySelector('.calculator-nav');
    const calculatorTypes = {
        'arithmetic': 'Arithmetic Calculator',
        'age': 'Age Calculator',
        'bmi': 'BMI Calculator',
        'currency': 'Currency Calculator'
    };
    
    // Clear existing buttons
    nav.innerHTML = '';
    
    // Add buttons for other calculators
    Object.entries(calculatorTypes).forEach(([type, label]) => {
        if (type !== currentType) {
            const button = document.createElement('button');
            button.onclick = () => { showCalculator(type); toggleMenu(); };
            button.textContent = label;
            nav.appendChild(button);
        }
    });
}

// Calculate age from birthdate with precision
function calculateAge() {
    const birthDate = new Date(document.getElementById('birthDate').value);
    const today = new Date();
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    
    if (days < 0) {
        months--;
        // Get days in last month
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += lastMonth.getDate();
    }
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    const resultElement = document.getElementById('age-result');
    resultElement.textContent = `You are ${years} years, ${months} months, and ${days} days old`;
}

// Calculate BMI
function calculateBMI() {
    const weight = parseFloat(document.getElementById('weight').value);
    const heightFt = parseFloat(document.getElementById('height-ft').value);
    const heightIn = parseFloat(document.getElementById('height-in').value) || 0;
    
    if (weight && heightFt) {
        // Convert height to meters
        const totalInches = (heightFt * 12) + heightIn;
        const heightM = totalInches * 0.0254;
        
        const bmi = weight / (heightM * heightM);
        const resultElement = document.getElementById('bmi-result');
        
        let category;
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi < 25) category = 'Normal weight';
        else if (bmi < 30) category = 'Overweight';
        else category = 'Obese';
        
        resultElement.textContent = `Your BMI is ${bmi.toFixed(1)} (${category})`;
    }
}

// Convert currency
async function convertCurrency() {
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    
    // Using a free exchange rate API
    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const data = await response.json();
        
        const rate = data.rates[toCurrency];
        const result = amount * rate;
        
        const resultElement = document.getElementById('currency-result');
        resultElement.textContent = `${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`;
    } catch (error) {
        const resultElement = document.getElementById('currency-result');
        resultElement.textContent = 'Error fetching exchange rates';
    }
}

// Arithmetic Calculator Functions
let displayValue = '';

function appendNumber(num) {
    displayValue += num;
    document.getElementById('display').value = displayValue;
}

function appendOperator(operator) {
    displayValue += operator;
    document.getElementById('display').value = displayValue;
}

function clearDisplay() {
    displayValue = '';
    document.getElementById('display').value = '';
}

function calculate() {
    try {
        displayValue = eval(displayValue).toString();
        document.getElementById('display').value = displayValue;
    } catch (error) {
        document.getElementById('display').value = 'Error';
        displayValue = '';
    }
}

// Handle keyboard input
document.addEventListener('keydown', function(event) {
    // Only process keyboard events when arithmetic calculator is visible
    const arithmeticCalc = document.getElementById('arithmetic-calculator');
    if (!arithmeticCalc.classList.contains('active')) return;

    const key = event.key;
    
    // Prevent the default action for calculator keys
    if ("0123456789.+-*/=Enter\Backspace".includes(key)) {
        event.preventDefault();
    }

    // Numbers and decimal point
    if (/^[0-9.]$/.test(key)) {
        appendNumber(key);
    }
    // Operators
    else if (['+', '-', '*', '/'].includes(key)) {
        appendOperator(key);
    }
    // Enter or = for calculation
    else if (key === 'Enter' || key === '=') {
        calculate();
    }
    // Backspace for deleting last character
    else if (key === 'Backspace') {
        displayValue = displayValue.slice(0, -1);
        document.getElementById('display').value = displayValue;
    }
    // Escape or Delete for clear
    else if (key === 'Escape' || key === 'Delete') {
        clearDisplay();
    }
});

// Hamburger menu functionality
function toggleMenu() {
    const nav = document.querySelector('.calculator-nav');
    nav.classList.toggle('show');
    
    // Animate hamburger icon
    const bars = document.querySelectorAll('.hamburger .bar');
    bars[0].style.transform = nav.classList.contains('show') ? 'rotate(45deg) translate(6px, 6px)' : 'none';
    bars[1].style.opacity = nav.classList.contains('show') ? '0' : '1';
    bars[2].style.transform = nav.classList.contains('show') ? 'rotate(-45deg) translate(6px, -6px)' : 'none';
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const nav = document.querySelector('.calculator-nav');
    const hamburger = document.querySelector('.hamburger');
    
    if (!nav.contains(event.target) && !hamburger.contains(event.target) && nav.classList.contains('show')) {
        toggleMenu();
    }
});

// Show Arithmetic Calculator by default when page loads
window.onload = () => showCalculator('arithmetic');
