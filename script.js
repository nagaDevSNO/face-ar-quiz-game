// Webcam setup
const video = document.getElementById("video");

navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
    video.srcObject = stream;
});

// Quiz Data
const questions = [
    {
        question: "Is the sky blue?",
        left: "Yes",
        right: "No",
        correct: "left"
    },
    {
        question: "2 + 2 = 5?",
        left: "True",
        right: "False",
        correct: "right"
    },
    {
        question: "Earth is a planet?",
        left: "Yes",
        right: "No",
        correct: "left"
    },
    {
        question: "Is water dry?",
        left: "Yes",
        right: "No",
        correct: "right"
    },
    {
        question: "Is fire cold?",
        left: "Yes",
        right: "No",
        correct: "right"
    },
    {
        question: "5 > 3?",
        left: "True",
        right: "False",
        correct: "left"
    },
    {
        question: "Sun rises in the west?",
        left: "Yes",
        right: "No",
        correct: "right"
    },
    {
        question: "HTML is a programming language?",
        left: "Yes",
        right: "No",
        correct: "right"
    },
    {
        question: "Is JavaScript used for web development?",
        left: "Yes",
        right: "No",
        correct: "left"
    },
    {
        question: "Is 10 less than 2?",
        left: "Yes",
        right: "No",
        correct: "right"
    }
];

let currentQuestion = 0;
let score = 0;
let canAnswer = true;

// UI elements
const questionEl = document.getElementById("question");
const leftEl = document.getElementById("left");
const rightEl = document.getElementById("right");
const scoreEl = document.getElementById("score");

// Load question
function loadQuestion() {
    const q = questions[currentQuestion];
    questionEl.innerText = q.question;
    leftEl.innerText = q.left;
    rightEl.innerText = q.right;
}

loadQuestion();

// Handle answer
function selectAnswer(direction) {
    if (!canAnswer) return;

    canAnswer = false;

    const q = questions[currentQuestion];

    if (direction === q.correct) {
        score++;
        console.log("Correct!");
    } else {
        console.log("Wrong!");
    }

    scoreEl.innerText = "Score: " + score;

    setTimeout(() => {
        currentQuestion++;

        if (currentQuestion < questions.length) {
            loadQuestion();
            canAnswer = true;
        } else {
            questionEl.innerText = "Game Over! Final Score: " + score + "/10";
            leftEl.innerText = "";
            rightEl.innerText = "";
        }
    }, 1000);
}

// MediaPipe setup
const faceMesh = new FaceMesh({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    }
});

faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

let lastDirection = "center";

faceMesh.onResults(results => {
    if (results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];
        const nose = landmarks[1];
        const x = nose.x;

        let direction = "center";

        if (x < 0.4) direction = "left";
        else if (x > 0.6) direction = "right";

        // Trigger only when direction changes
        if (direction !== lastDirection && direction !== "center") {
            selectAnswer(direction);
        }

        lastDirection = direction;
    }
});

// Camera connection
const camera = new Camera(video, {
    onFrame: async () => {
        await faceMesh.send({ image: video });
    },
    width: 640,
    height: 480
});

camera.start();