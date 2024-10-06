const quizData = [
	{
		question: "What is the worst-case time complexity of Merge Sort?",
		options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
		answer: "O(n log n)",
	},
	{
		question: "What is the best-case time complexity of Merge Sort?",
		options: ["O(n)", "O(n log n)", "O(n^2)", "O(1)"],
		answer: "O(n log n)",
	},
	{
		question: "What is the main approach used in Merge Sort?",
		options: ["Divide and Conquer", "Dynamic Programming", "Greedy Algorithm", "Backtracking"],
		answer: "Divide and Conquer",
	},
	{
		question: "What is the space complexity of Merge Sort?",
		options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"],
		answer: "O(n)",
	},
	{
		question: "Which of the following is true about Merge Sort?",
		options: ["It is stable", "It is not stable", "It requires O(1) extra space", "It cannot handle large datasets"],
		answer: "It is stable",
	},
	{
		question: "When does Merge Sort perform better than other sorting algorithms like Quick Sort?",
		options: [
			"When the data fits in memory",
			"When the dataset is large and cannot fit in memory",
			"When the dataset is small",
			"When all elements are distinct",
		],
		answer: "When the dataset is large and cannot fit in memory",
	},
	{
		question: "What happens during the merge step in Merge Sort?",
		options: [
			"The array is divided into two halves",
			"The two sorted subarrays are combined into a single sorted array",
			"The array is sorted using a pivot",
			"Elements are compared and swapped",
		],
		answer: "The two sorted subarrays are combined into a single sorted array",
	},
	{
		question: "What is the average-case time complexity of Merge Sort?",
		options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
		answer: "O(n log n)",
	},
	{
		question: "Which of the following is an advantage of Merge Sort?",
		options: [
			"It is an in-place sorting algorithm",
			"It is very efficient for large datasets",
			"It does not require extra memory",
			"It has a worst-case time complexity of O(n^2)",
		],
		answer: "It is very efficient for large datasets",
	},
	{
		question: "Is Merge Sort considered an adaptive algorithm?",
		options: [
			"No, it always runs in O(n log n) time",
			"Yes, it adapts based on the input",
			"Yes, but only for small datasets",
			"No, it adapts only when the data is nearly sorted",
		],
		answer: "No, it always runs in O(n log n) time",
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
