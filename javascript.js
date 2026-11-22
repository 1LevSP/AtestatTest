// Добавить:
// 1) чтобы можно было переходить между вопросами 
// 3) добавить билеты с задачами 
// Свободные вопросы:487

// Select the HTML elements
const questionContainer = document.querySelector(".questions");
const resultsContainer = document.querySelector(".results");
const startScreen = document.querySelector(".start-screen");
const startButtons = document.querySelectorAll(".startBtn");
const footer = document.querySelector("footer");
const restartButton = document.querySelector("#restart");
const menuButton = document.querySelector("#menuBtn");
const totalSpan = document.querySelectorAll(".total");
const correctSpan = document.querySelector("#correct");
const attestationResults = document.querySelector("#attestationResults");
const attestationQuestionsCorrect = document.querySelector("#attestationQuestionsCorrect");
const attestationTasksCorrect = document.querySelector("#attestationTasksCorrect");
const currentSpan = document.querySelector("#current");
const overlay = document.querySelector("#overlay");
const overlayImg = document.querySelector("#overlay-img");
const myBar = document.getElementById("myBar");

// Define global variables
let shuffledQuestions = [];
let currentQuestionIndex = 0;
let numCorrect = 0;
let numCurrent = 0;
let attestationQuestionsCorrectCount = 0;
let attestationTasksCorrectCount = 0;
let selectedMode = "random";

const nextButton = document.querySelector(".nextBtn");
nextButton.addEventListener("click", () => {
    nextButton.disabled = true;
    currentQuestionIndex++;
    if (currentQuestionIndex === shuffledQuestions.length) {
        showResults();
    } else {
        showQuestion();
    }
});

document.addEventListener("keydown", event => {
    if (event.code === "Space" && !nextButton.disabled && !event.repeat) {
        event.preventDefault();
        nextButton.click();
    }
});

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Return a random subset without changing the original question bank.
function getRandomItems(items, count) {
    const shuffledItems = [...items];
    shuffleArray(shuffledItems);
    return shuffledItems.slice(0, Math.min(count, shuffledItems.length));
}

function recordCorrectAnswer() {
    numCorrect++;

    if (selectedMode === "attestation") {
        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        if (taskData.includes(currentQuestion)) {
            attestationTasksCorrectCount++;
        } else {
            attestationQuestionsCorrectCount++;
        }
    }
}

// Function to populate the HTML with question and answer options
function showQuestion() {
    document.querySelector(".explanationBtn")?.remove();
    document.querySelector(".methodologyBtn")?.remove();
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const hasNumericAnswer = Number.isFinite(currentQuestion.numericAnswer);

    // Shuffle answers
    if (!hasNumericAnswer) {
        shuffleArray(currentQuestion.answers);
    }

    // Create question container
    const container = document.createElement("div");
    container.className = "container";

    // Create question image
    const quizImage = document.createElement("img");
    quizImage.src = currentQuestion.imgLink;
    quizImage.className = "questionImg";
    quizImage.id = "quiz-image";
    quizImage.alt = currentQuestion.question;

    const questionImageArea = document.createElement("div");
    questionImageArea.className = "questionImageArea";
    questionImageArea.appendChild(quizImage);

    // Create question text safely
    const questionText = document.createElement("p");
    questionText.className = "question";
    questionText.textContent = currentQuestion.question;

    // Create answers list
    const answersWrapper = document.createElement("div");
    const answersList = document.createElement("ul");

    if (hasNumericAnswer) {
        const numericInput = document.createElement("input");
        numericInput.type = "number";
        numericInput.className = "numericAnswerInput";
        numericInput.inputMode = "decimal";
        numericInput.placeholder = "Введите число";
        numericInput.setAttribute("aria-label", "Числовой ответ");

        const submitButton = document.createElement("button");
        submitButton.type = "button";
        submitButton.className = "numericAnswerBtn";
        submitButton.textContent = "Проверить";

        const submitNumericAnswer = () => checkNumericAnswer(numericInput, submitButton, currentQuestion.numericAnswer);
        submitButton.addEventListener("click", submitNumericAnswer);
        numericInput.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                submitNumericAnswer();
            }
        });

        answersWrapper.className = "numericAnswer";
        answersWrapper.append(numericInput, submitButton);
    } else {
        currentQuestion.answers.forEach(answer => {
            const listItem = document.createElement("li");

            const answerButton = document.createElement("button");
            answerButton.type = "button";
            answerButton.className = "answerBtn";

            // Insert answer as plain text
            answerButton.textContent = answer.text;

            answerButton.addEventListener("click", checkAnswer);

            listItem.appendChild(answerButton);
            answersList.appendChild(listItem);
        });
        answersWrapper.appendChild(answersList);
    }

    // Assemble question
    container.appendChild(questionImageArea);
    container.appendChild(questionText);
    container.appendChild(answersWrapper);

    if (currentQuestion.explanationImg) {
        const explanationButton = document.createElement("button");
        explanationButton.type = "button";
        explanationButton.className = "methodologyBtn";
        explanationButton.textContent = "Методология";
        explanationButton.setAttribute("aria-expanded", "false");

        const explanationPanel = document.createElement("div");
        explanationPanel.className = "explanationPanel";
        explanationPanel.setAttribute("aria-hidden", "true");

        const explanationContent = document.createElement("div");
        explanationContent.className = "explanationContent";

        const explanationImage = document.createElement("img");
        explanationImage.src = currentQuestion.explanationImg;
        explanationImage.alt = "Пошаговое решение задачи";
        explanationImage.addEventListener("click", () => {
            overlayImg.src = explanationImage.src;
            overlayImg.alt = explanationImage.alt;
            overlay.style.display = "flex";
        });
        explanationContent.appendChild(explanationImage);
        explanationPanel.appendChild(explanationContent);

        explanationButton.addEventListener("click", () => {
            const isOpen = !explanationPanel.classList.contains("is-open");
            explanationPanel.classList.toggle("is-open", isOpen);
            explanationButton.classList.toggle("is-open", isOpen);
            explanationButton.setAttribute("aria-expanded", String(isOpen));
            explanationPanel.setAttribute("aria-hidden", String(!isOpen));
        });
        container.appendChild(explanationButton);
        container.appendChild(explanationPanel);
    }

    // Replace previous question
    questionContainer.replaceChildren(container);

    // Open enlarged image
    quizImage.addEventListener("click", () => {
        overlayImg.src = quizImage.src;
        overlay.style.display = "flex";
    });
}

function checkNumericAnswer(input, submitButton, correctAnswer) {
    if (input.disabled || input.value.trim() === "") {
        return;
    }

    const isCorrect = Number(input.value.replace(",", ".")) === correctAnswer;
    input.disabled = true;
    submitButton.disabled = true;
    input.classList.add(isCorrect ? "correctAnswer" : "incorrectAnswer");

    if (isCorrect) {
        recordCorrectAnswer();
    }

    numCurrent += 1;
    nextButton.disabled = false;
    totalSpan.forEach(span => {
        span.textContent = shuffledQuestions.length;
    });
    correctSpan.textContent = numCorrect;
    currentSpan.textContent = numCurrent;
    myBar.style.width = (numCurrent * 100) / shuffledQuestions.length + "%";
}

// Function to check the selected answer and update global variables accordingly
function checkAnswer(e) {
    const correctAnswer = shuffledQuestions[currentQuestionIndex].answers.find(answer => answer.correct === true);
    let correctBtn;

    const answerButtons = document.querySelectorAll(".answerBtn");
    answerButtons.forEach(button => {
        button.disabled = true;

        if (button.textContent === correctAnswer.text) {
            correctBtn = button;
        }
    });

    const selectedButton = e.target;
    const isCorrect = shuffledQuestions[currentQuestionIndex].answers.find(answer => answer.text === selectedButton.textContent).correct;

    if (isCorrect) {
        recordCorrectAnswer();
        selectedButton.style.backgroundColor = "green";
    } else {
        correctBtn.style.backgroundColor = "green";
        selectedButton.style.backgroundColor = "red";
    }

    numCurrent += 1;
    nextButton.disabled = false;
    nextButton.focus()
    totalSpan.forEach(span => {
        span.textContent = shuffledQuestions.length;
    });
    correctSpan.textContent = numCorrect;
    currentSpan.textContent = numCurrent;

    myBar.style.width = (numCurrent * 100) / shuffledQuestions.length + "%";
}

// Function to display the final quiz results
function showResults() {
    document.querySelector(".explanationBtn")?.remove();
    document.querySelector(".methodologyBtn")?.remove();
    questionContainer.hidden = true;
    resultsContainer.hidden = false;
    footer.hidden = true;

    const isAttestation = selectedMode === "attestation";
    resultsContainer.querySelector("p").hidden = isAttestation;
    attestationResults.hidden = !isAttestation;
    if (isAttestation) {
        attestationQuestionsCorrect.textContent = attestationQuestionsCorrectCount;
        attestationTasksCorrect.textContent = attestationTasksCorrectCount;
    }
}

function showMenu() {
    document.querySelector(".explanationBtn")?.remove();
    document.querySelector(".methodologyBtn")?.remove();
    startScreen.hidden = false;
    questionContainer.hidden = true;
    resultsContainer.hidden = true;
    footer.hidden = true;
}

// Add event listener to restart the quiz
restartButton.addEventListener("click", () => {
    startQuiz();
});

menuButton.addEventListener("click", () => {
    showMenu();
});

startButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectedMode = button.dataset.mode;
        startQuiz();
    });
});

// Function to start/restart the quiz
function startQuiz() {
    const sourceData = selectedMode === "tasks" ? taskData : quizData;

    if (sourceData.length === 0) {
        startScreen.hidden = false;
        questionContainer.hidden = true;
        resultsContainer.hidden = true;
        footer.hidden = true;
        alert("Задачи пока не добавлены.");
        return;
    }

    if (selectedMode === "attestation") {
        // 27 случайных теоретических вопросов и 3 случайные задачи.
        shuffledQuestions = [
            ...getRandomItems(quizData, 27),
            ...getRandomItems(taskData, 3),
        ];
        shuffleArray(shuffledQuestions);
    } else {
        shuffledQuestions = [...sourceData];
        shuffleArray(shuffledQuestions);
        if (selectedMode === "random") {
            shuffledQuestions = shuffledQuestions.slice(0, 30);
        }
    }
    currentQuestionIndex = 0;
    numCorrect = 0;
    numCurrent = 0;
    attestationQuestionsCorrectCount = 0;
    attestationTasksCorrectCount = 0;
    startScreen.hidden = true;
    questionContainer.hidden = false;
    resultsContainer.hidden = true;
    footer.hidden = false;
    totalSpan.forEach(span => {
        span.textContent = shuffledQuestions.length;
    });
    correctSpan.textContent = numCorrect;
    currentSpan.textContent = numCurrent;
    myBar.style.width = "0%";
    showQuestion();
}

// Add event listener to close the overlay
overlay.addEventListener("click", () => {
    overlay.style.display = "none";
});
