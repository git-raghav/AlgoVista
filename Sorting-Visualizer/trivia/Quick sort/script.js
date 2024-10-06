const quizData = [
	{
		question: "What is the worst-case time complexity of Quick Sort?",
		options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
		answer: "O(n^2)",
	},
	{
		question: "What is the best-case time complexity of Quick Sort?",
		options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
		answer: "O(n log n)",
	},
	{
		question: "What is the main approach used in Quick Sort?",
		options: ["Divide and Conquer", "Dynamic Programming", "Greedy Algorithm", "Backtracking"],
		answer: "Divide and Conquer",
	},
	{
		question: "What is the average-case time complexity of Quick Sort?",
		options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
		answer: "O(n log n)",
	},
	{
		question: "Which of the following is true about Quick Sort?",
		options: [
			"It is stable",
			"It is not stable",
			"It is a non-comparison-based sorting algorithm",
			"It is only used for small datasets",
		],
		answer: "It is not stable",
	},
	{
		question: "When does Quick Sort perform the worst?",
		options: [
			"When the array is already sorted",
			"When the array is sorted in reverse order",
			"When all elements are the same",
			"When the pivot is always chosen as the largest or smallest element",
		],
		answer: "When the pivot is always chosen as the largest or smallest element",
	},
	{
		question: "How does Quick Sort choose a pivot?",
		options: [
			"The first element in the array",
			"The last element in the array",
			"A random element or a middle element",
			"It doesn't choose a pivot",
		],
		answer: "A random element or a middle element",
	},
	{
		question: "What is the space complexity of Quick Sort?",
		options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"],
		answer: "O(log n)",
	},
	{
		question: "Which sorting algorithm is generally faster on average: Quick Sort or Merge Sort?",
		options: ["Quick Sort", "Merge Sort", "They are equally fast", "It depends on the dataset size"],
		answer: "Quick Sort",
	},
	{
		question: "Which of the following techniques can be used to improve the performance of Quick Sort?",
		options: [
			"Choosing the pivot randomly",
			"Always choosing the last element as the pivot",
			"Increasing the recursion depth",
			"Using a heap data structure",
		],
		answer: "Choosing the pivot randomly",
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
