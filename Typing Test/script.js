class TypingTest {
    constructor() {
        this.currentMode = 'normal';
        this.isRunning = false;
        this.timeLeft = 60;
        this.wordCount = 0;
        this.accuracy = 100;
        this.streak = this.loadStreak();
        this.testHistory = this.loadTestHistory();
        this.currentText = '';
        this.distractionInterval = null;
        this.errorCount = 0;
        this.level = 1;
        this.practiceMode = false;
        this.challengeActive = false;
        this.totalPracticeTime = this.loadPracticeTime();
        this.startTime = null;
        this.totalWords = 0;

        // Local text database
        this.textDatabase = {
            easy: [
                "The quick brown fox jumps over the lazy dog. Simple words make for easy typing practice.",
                "A gentle breeze rustled through the trees, making leaves dance in the sunlight.",
                "She walked along the beach, collecting seashells and watching the waves roll in.",
                "The small cafe on the corner serves the best coffee and fresh pastries daily."
            ],
            medium: [
                "The sophisticated algorithm processes data efficiently, while maintaining accuracy and speed.Hard work and dedication often lead to success, but patience is just as important in achieving one’s goals.",
                "Environmental scientists study the complex interactions between organisms and their ecosystems.As technology rapidly advances, people must adapt and learn new skills to keep up with the changing world.",
                "The revolutionary technology transforms how we communicate and share information globally.The beauty of nature lies in its unpredictability",
                "Professional development opportunities enhance skills and promote career advancement.one moment the sky is clear, the next, clouds gather, and rain begins to fall."
            ],
            hard: [
                "The quintessential characteristics of quantum mechanics challenge our fundamental understanding of reality.The human brain, an intricate network of neurons and synapses, processes information at an astonishing speed, yet it remains a mystery in many ways.",
                "Neuroplasticity demonstrates the brain's remarkable ability to reorganize and adapt to environmental changes.In a world driven by competition, those who embrace lifelong learning and adaptability will find themselves ahead of the curve.",
                "The implementation of cryptocurrency blockchain technology revolutionizes financial transactions worldwide.In a world driven by competition, those who embrace lifelong learning and adaptability will find themselves ahead of the curve.",
                "Interdisciplinary research combines methodologies from multiple academic fields to solve complex problems.Despite the challenges and setbacks that life throws at us, resilience, determination, and self-belief can turn failures into stepping stones for success."
            ],
            expert: [
                "The phenomenological interpretation of quantum mechanics suggests consciousness plays a fundamental role in reality.As the golden hues of the evening sun cast long shadows across the cobblestone streets, a gentle breeze carried the faint aroma of blooming jasmine, evoking a sense of nostalgia and tranquility.",
                "Bioengineered nanomaterials demonstrate unprecedented potential for targeted drug delivery systems.The complexity of artificial intelligence lies not only in its algorithms but also in the ethical dilemmas it presents, forcing society to question the boundaries of automation and human decision-making.",
                "The anthropogenic impact on global climate systems necessitates immediate international cooperation.The complexity of artificial intelligence lies not only in its algorithms but also in the ethical dilemmas it presents, forcing society to question the boundaries of automation and human decision-making.",
                "The epistemological foundations of scientific methodology undergo continuous philosophical scrutiny.While scientific discoveries propel humanity toward an era of unprecedented innovation, the ethical responsibilities that accompany such progress remain a subject of intense debate among scholars and policymakers alike."
            ]
        };

        // DOM Elements
        this.elements = this.initializeElements();
        this.initializeEventListeners();
        this.updateStatistics();
        this.initializeTheme();
    }

    initializeElements() {
        return {
            modeButtons: document.querySelectorAll('.mode-btn'),
            textDisplay: document.getElementById('text-display'),
            inputArea: document.getElementById('input-area'),
            timer: document.getElementById('timer'),
            wpm: document.getElementById('wpm'),
            accuracy: document.getElementById('accuracy'),
            streak: document.getElementById('streak'),
            errors: document.getElementById('errors'),
            level: document.getElementById('level'),
            startBtn: document.getElementById('start-btn'),
            submitBtn: document.getElementById('submit-btn'),
            resetBtn: document.getElementById('reset-btn'),
            practiceBtn: document.getElementById('practice-btn'),
            results: document.getElementById('results'),
            resultWpm: document.getElementById('result-wpm'),
            resultAccuracy: document.getElementById('result-accuracy'),
            resultWords: document.getElementById('result-words'),
            resultTime: document.getElementById('result-time'),
            resultErrors: document.getElementById('result-errors'),
            resultLevel: document.getElementById('result-level'),
            difficultySelect: document.getElementById('difficulty'),
            avgWpm: document.getElementById('avg-wpm'),
            bestWpm: document.getElementById('best-wpm'),
            totalTests: document.getElementById('total-tests'),
            practiceTime: document.getElementById('practice-time'),
            themeSwitch: document.querySelector('.theme-switch'),
            themeIcon: document.querySelector('.theme-icon')
        };
    }

    initializeEventListeners() {

        this.elements.modeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.changeMode(btn.dataset.mode));
        });

        

        this.elements.startBtn.addEventListener('click', () => this.startTest());
        this.elements.submitBtn.addEventListener('click', () => this.submitTest());
        this.elements.resetBtn.addEventListener('click', () => this.resetTest());
        this.elements.practiceBtn.addEventListener('click', () => this.togglePracticeMode());

        // this will take to the input accuracy check
        this.elements.inputArea.addEventListener('input', (e) => this.handleInput(e));

        this.elements.difficultySelect.addEventListener('change', () => this.adjustDifficulty());

        this.elements.themeSwitch.addEventListener('click', () => this.toggleTheme());
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        this.elements.themeIcon.textContent = theme === 'light' ? '💡' : '🌙';
    }

    async getParagraph() {
        const difficulty = this.elements.difficultySelect.value;

        if (this.currentMode === 'programming') {
            return this.getProgrammingSnippet();
        }

        if (this.currentMode === 'challenge') {
            return this.getChallengeText();
        }

        try {
            const response = await fetch(`https://api.quotable.io/random?minLength=100&maxLength=200`);//https://github.com/lukePeavey/quotable
            if (!response.ok) throw new Error('API failed');
            const data = await response.json();
            return this.addComplexity(data.content, difficulty);
        } catch (error) {
            // Use local database if API fails
            const texts = this.textDatabase[difficulty];
            return texts[Math.floor(Math.random() * texts.length)];
        }
    }

    // after getting the api outputdate, we need to change the difficulty as per the selection: easy, medium, hard and expert.
    addComplexity(text, difficulty) {
        if (difficulty === 'easy') return text;

        const complexWords = {
            'medium': ['consequently', 'nevertheless', 'furthermore'],
            'hard': ['philanthropic', 'idiosyncratic', 'paradigmatic'],
            'expert': ['antidisestablishmentarianism', 'pneumonoultramicroscopicsilicovolcanoconiosis']
        };

        const words = text.split(' ');
        const complexity = complexWords[difficulty] || [];//if not then show [] empty, this is helpful to prevent errors.

        return words.map(word => {
            if (Math.random() < 0.1) {
                return complexity[Math.floor(Math.random() * complexity.length)] || word;
            }
            return word;
        }).join(' ');
    }

    getProgrammingSnippet() {
        const snippets = [
            `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node* next;
} Node;

void traverseAndPrint(Node* head) {
    Node* currentNode = head;
    while (currentNode) {
        printf("%d -> ", currentNode->data);
        currentNode = currentNode->next;
    }
    printf("null\n");
}

int main() {
    Node* node1 = (Node*)malloc(sizeof(Node));
    Node* node2 = (Node*)malloc(sizeof(Node));
    Node* node3 = (Node*)malloc(sizeof(Node));
    Node* node4 = (Node*)malloc(sizeof(Node));
    Node* node5 = (Node*)malloc(sizeof(Node));

    node1->data = 7;
    node2->data = 11;
    node3->data = 3;
    node4->data = 2;
    node5->data = 9;

    node1->next = node2;
    node2->next = node3;
    node3->next = node4;
    node4->next = node5;
    node5->next = NULL;

    traverseAndPrint(node1);

    // Free the allocated memory
    free(node1);
    free(node2);
    free(node3);
    free(node4);
    free(node5);
    return 0;
}`,
            `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node* next;
} Node;

void traverseAndPrint(Node* head) {
    Node* currentNode = head;
    while (currentNode) {
        printf("%d -> ", currentNode->data);
        currentNode = currentNode->next;
    }
    printf("null\n");
}

int main() {
    Node* node1 = (Node*)malloc(sizeof(Node));
    Node* node2 = (Node*)malloc(sizeof(Node));
    Node* node3 = (Node*)malloc(sizeof(Node));
    Node* node4 = (Node*)malloc(sizeof(Node));
    Node* node5 = (Node*)malloc(sizeof(Node));

    node1->data = 7;
    node2->data = 11;
    node3->data = 3;
    node4->data = 2;
    node5->data = 9;

    node1->next = node2;
    node2->next = node3;
    node3->next = node4;
    node4->next = node5;
    node5->next = NULL;

    traverseAndPrint(node1);

    // Free the allocated memory
    free(node1);
    free(node2);
    free(node3);
    free(node4);
    free(node5);
    return 0;
}`
        ];



        return snippets[Math.floor(Math.random() * snippets.length)];
        // for now snippet length is 2
    }


    // it's like not random words hence challenging to switch and type
    getChallengeText() {
        const challenges = [
            'The quick brown fox jumps over the lazy dog'.split('').reverse().join(''),
            'Pack my box with five dozen liquor jugs'.split('').map(c => c.toUpperCase()).join(''),
            'How vexingly quick daft zebras jump'.split('').join('&')
        ];
        return challenges[Math.floor(Math.random() * challenges.length)];
    }

    async startTest() {
        this.currentText = await this.getParagraph();
        this.elements.textDisplay.textContent = this.currentText;
        this.elements.inputArea.value = '';
        this.elements.inputArea.disabled = false;
        this.elements.inputArea.focus();
        this.elements.startBtn.disabled = true;
        this.elements.submitBtn.disabled = false;
        this.elements.resetBtn.disabled = false;

        this.isRunning = true;
        this.timeLeft = 60;
        this.wordCount = 0;
        this.accuracy = 100;
        this.errorCount = 0;
        this.startTime = Date.now();
        this.totalWords = 0;

        this.timer = setInterval(() => this.updateTimer(), 1000);
        // update in each second

        if (this.currentMode === 'distraction') {
            this.startDistractions();
        }

        if (this.currentMode === 'challenge') {
            this.startChallenge();
        }
    }

    submitTest() {
        if (!this.isRunning) return;



        this.endTest();
    }

    resetTest() {
        clearInterval(this.timer);
        if (this.distractionInterval) {
            clearInterval(this.distractionInterval);
        }

        this.isRunning = false;
        this.elements.inputArea.value = '';
        this.elements.inputArea.disabled = true;
        this.elements.startBtn.disabled = false;
        this.elements.submitBtn.disabled = true;
        this.elements.resetBtn.disabled = true;
        this.elements.timer.textContent = '60';
        this.elements.wpm.textContent = '0';
        this.elements.accuracy.textContent = '0';
        this.elements.errors.textContent = '0';
        this.elements.results.style.display = 'none';
        this.elements.textDisplay.textContent = 'Click start to begin the test...';

        if (this.challengeActive) {
            this.elements.textDisplay.classList.remove('challenge-active');
            this.challengeActive = false;
        }
    }

    updateTimer() {
        this.timeLeft--;
        this.elements.timer.textContent = this.timeLeft;

        if (this.timeLeft <= 0) {
            this.endTest();
        }

        if (this.practiceMode) {
            this.totalPracticeTime++;
            this.savePracticeTime();
            this.updateStatistics();
        }
    }

    calculateWPM(inputText) {
        const words = inputText.trim().split(/\s+/).length;
        const minutes = (Date.now() - this.startTime) / 60000;
        // startTime is the time when this typing test has started.
        return Math.round(words / minutes);
    }


    // this is to track which text is typed correctly, also used to calculate accuracy.
    handleInput(e) {

        if (!this.isRunning) return;
        // isrunning is a boolean to track if input start test button is clicked or not.//it will track on every input letter.

        const inputText = e.target.value;
        const originalText = this.currentText.substring(0, inputText.length);//each letter track

        let correctChars = 0;
        let errors = 0;

        for (let i = 0; i < inputText.length; i++) {
            if (inputText[i] === originalText[i]) {
                correctChars++;
            } else {
                errors++;
            }
        }

        this.accuracy = Math.round((correctChars / inputText.length) * 100) || 100;//totally based on input typed not the original text//it is out of 100%
        this.errorCount = errors;

        this.elements.accuracy.textContent = this.accuracy;
        this.elements.errors.textContent = this.errorCount;

        // Calculate WPM
        this.wordCount = this.calculateWPM(inputText);
        this.elements.wpm.textContent = this.wordCount;
        this.totalWords = inputText.trim().split(/\s+/).length;

        // Level progression based on word typed in per min//level 1 has 20 words per min, level 2 has 40 words per min ,so on
        if (this.wordCount > this.level * 20 && this.accuracy > 90) {
            this.level++;
            this.elements.level.textContent = this.level;
        }

        // next round of test to calculate stats
        this.updateTextDisplay(inputText, originalText);

    }


    //it is used to update the colour of letters on each type and here it has option to use backspace and recolur the text.
    updateTextDisplay(inputText, originalText) {

        let displayHtml = '';
        const fullText = this.currentText;

        for (let i = 0; i < fullText.length; i++) {
            if (i < inputText.length) {
                if (inputText[i] === fullText[i]) {
                    displayHtml += `<span class="correct">${fullText[i]}</span>`;//adding class to display red color or error
                } else {
                    displayHtml += `<span class="incorrect">${fullText[i]}</span>`;
                }
            } else {
                displayHtml += fullText[i];
            }
        }

        this.elements.textDisplay.innerHTML = displayHtml;
    }

    endTest() {
        clearInterval(this.timer);
        if (this.distractionInterval) {
            clearInterval(this.distractionInterval);
        }

        this.isRunning = false;
        this.elements.inputArea.disabled = true;
        this.elements.submitBtn.disabled = true;

        const timeTaken = Math.round((Date.now() - this.startTime) / 1000);

        const result = {
            date: new Date().toISOString(),
            wpm: this.wordCount,
            accuracy: this.accuracy,
            mode: this.currentMode,
            errors: this.errorCount,
            level: this.level,
            totalWords: this.totalWords,
            timeTaken: timeTaken
        };

        this.testHistory.push(result);//this.testHistory = this.loadTestHistory();
        this.saveTestHistory();
        this.updateStreak();
        this.updateStatistics();
        this.showResults(result);

    }

    showResults(result) {
        this.elements.results.style.display = 'block';
        this.elements.resultWpm.textContent = result.wpm;
        this.elements.resultAccuracy.textContent = `${result.accuracy}%`;
        this.elements.resultWords.textContent = result.totalWords;
        this.elements.resultTime.textContent = `${result.timeTaken}s`;
        this.elements.resultErrors.textContent = result.errors;
        this.elements.resultLevel.textContent = result.level;

        this.drawCharts();
    }

    drawCharts() {
        const recentTests = this.testHistory.slice(-10);

        // Speed Chart
        const speedCtx = document.getElementById('speed-chart').getContext('2d');
        this.drawLineChart(speedCtx, recentTests.map(t => t.wpm), 'WPM Over Time', 'blue');

        // Accuracy Chart
        const accuracyCtx = document.getElementById('accuracy-chart').getContext('2d');
        this.drawLineChart(accuracyCtx, recentTests.map(t => t.accuracy), 'Accuracy Over Time', 'green');

        // Progress Chart
        const progressCtx = document.getElementById('progress-chart').getContext('2d');
        this.drawLineChart(progressCtx, recentTests.map(t => t.level), 'Level Progression', 'purple');
    }

    drawLineChart(ctx, data, label, color) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const padding = 40;
        const max = Math.max(...data, 1); // Prevent division by zero

        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;

        data.forEach((value, index) => {
            const x = padding + (index * ((width - padding * 2) / (data.length - 1)));
            const y = height - (padding + ((value / max) * (height - padding * 2)));



            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Add label
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
        ctx.font = '14px Arial';
        ctx.fillText(label, padding, padding - 10);
    }

    startDistractions() {
        this.distractionInterval = setInterval(() => {
            const distraction = document.createElement('div');
            distraction.className = 'distraction';
            distraction.style.position = 'fixed';
            distraction.style.left = Math.random() * window.innerWidth + 'px';
            distraction.style.top = Math.random() * window.innerHeight + 'px';
            distraction.textContent = '🎈';
            document.body.appendChild(distraction);

            setTimeout(() => distraction.remove(), 1000);
        }, 3000);
    }

    startChallenge() {
        this.challengeActive = true;
        this.elements.textDisplay.classList.add('challenge-active');
    }

    togglePracticeMode() {
        this.practiceMode = !this.practiceMode;
        this.elements.practiceBtn.classList.toggle('active');
        document.body.classList.toggle('practice-mode');
    }

    adjustDifficulty() {
        if (this.isRunning) {
            this.resetTest();
        }
    }

    changeMode(mode) {
        this.currentMode = mode;
        this.elements.modeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        this.resetTest();
    }

    loadTestHistory() {
        const history = localStorage.getItem('typingTestHistory');
        return history ? JSON.parse(history) : [];//to prevent json parse error.: [];
    }

    saveTestHistory() {
        localStorage.setItem('typingTestHistory', JSON.stringify(this.testHistory));
    }


    //streak refers to the number of consecutive days that a specific activity has been performed without interruption. It's a measure of consistency, often used in the context of habits or goals. For example, if someone works out every day, their "day's streak" would increase by one each day they continue to work out. 

    loadStreak() {
        const streakData = localStorage.getItem('typingStreak');
        if (!streakData) return 0;

        const { streak, lastTestDate } = JSON.parse(streakData);
        const lastTest = new Date(lastTestDate);
        const today = new Date();

        if (today.toDateString() === lastTest.toDateString()) {
            return streak;
        } else if (today.getDate() - lastTest.getDate() === 1) {
            return streak;
        }
        return 0;
    }

    updateStreak() {
        const today = new Date();
        const streakData = {
            streak: this.streak + 1,
            lastTestDate: today.toISOString()
        };
        localStorage.setItem('typingStreak', JSON.stringify(streakData));
        this.elements.streak.textContent = streakData.streak;
    }

    loadPracticeTime() {
        return parseInt(localStorage.getItem('totalPracticeTime')) || 0;
    }

    savePracticeTime() {
        localStorage.setItem('totalPracticeTime', this.totalPracticeTime.toString());
    }

    updateStatistics() {
        const recentTests = this.testHistory.slice(-10);//last 10 records

        // Calculate averages
        const avgWpm = recentTests.length > 0
            ? Math.round(recentTests.reduce((sum, test) => sum + test.wpm, 0) / recentTests.length)
            : 0;//https://www.w3schools.com/jsref/jsref_reduce.asp

        //sum is the parameter of function and test is the variable holding array data one at a time, we are extracting wpm value from one element of the array then sum all and store in sum value.

        //The reduce() method in JavaScript is a higher-order array method that executes a reducer function on each element of the array, resulting in a single output value. This method is used to "reduce" an array to a single value, which can be a number, object, string, or any other data type. 

        //array.reduce(callbackFn(accumulator, currentValue, currentIndex, array), initialValue)

        const bestWpm = recentTests.length > 0
            ? Math.max(...recentTests.map(test => test.wpm))
            : 0;//The three dots (...) in JavaScript are known as the spread syntax or spread operator.
        //eg: const arr2 = [...arr1, 4, 5]; // Expands arr1 into individual elements
        // console.log(arr2); // Output: [1, 2, 3, 4, 5]


        // Update statistics display
        this.elements.avgWpm.textContent = avgWpm;
        this.elements.bestWpm.textContent = bestWpm;
        this.elements.totalTests.textContent = this.testHistory.length;
        this.elements.practiceTime.textContent = `${Math.round(this.totalPracticeTime / 60)} min`;
    }
}

// Initialize the typing test
document.addEventListener('DOMContentLoaded', () => {
    new TypingTest();
});

document.getElementById("practiceMode").addEventListener('click', () => {
    window.location="../typing learner/index.html";
});

document.getElementById("learnMode").addEventListener('click', () => {
    window.location="../Advance_Typing_Practice/index.html";
});

