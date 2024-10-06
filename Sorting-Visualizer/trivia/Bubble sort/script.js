const quizData = [
	{
		question: "What is Bubble Sort?",
		options: [
			"A comparison-based sorting algorithm",
			"A non-comparison-based sorting algorithm",
			"A divide and conquer sorting algorithm",
			"A dynamic programming-based sorting algorithm",
		],
		answer: "A comparison-based sorting algorithm",
	},
	{
		question: "What is the worst-case time complexity of Bubble Sort?",
		options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
		answer: "O(n^2)",
	},
	{
		question: "What is the best-case time complexity of Bubble Sort?",
		options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
		answer: "O(n)",
	},
	{
		question: "What is the average time complexity of Bubble Sort?",
		options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
		answer: "O(n^2)",
	},
	{
		question: "Which of the following is true about Bubble Sort?",
		options: ["It is stable", "It is not stable", "It is always optimal", "It cannot handle duplicate elements"],
		answer: "It is stable",
	},
	{
		question: "When is the best-case scenario for Bubble Sort achieved?",
		options: [
			"When the array is already sorted",
			"When the array is sorted in reverse order",
			"When the array contains all distinct elements",
			"When the array contains no elements",
		],
		answer: "When the array is already sorted",
	},
	{
		question: "Which of the following can improve Bubble Sort's performance?",
		options: [
			"Swapping elements only when necessary",
			"Using a stack instead of an array",
			"Sorting only odd-numbered indices",
			"Reversing the array before sorting",
		],
		answer: "Swapping elements only when necessary",
	},
	{
		question: "Which of these is a characteristic of Bubble Sort?",
		options: ["In-place sorting", "Out-of-place sorting", "Requires extra space for another array", "Divide and conquer approach"],
		answer: "In-place sorting",
	},
	{
		question: "How does Bubble Sort work?",
		options: [
			"By repeatedly swapping adjacent elements if they are in the wrong order",
			"By dividing the array into smaller subarrays and sorting each",
			"By inserting elements into their correct positions",
			"By selecting the minimum element and placing it in the first position",
		],
		answer: "By repeatedly swapping adjacent elements if they are in the wrong order",
	},
	{
		question: "Is Bubble Sort an adaptive algorithm?",
		options: [
			"Yes, it adapts by stopping early when the array is already sorted",
			"No, it always runs in the worst-case time complexity",
			"Yes, but only in the average case",
			"No, it does not adapt to the input",
		],
		answer: "Yes, it adapts by stopping early when the array is already sorted",
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
