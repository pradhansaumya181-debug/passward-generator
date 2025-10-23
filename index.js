const characterPools = {
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:",./<>?'
};


const passwordDisplay = document.getElementById('passwordDisplay');
const lengthInput = document.getElementById('length');
const includeUppercase = document.getElementById('includeUppercase');
const includeNumbers = document.getElementById('includeNumbers');
const includeSymbols = document.getElementById('includeSymbols');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');


function generatePassword(length, useUpper, useNumbers, useSymbols) {
    let requiredCharacters = '';
    let guaranteedCharacters = [];


    requiredCharacters += characterPools.lower;


    if (useUpper) {
        requiredCharacters += characterPools.upper;

        guaranteedCharacters.push(getRandomChar(characterPools.upper));
    }
    if (useNumbers) {
        requiredCharacters += characterPools.numbers;

        guaranteedCharacters.push(getRandomChar(characterPools.numbers));
    }
    if (useSymbols) {
        requiredCharacters += characterPools.symbols;

        guaranteedCharacters.push(getRandomChar(characterPools.symbols));
    }


    let remainingLength = length - guaranteedCharacters.length;
    let passwordArray = [...guaranteedCharacters];


    for (let i = 0; i < remainingLength; i++) {
        passwordArray.push(getRandomChar(requiredCharacters));
    }


    shuffleArray(passwordArray);

    return passwordArray.join('');
}


function getRandomChar(pool) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


generateBtn.addEventListener('click', () => {
    const length = +lengthInput.value;
    const useUpper = includeUppercase.checked;
    const useNumbers = includeNumbers.checked;
    const useSymbols = includeSymbols.checked;


    if (length <= 0 || (!useUpper && !useNumbers && !useSymbols)) {
        passwordDisplay.value = 'Select length and character types.';
        return;
    }

    const newPassword = generatePassword(length, useUpper, useNumbers, useSymbols);
    passwordDisplay.value = newPassword;
});


copyBtn.addEventListener('click', () => {
    const password = passwordDisplay.value;
    if (!password || password === 'Select length and character types.') {
        alert('Nothing to copy!');
        return;
    }


    navigator.clipboard.writeText(password).then(() => {

        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 1500);
    }).catch(err => {

        passwordDisplay.select();
        document.execCommand('copy');
        alert('Copied the password!');
    });
});
