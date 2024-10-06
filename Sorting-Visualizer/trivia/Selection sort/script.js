const quizData = [
	{
		question: "What is the worst-case time complexity of Selection Sort?",
		options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
		answer: "O(n^2)",
	},
	{
		question: "What is the best-case time complexity of Selection Sort?",
		options: ["O(n)", "O(n log n)", "O(n^2)", "O(1)"],
		answer: "O(n^2)",
	},
	{
		question: "How does Selection Sort work?",
		options: [
			"By selecting the smallest element and swapping it with the first unsorted element",
			"By repeatedly merging sorted subarrays",
			"By swapping adjacent elements",
			"By inserting elements into their correct position in a sorted portion of the array",
		],
		answer: "By selecting the smallest element and swapping it with the first unsorted element",
	},
	{
		question: "What is the average-case time complexity of Selection Sort?",
		options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
		answer: "O(n^2)",
	},
	{
		question: "Which of the following is true about Selection Sort?",
		options: ["It is stable", "It is not stable", "It has a time complexity of O(n log n)", "It does not require any swaps"],
		answer: "It is not stable",
	},
	{
		question: "When is Selection Sort preferable over other sorting algorithms?",
		options: [
			"When the array is already sorted",
			"When the array size is small",
			"When the array contains mostly distinct elements",
			"When the array contains many duplicates",
		],
		answer: "When the array size is small",
	},
	{
		question: "What is the space complexity of Selection Sort?",
		options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"],
		answer: "O(1)",
	},
	{
		question: "Which of the following is a characteristic of Selection Sort?",
		options: [
			"It is an in-place sorting algorithm",
			"It is an out-of-place sorting algorithm",
			"It is a recursive algorithm",
			"It requires an auxiliary array",
		],
		answer: "It is an in-place sorting algorithm",
	},
	{
		question: "In Selection Sort, how many swaps are performed in the worst case?",
		options: ["O(n)", "O(n^2)", "O(1)", "O(n log n)"],
		answer: "O(n)",
	},
	{
		question: "What is the main disadvantage of Selection Sort?",
		options: [
			"It is not suitable for large datasets due to its O(n^2) time complexity",
			"It requires extra space",
			"It is not stable",
			"It cannot handle arrays with negative numbers",
		],
		answer: "It is not suitable for large datasets due to its O(n^2) time complexity",
	},
];

const quizContainer = document.getElementById("quiz-container");
const resultContainer = document.getElementById("result");
const submitBtn = document.getElementById("submit-btn");

// Modal elements
const modal = document.createElement("div");
modal.classList.add("modal");
document.body.appendChild(modal);
modal.innerHTML = `
    <div class="modal-content">
        <h2>Quiz Results</h2>
        <p id="modal-result"></p>
        <p id="modal-incorrect"></p>
        <button class="close-btn">Close</button>
    </div>
`;

const closeModalBtn = modal.querySelector(".close-btn");
const modalResult = modal.querySelector("#modal-result");
const modalIncorrect = modal.querySelector("#modal-incorrect");

// Confetti canvas
const confettiCanvas = document.createElement("canvas");
confettiCanvas.setAttribute("id", "confettiCanvas");
document.body.appendChild(confettiCanvas);
confettiCanvas.style.position = "fixed";
confettiCanvas.style.top = "0";
confettiCanvas.style.left = "0";
confettiCanvas.style.width = "100vw";
confettiCanvas.style.height = "100vh";
confettiCanvas.style.pointerEvents = "none";
confettiCanvas.style.zIndex = "9999";
confettiCanvas.style.display = "none"; // Hidden by default

// Confetti effect
function startConfetti() {
	const confetti = confettiCanvas.getContext("2d");
	confettiCanvas.width = window.innerWidth;
	confettiCanvas.height = window.innerHeight;

	let confettiPieces = Array.from({ length: 100 }).map(() => {
		return {
			x: Math.random() * confettiCanvas.width,
			y: Math.random() * confettiCanvas.height,
			size: Math.random() * 7 + 2,
			speedX: Math.random() * 2 - 1,
			speedY: Math.random() * 3 + 2,
			color: `hsl(${Math.random() * 360}, 100%, 50%)`,
		};
	});

	function renderConfetti() {
		confetti.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
		confettiPieces.forEach((p) => {
			confetti.fillStyle = p.color;
			confetti.fillRect(p.x, p.y, p.size, p.size);
		});
	}

	function updateConfetti() {
		confettiPieces.forEach((p) => {
			p.x += p.speedX;
			p.y += p.speedY;

			if (p.y > confettiCanvas.height) {
				p.y = 0;
				p.x = Math.random() * confettiCanvas.width;
			}
		});
	}

	function loop() {
		renderConfetti();
		updateConfetti();
		requestAnimationFrame(loop);
	}

	loop();
	confettiCanvas.style.display = "block";
	setTimeout(() => {
		confettiCanvas.style.display = "none"; // Hide confetti after 5 seconds
	}, 5000);
}

function loadQuiz() {
	quizData.forEach((quizItem, index) => {
		const questionDiv = document.createElement("div");
		questionDiv.classList.add("quiz-item");
		questionDiv.innerHTML = `
            <p>${index + 1}. ${quizItem.question}</p>
            ${quizItem.options
				.map(
					(option) => `
                <label>
                    <input type="radio" name="question${index}" value="${option}">
                    ${option}
                </label>
            `
				)
				.join("")}
        `;
		quizContainer.appendChild(questionDiv);
	});
}

function calculateScore() {
	let score = 0;
	let incorrectAnswers = [];
	quizData.forEach((quizItem, index) => {
		const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
		if (selectedOption && selectedOption.value.trim().toLowerCase() === quizItem.answer.trim().toLowerCase()) {
			score++;
		} else {
			incorrectAnswers.push(`Q${index + 1}: <span class="correct-answer">Correct Answer is ${quizItem.answer}</span>`);
		}
	});
	return { score, incorrectAnswers };
}

submitBtn.addEventListener("click", () => {
	const { score, incorrectAnswers } = calculateScore();

	// Display score and incorrect answers in the modal
	modalResult.textContent = `You scored ${score}/${quizData.length}`;
	modalIncorrect.innerHTML = incorrectAnswers.length
		? `Incorrect Answers:<br> ${incorrectAnswers.join("<br>")}`
		: "All answers are correct!";

	// Show the modal
	document.body.classList.add("modal-active");

	// Trigger confetti effect for perfect score
	if (score === 10) {
		startConfetti();
	}
});

closeModalBtn.addEventListener("click", () => {
	// Hide the modal and remove blur
	document.body.classList.remove("modal-active");
});

window.addEventListener("click", (event) => {
	// Close modal if user clicks outside of the modal content
	if (event.target === modal) {
		document.body.classList.remove("modal-active");
	}
});

loadQuiz();
