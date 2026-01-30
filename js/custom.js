/***********************
 * USERNAME SYSTEM
 ***********************/
let username = "";

const usernameScreen = document.getElementById("usernameScreen");
const quizContainer = document.getElementById("quiz");

function startQuiz() {
    const input = document.getElementById("usernameInput").value.trim();
    if (!input) {
        alert("Please enter your name");
        return;
    }

    username = input;

    // username শুধু history-এর জন্য save হবে
    localStorage.setItem("quizUsername", username);

    usernameScreen.style.display = "none";
    quizContainer.style.display = "block";

    resetQuiz();
}

/***********************
 * QUIZ DATA
 ***********************/
const quizData = {
    en: [
        { question: "HTML stands for?", a: "Hyper Trainer Marking Language", b: "Hyper Text Markup Language", c: "High Text Markup Language", d: "Hyper Text Marketing Language", correct: "b" },
        { question: "CSS is used for?", a: "Data Storage", b: "Website Design", c: "Database", d: "Server", correct: "b" },
        { question: "Which tag is used for JavaScript?", a: "<javascript>", b: "<script>", c: "<js>", d: "<code>", correct: "b" },
        { question: "Which language runs in browser?", a: "Python", b: "Java", c: "C", d: "JavaScript", correct: "d" },
        { question: "HTML is a ___ language?", a: "Programming", b: "Markup", c: "Database", d: "Styling", correct: "b" },
        { question: "CSS ID selector uses?", a: ".", b: "#", c: "*", d: "&", correct: "b" },
        { question: "CSS text color property?", a: "font-color", b: "text-style", c: "color", d: "background", correct: "c" },
        { question: "JavaScript created by?", a: "Google", b: "Microsoft", c: "Netscape", d: "Apple", correct: "c" },
        { question: "HTML link tag?", a: "<link>", b: "<a>", c: "<href>", d: "<url>", correct: "b" },
        { question: "CSS layout property?", a: "display", b: "color", c: "font", d: "border", correct: "a" }
    ],
    bn: [
        { question: "HTML এর পূর্ণরূপ কী?", a: "Hyper Trainer Marking Language", b: "Hyper Text Markup Language", c: "High Text Markup Language", d: "Hyper Text Marketing Language", correct: "b" },
        { question: "CSS কী কাজে ব্যবহৃত হয়?", a: "ডাটা সংরক্ষণ", b: "ওয়েবসাইট ডিজাইন", c: "ডাটাবেজ", d: "সার্ভার", correct: "b" },
        { question: "JavaScript এর ট্যাগ?", a: "<javascript>", b: "<script>", c: "<js>", d: "<code>", correct: "b" },
        { question: "ব্রাউজারে কোন ভাষা চলে?", a: "Python", b: "Java", c: "C", d: "JavaScript", correct: "d" },
        { question: "HTML কোন ধরনের ভাষা?", a: "প্রোগ্রামিং", b: "মার্কআপ", c: "ডাটাবেজ", d: "স্টাইলিং", correct: "b" },
        { question: "CSS ID selector কোনটি?", a: ".", b: "#", c: "*", d: "&", correct: "b" },
        { question: "CSS লেখার রং পরিবর্তন হয়?", a: "font-color", b: "text-style", c: "color", d: "background", correct: "c" },
        { question: "JavaScript তৈরি করেছে?", a: "Google", b: "Microsoft", c: "Netscape", d: "Apple", correct: "c" },
        { question: "HTML লিংক ট্যাগ?", a: "<link>", b: "<a>", c: "<href>", d: "<url>", correct: "b" },
        { question: "CSS layout property?", a: "display", b: "color", c: "font", d: "border", correct: "a" }
    ]
};

/***********************
 * QUIZ LOGIC
 ***********************/
let language = "en";
let currentQuiz = 0;
let score = 0;
let time = 30;
let timer;

const questionEl = document.getElementById("question");
const answersEls = document.querySelectorAll("input[name='answer']");
const timeEl = document.getElementById("time");
const progressBar = document.getElementById("progressBar");

function resetQuiz() {
    currentQuiz = 0;
    score = 0;
    progressBar.style.width = "0%";
    loadQuiz();
    startTimer();
}

function loadQuiz() {
    answersEls.forEach(el => el.checked = false);

    time = 30;
    timeEl.innerText = time;

    const q = quizData[language][currentQuiz];
    questionEl.innerText = q.question;

    ["a", "b", "c", "d"].forEach(id => {
        document.getElementById(id + "_text").innerText = q[id];
    });

    progressBar.style.width =
        ((currentQuiz + 1) / quizData[language].length) * 100 + "%";
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        time--;
        timeEl.innerText = time;
        if (time <= 0) nextQuestion(true);
    }, 1000);
}

function getAnswer() {
    let answer = null;
    answersEls.forEach(el => {
        if (el.checked) answer = el.value;
    });
    return answer;
}

function nextQuestion(timeout = false) {
    clearInterval(timer);

    const selected = getAnswer();
    if (!selected && !timeout) {
        alert("Please select an answer");
        startTimer();
        return;
    }

    if (selected === quizData[language][currentQuiz].correct) score++;

    currentQuiz++;
    currentQuiz < quizData[language].length
        ? (loadQuiz(), startTimer())
        : showResult();
}

document.getElementById("submit").onclick = () => nextQuestion();

document.getElementById("langToggle").onclick = () => {
    language = language === "en" ? "bn" : "en";
    loadQuiz();
};

/***********************
 * RESULT + HISTORY
 ***********************/
function showResult() {
    const total = quizData[language].length;
    const percent = (score / total) * 100;
    const grade = percent >= 80 ? "A+" : percent >= 60 ? "B" : "F";

    saveHistory(score, total, grade);

    quizContainer.innerHTML = `
        <h2>🏆 Result</h2>
        <p>👤 ${username}</p>
        <p>Score: ${score}/${total}</p>
        <h3>Grade: ${grade}</h3>
        ${renderHistory()}
        <button onclick="location.reload()">Restart</button>
        <button onclick="clearHistory()">Clear History</button>
    `;
}

function saveHistory(score, total, grade) {
    const history = JSON.parse(localStorage.getItem("quizHistory")) || [];
    history.push({
        name: username,
        date: new Date().toLocaleString(),
        score: `${score}/${total}`,
        grade
    });
    localStorage.setItem("quizHistory", JSON.stringify(history));
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem("quizHistory")) || [];
    if (!history.length) return "<p>No history</p>";

    return `<ul class="history">
        ${history.slice(-5).reverse().map(h =>
            `<li>👤 ${h.name}<br>📅 ${h.date}<br>🎯 ${h.score} | ${h.grade}</li>`
        ).join("")}
    </ul>`;
}

function clearHistory() {
    localStorage.removeItem("quizHistory");
    location.reload();
}
