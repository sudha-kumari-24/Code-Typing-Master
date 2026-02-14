// Theme toggle functionality
const themeSwitch = document.querySelector('.theme-switch');
const themeIcon = document.querySelector('.theme-icon');
const themeText = document.querySelector('.theme-text');

// Check for saved theme preference or use preferred color scheme
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    }
}

// Update the theme icon based on current theme
function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light Mode';
    } else {
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Dark Mode';
    }
}

// Toggle between light and dark theme
themeSwitch.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// Initialize theme on page load
initTheme();



// API endpoints for different content types
const API_ENDPOINTS = {
    words: 'https://random-word-api.herokuapp.com/word?number=50',
    sentences: 'https://api.quotable.io/random?minLength=100&maxLength=140',
    programming: {
        python: 'https://raw.githubusercontent.com/sample-apis/sample-apis/main/datasets/programming-languages/snippets/python.json',
        javascript: 'https://raw.githubusercontent.com/sample-apis/sample-apis/main/datasets/programming-languages/snippets/javascript.json',
        java: 'https://raw.githubusercontent.com/sample-apis/sample-apis/main/datasets/programming-languages/snippets/java.json',
        c: 'https://raw.githubusercontent.com/sample-apis/sample-apis/main/datasets/programming-languages/snippets/c.json',
        cpp: 'https://raw.githubusercontent.com/sample-apis/sample-apis/main/datasets/programming-languages/snippets/cpp.json',
        html: 'https://raw.githubusercontent.com/sample-apis/sample-apis/main/datasets/programming-languages/snippets/html.json'
    }
};

// Fallback content if APIs fail
const FALLBACK_CONTENT = {
    basic: {
        'home-keys': ['asdf jkl; asdf jkl; asdf jkl;', 'fdsa ;lkj fdsa ;lkj', 'a;sldkfj a;sldkfj'],
        'all-letters': ['qwert yuiop asdfg hjkl; zxcvb nm', 'poiuy trewq lkjhg fdsa mnbvc', 'the quick brown fox jumps over the lazy dog'],
        'punctuation': ['Hello, world! How are you?', 'She said, "It\'s time to go."', 'Wait... what did you mean?'],
        'symbols': ['@#$%^&*()_+{}|:"<>?~`', '1234567890-=[]\\;\',./', '!@#$%^&*()_+{}|:"<>?~`'],
        'words': ['the be to of and a in that have I', 'it for not on with he as you do at', 'this but his by from they we say her'],
        'sentences': ['The quick brown fox jumps over the lazy dog.', 'Pack my box with five dozen liquor jugs.', 'How vexingly quick daft zebras jump!']
    },
    programming: {
        'python': [
            'def factorial(n):\n    if n == 0:\n        return 1\n    else:\n        return n * factorial(n-1)',
            'class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age',
            'for i in range(10):\n    print(i)\n    if i % 2 == 0:\n        print("Even")'
        ],
        'javascript': [
            'function greet(name) {\n    return `Hello, ${name}!`;\n}',
            'const numbers = [1, 2, 3];\nconst doubled = numbers.map(n => n * 2);',
            'class Animal {\n    constructor(name) {\n        this.name = name;\n    }\n}'
        ],
        'java': [
            'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}',
            'interface Animal {\n    void makeSound();\n}\nclass Dog implements Animal {\n    public void makeSound() {\n        System.out.println("Woof");\n    }\n}'
        ],
        'c': [
            '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!");\n    return 0;\n}',
            'int factorial(int n) {\n    if (n == 0) return 1;\n    return n * factorial(n - 1);\n}'
        ],
        'cpp': [
            '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World!" << endl;\n    return 0;\n}',
            'template <typename T>\nT max(T a, T b) {\n    return a > b ? a : b;\n}'
        ],
        // 'html-css': [
        //     '<!DOCTYPE html>\n<html>\n<head>\n    <title>Page</title>\n    <style>\n        body { font-family: Arial; }\n    </style>\n</head>\n<body>\n    <h5>Hello</h5>\n</body>\n</html>',
        //     '.container {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}'
        // ]
        'html-css': [
            '.btn {padding: 10px 15px;background-color: var(--primary-color);color: white;border: none;border-radius: 4px;cursor: pointer;font-size: 0.9rem;display: flex;align-items: center;justify-content: center;transition: all 0.2s;width: 100%;}',
            '.container {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}'
        ]
    },
    challenge: {
        'speed-test': ['The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!'],
        'distraction': ['Focus on typing while ignoring distractions around the text. This helps improve concentration during typing.'],
        'no-look': ['Try to type without looking at your keyboard. This helps build muscle memory for touch typing.'],
        'symbol-mix': ['T#e qu!ck br@wn f$x j%mps ^ver th& l*zy d(g. P@ck my b)x w(th f!ve d$zen l%quor j&gs.'],
        'long-text': ['The history of typing dates back to the 19th century with the invention of typewriters. Early typing was slow and required significant practice to become proficient. With the advent of computers, typing became an essential skill for communication and work. Today, touch typing is a valuable skill that can significantly improve productivity. Practice regularly to improve your speed and accuracy.']
    }
};

// Emojis for distraction
const EMOJIS = ['😀', '😂', '🤣', '😍', '😎', '🤔', '🙄', '😴', '🥳', '🤯', '👻', '💩', '🤖', '👾', '🐶', '🐱', '🦄', '🐉', '🌈', '🔥'];

// Game state
let currentMode = 'basic';
let currentLevel = 'home-keys';
let currentWordIndex = 0;
let startTime;
let isTyping = false;
let mistakes = 0;
let totalCharacters = 0;
let timerInterval;
let totalTime = 0;
let distractionInterval;
let isDistractionActive = false;
let currentText = '';
let keyboardLayout;

// DOM elements
const textDisplay = document.getElementById('text-display');
const inputField = document.getElementById('input-field');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const timeDisplay = document.getElementById('time');
const charsDisplay = document.getElementById('chars');
const levelTitle = document.getElementById('current-level-title');
const levelDescription = document.getElementById('level-description');
const progressBar = document.getElementById('progress-bar');
const distractionsContainer = document.getElementById('distractions');
const menuItems = document.querySelectorAll('.menu-item');
const submenuItems = document.querySelectorAll('.submenu-item');
const difficultySelect = document.getElementById('difficulty');
const durationSelect = document.getElementById('duration');
const newTextBtn = document.getElementById('new-text-btn');
const resultModal = document.getElementById('result-modal');
const resultWpm = document.getElementById('result-wpm');
const resultAccuracy = document.getElementById('result-accuracy');
const resultTime = document.getElementById('result-time');
const resultChars = document.getElementById('result-chars');
const resultMistakes = document.getElementById('result-mistakes');
const tryAgainBtn = document.getElementById('try-again-btn');
const newLevelBtn = document.getElementById('new-level-btn');
const keyboardElement = document.querySelector('.keyboard');

// Keyboard layout
const KEYBOARD_LAYOUT = [
    ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '{', '}', '|'],
    ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ':', '"', 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '<', '>', '?', 'Shift'],
    ['Ctrl', 'Win', 'Alt', 'Space', 'AltGr', 'Fn', 'Ctrl']
];

// Initialize the app
function init() {
    // Create virtual keyboard
    createKeyboard();

    // Set up event listeners
    menuItems.forEach(item => {
        item.addEventListener('click', () => switchMode(item.dataset.mode));
    });

    submenuItems.forEach(item => {
        item.addEventListener('click', () => startLevel(item.dataset.level));
    });

    inputField.addEventListener('input', handleInput);
    inputField.addEventListener('keydown', handleKeyDown);

    newTextBtn.addEventListener('click', fetchNewText);
    tryAgainBtn.addEventListener('click', restartTest);
    newLevelBtn.addEventListener('click', showLevelSelector);

    // Disable duration select for certain levels
    durationSelect.addEventListener('change', () => {
        if (currentMode === 'challenge' && ['speed-test', 'distraction'].includes(currentLevel)) {
            durationSelect.value = '1';
            alert('Duration is fixed for this challenge');
        }
    });

    // Start with home keys level
    startLevel('home-keys');
    inputField.focus();
}

// Create virtual keyboard
function createKeyboard() {
    KEYBOARD_LAYOUT.forEach(row => {
        const rowElement = document.createElement('div');
        rowElement.className = 'keyboard-row';

        row.forEach(key => {
            const keyElement = document.createElement('div');
            keyElement.className = 'key';
            keyElement.dataset.key = key.toLowerCase();

            // Special classes for larger keys
            if (['Tab', 'Caps', 'Shift', 'Enter', 'Backspace', 'Ctrl', 'Alt', 'Win', 'Space', 'AltGr', 'Fn'].includes(key)) {
                keyElement.classList.add(key.toLowerCase());

                if (key === 'Backspace') {
                    keyElement.innerHTML = '<i class="fas fa-backspace"></i>';
                } else if (key === 'Win') {
                    keyElement.innerHTML = '<i class="fab fa-windows"></i>';
                } else {
                    keyElement.textContent = key;
                }
            } else {
                keyElement.textContent = key;

                // Add home keys class
                if (['a', 's', 'd', 'f', 'j', 'k', 'l', ';'].includes(key.toLowerCase())) {
                    keyElement.classList.add('home');
                }
            }

            rowElement.appendChild(keyElement);
        });

        keyboardElement.appendChild(rowElement);
    });
}

// Switch between modes (basic, programming, challenge)
function switchMode(mode) {
    currentMode = mode;

    // Update active menu item
    menuItems.forEach(item => {
        item.classList.toggle('active', item.dataset.mode === mode);
    });

    // Start the first level of the new mode
    const firstLevel = Object.keys(FALLBACK_CONTENT[mode])[0];
    startLevel(firstLevel);
}

// Start a new level
async function startLevel(level) {
    currentLevel = level;

    // Update active submenu item
    submenuItems.forEach(item => {
        item.classList.toggle('active', item.dataset.level === level);
        // textDisplay.textContent = `Select the new level from sidebar`;
    });

    

    // Update level title and description
    updateLevelInfo();

    // textDisplay.textContent = `Select the new level from sidebar`;

    // Reset game state
    currentWordIndex = 0;
    mistakes = 0;
    totalCharacters = 0;
    isTyping = false;
    totalTime = 0;
    clearInterval(timerInterval);
    clearInterval(distractionInterval);

    // Update UI
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100%';
    timeDisplay.textContent = '0:00';
    charsDisplay.textContent = '0';
    progressBar.style.width = '0%';

    // Clear distractions
    distractionsContainer.innerHTML = '';
    isDistractionActive = false;

    // Fetch new text for the level
    await fetchNewText();

    // Start distractions if this is the distraction challenge
    if (currentLevel === 'distraction') {
        isDistractionActive = true;
        startDistractions();
    }

    // Focus the input field
    inputField.value = '';
    inputField.focus();
}

// Update level title and description
function updateLevelInfo() {
    let title = '';
    let description = '';

    switch (currentLevel) {
        case 'home-keys':
            title = 'Home Keys Practice';
            description = 'Practice the home row keys (ASDF JKL;)';
            break;
        case 'all-letters':
            title = 'All Letters Practice';
            description = 'Practice all alphabet keys';
            break;
        case 'punctuation':
            title = 'Punctuation Practice';
            description = 'Practice typing with punctuation marks';
            break;
        case 'symbols':
            title = 'Symbols Practice';
            description = 'Practice typing special symbols';
            break;
        case 'words':
            title = 'Common Words Practice';
            description = 'Practice typing common English words';
            break;
        case 'sentences':
            title = 'Sentences Practice';
            description = 'Practice typing complete sentences';
            break;
        case 'python':
            title = 'Python Typing Practice';
            description = 'Practice typing Python code';
            break;
        case 'javascript':
            title = 'JavaScript Typing Practice';
            description = 'Practice typing JavaScript code';
            break;
        case 'java':
            title = 'Java Typing Practice';
            description = 'Practice typing Java code';
            break;
        case 'c':
            title = 'C Typing Practice';
            description = 'Practice typing C code';
            break;
        case 'cpp':
            title = 'C++ Typing Practice';
            description = 'Practice typing C++ code';
            break;
        case 'html-css':
            title = 'HTML/CSS Typing Practice';
            description = 'Practice typing HTML and CSS';
            break;
        case 'speed-test':
            title = 'Speed Test Challenge';
            description = 'Test your typing speed with random text';
            break;
        case 'distraction':
            title = 'Distraction Challenge';
            description = 'Type with distracting elements on screen';
            break;
        case 'no-look':
            title = 'No Look Challenge';
            description = 'Practice typing without looking at the keyboard';
            break;
        case 'symbol-mix':
            title = 'Symbol Mix Challenge';
            description = 'Practice with mixed symbols and letters';
            break;
        case 'long-text':
            title = 'Long Text Challenge';
            description = 'Practice with longer passages';
            break;
    }

    levelTitle.textContent = title;
    levelDescription.textContent = description;
}

// Fetch new text for the current level
async function fetchNewText() {
    try {
        let content = '';
        const difficulty = difficultySelect.value;

        if (currentMode === 'basic') {
            if (currentLevel === 'words') {
                const response = await fetch(API_ENDPOINTS.words);
                const words = await response.json();
                content = words.slice(0, difficulty === 'easy' ? 20 : difficulty === 'medium' ? 30 : 50).join(' ');
            } else if (currentLevel === 'sentences') {
                const response = await fetch(API_ENDPOINTS.sentences);
                const data = await response.json();
                content = data.content;
            } else {
                // Use fallback for other basic levels
                const fallback = FALLBACK_CONTENT.basic[currentLevel];
                content = difficulty === 'easy' ? fallback[0] :
                    difficulty === 'medium' ? fallback.slice(0, 2).join(' ') :
                        fallback.join(' ');
            }
        }
        else if (currentMode === 'programming') {
            if (currentLevel === 'html-css') {
                // HTML/CSS uses the HTML endpoint
                const response = await fetch(API_ENDPOINTS.programming.html);
                const data = await response.json();
                content = difficulty === 'easy' ? data[0].snippet :
                    difficulty === 'medium' ? data.slice(0, 2).map(d => d.snippet).join('\n\n') :
                        data.map(d => d.snippet).join('\n\n');

            }
            // if (currentLevel === 'html-css') {
            //     const response = await fetch(API_ENDPOINTS.programming.html);
            //     const data = await response.json();
            //     let snippets = difficulty === 'easy' ? [data[0].snippet] :
            //         difficulty === 'medium' ? data.slice(0, 2).map(d => d.snippet) :
            //             data.map(d => d.snippet);

            //     // Escape HTML before displaying
            //     const content = snippets.map(snippet =>
            //         snippet.replace(/&/g, '&amp;')
            //             .replace(/</g, '&lt;')
            //             .replace(/>/g, '&gt;')
            //             .replace(/"/g, '&quot;')
            //             .replace(/'/g, '&#39;')
            //     ).join('\n\n');

            //     // textDisplay.innerHTML = `<pre><code>${escapedContent}</code></pre>`;
            //     // textDisplay.textContent = `<pre><code>${escapedContent}</code></pre>`;
            //     textDisplay.textContent = `<pre><code>${content}</code></pre>`;
            // }
            else {
                const response = await fetch(API_ENDPOINTS.programming[currentLevel]);
                const data = await response.json();
                content = difficulty === 'easy' ? data[0].snippet :
                    difficulty === 'medium' ? data.slice(0, 2).map(d => d.snippet).join('\n\n') :
                        data.map(d => d.snippet).join('\n\n');
            }
        } else {
            // Challenge mode uses fallback content
            const fallback = FALLBACK_CONTENT.challenge[currentLevel];
            content = fallback[0];
        }

        currentText = content;
        displayText(content);
    } catch (error) {
        console.error('Error fetching content:', error);
        // Use fallback content if API fails
        const fallback = FALLBACK_CONTENT[currentMode][currentLevel];
        const difficulty = difficultySelect.value;
        currentText = difficulty === 'easy' ? fallback[0] :
            difficulty === 'medium' ? fallback.slice(0, 2).join(' ') :
                fallback.join(' ');
        displayText(currentText);
    }
}

// Display the practice text
function displayText(content) {
    // For programming languages, preserve formatting with backticks
    if (currentMode === 'programming') {

        // if (currentLevel !== 'html-css') {
        textDisplay.innerHTML = `<pre><code>${content}</code></pre>`;
        // }

        // Split into words and add spans
        const words = content.split(/(\s+)/).filter(word => word.trim().length > 0);

        textDisplay.innerHTML = words
            .map((word, index) => {
                // Preserve whitespace in programming code
                if (word.match(/\s+/)) {
                    return word.replace(/ /g, '&nbsp;').replace(/\n/g, '<br>');
                }
                return `<span class="word ${index === 0 ? 'current' : ''}">${word}</span>`;
            })
            .join('');
    } else {
        // For regular text, simple word splitting
        const words = content.split(' ');
        textDisplay.innerHTML = words
            .map((word, index) => `<span class="word ${index === 0 ? 'current' : ''}">${word}</span>`)
            .join(' ');
    }
}

// Handle typing input
function handleInput(e) {
    if (!isTyping) {
        isTyping = true;
        startTime = new Date().getTime();
        startTimer();
    }

    const currentWord = textDisplay.querySelectorAll('.word')[currentWordIndex];
    const typedValue = e.target.value;

    // Highlight the pressed key on the virtual keyboard
    if (e.data) {
        highlightKey(e.data);
    } else if (typedValue.endsWith(' ')) {
        highlightKey(' ');
    }

    // Check if space was pressed (word completed)
    if (typedValue.endsWith(' ')) {
        const wordToCompare = currentWord.textContent.replace(/&nbsp;/g, ' ').replace(/<br>/g, '\n');
        const typedWord = typedValue.trim();

        // Check if the word was typed correctly
        if (typedWord === wordToCompare) {
            currentWord.classList.add('correct');
        } else {
            currentWord.classList.add('incorrect');
            // Count mistakes (difference in length plus wrong characters)
            mistakes += Math.max(wordToCompare.length, typedWord.length);
        }

        totalCharacters += wordToCompare.length + 1; // +1 for space
        currentWord.classList.remove('current');

        // Move to next word or end the test
        const words = textDisplay.querySelectorAll('.word');
        if (currentWordIndex < words.length - 1) {
            currentWordIndex++;
            words[currentWordIndex].classList.add('current');
        } else {
            // Test completed
            endTest();
        }

        e.target.value = '';
        updateStats();
    }
}

// Handle special keys (backspace, etc.)
function handleKeyDown(e) {
    if (e.key === 'Backspace') {
        highlightKey('backspace');
    } else if (e.key === 'Enter') {
        highlightKey('enter');
    } else if (e.key === 'Tab') {
        e.preventDefault();
        highlightKey('tab');
    } else if (e.key === 'CapsLock') {
        highlightKey('capslock');
    } else if (e.key === 'Shift') {
        highlightKey('shift');
    } else if (e.key === 'Control') {
        highlightKey('control');
    } else if (e.key === 'Alt') {
        highlightKey('alt');
    } else if (e.key === 'Meta') {
        highlightKey('meta');
    }
}

// Start the timer
function startTimer() {
    clearInterval(timerInterval);

    // For challenge levels, fix duration if needed
    let duration = parseInt(durationSelect.value) * 60;
    if (currentMode === 'challenge' && ['speed-test', 'distraction'].includes(currentLevel)) {
        duration = 60; // 1 minute fixed for these challenges
    }

    timerInterval = setInterval(() => {
        totalTime++;

        // Format time as MM:SS
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;
        timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        // Update progress bar based on duration setting
        const progress = (totalTime / duration) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;

        // End test if time is up
        if (totalTime >= duration) {
            endTest();
        }
    }, 1000);
}

// Update WPM and accuracy stats
function updateStats() {
    if (!startTime || !isTyping) return;

    const currentTime = new Date().getTime();
    const timeElapsed = (currentTime - startTime) / 1000 / 60; // in minutes
    const wordsTyped = currentWordIndex;
    const wpm = Math.round(wordsTyped / timeElapsed);
    const accuracy = Math.round(((totalCharacters - mistakes) / totalCharacters) * 100);

    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = `${accuracy}%`;
    charsDisplay.textContent = totalCharacters;
}

// Highlight a key on the virtual keyboard
function highlightKey(key) {
    const keyElement = document.querySelector(`[data-key="${key.toLowerCase()}"]`);
    if (keyElement) {
        keyElement.classList.add('active');
        setTimeout(() => keyElement.classList.remove('active'), 100);
    }
}

// Start distractions for distraction challenge
function startDistractions() {
    clearInterval(distractionInterval);

    // Add initial distractions
    addDistraction();
    addDistraction();
    addDistraction();

    // Add new distractions periodically
    distractionInterval = setInterval(() => {
        if (isDistractionActive) {
            addDistraction();
        }
    }, 2000);
}

// Add a single distraction element
function addDistraction() {
    const distraction = document.createElement('div');
    distraction.className = 'distraction';
    distraction.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

    // Random position
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    distraction.style.left = `${x}%`;
    distraction.style.top = `${y}%`;

    // Random animation duration
    const duration = 5 + Math.random() * 10;
    distraction.style.animationDuration = `${duration}s`;

    // Random size
    const size = 1 + Math.random() * 3;
    distraction.style.fontSize = `${size}rem`;

    distractionsContainer.appendChild(distraction);

    // Remove after animation completes
    setTimeout(() => {
        distraction.remove();
    }, duration * 1000);
}

// End the current test
function endTest() {
    isTyping = false;
    clearInterval(timerInterval);
    clearInterval(distractionInterval);
    isDistractionActive = false;

    // Calculate final stats
    updateStats();

    // Show result modal
    showResultModal();
}

// Show result modal with statistics
function showResultModal() {
    resultWpm.textContent = wpmDisplay.textContent;
    resultAccuracy.textContent = accuracyDisplay.textContent;
    resultTime.textContent = timeDisplay.textContent;
    resultChars.textContent = charsDisplay.textContent;
    resultMistakes.textContent = mistakes;

    resultModal.classList.remove('hidden');
}

// Restart the current test
function restartTest() {
    resultModal.classList.add('hidden');
    startLevel(currentLevel);
}

// Show level selector
function showLevelSelector() {
    resultModal.classList.add('hidden');
    inputField.blur();
     textDisplay.innerHTML = `<h3>Select the new level from sidebar</h3>`;
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);