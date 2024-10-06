const quizData = [
	{
		question: "What is the worst-case time complexity of Insertion Sort?",
		options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
		answer: "O(n^2)",
	},
	{
		question: "What is the best-case time complexity of Insertion Sort?",
		options: ["O(n)", "O(n log n)", "O(n^2)", "O(1)"],
		answer: "O(n)",
	},
	{
		question: "How does Insertion Sort work?",
		options: [
			"By dividing the array into subarrays and sorting each",
			"By selecting the minimum element and placing it in the first position",
			"By inserting elements into their correct position in a sorted portion of the array",
			"By repeatedly merging sorted subarrays",
		],
		answer: "By inserting elements into their correct position in a sorted portion of the array",
	},
	{
		question: "What is the average-case time complexity of Insertion Sort?",
		options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
		answer: "O(n^2)",
	},
	{
		question: "Which of the following is true about Insertion Sort?",
		options: ["It is stable", "It is not stable", "It cannot handle duplicate elements", "It uses divide and conquer"],
		answer: "It is stable",
	},
	{
		question: "When does Insertion Sort perform the best?",
		options: [
			"When the array is reversed",
			"When the array is already sorted",
			"When all elements are distinct",
			"When the array has a single element",
		],
		answer: "When the array is already sorted",
	},
	{
		question: "What is the space complexity of Insertion Sort?",
		options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"],
		answer: "O(1)",
	},
	{
		question: "What kind of sorting algorithm is Insertion Sort?",
		options: [
			"A comparison-based sorting algorithm",
			"A non-comparison sorting algorithm",
			"A divide and conquer sorting algorithm",
			"A dynamic programming-based sorting algorithm",
		],
		answer: "A comparison-based sorting algorithm",
	},
	{
		question: "Which type of data is Insertion Sort particularly efficient for?",
		options: ["Small datasets", "Large datasets", "Randomly sorted data", "Reversed datasets"],
		answer: "Small datasets",
	},
	{
		question: "Is Insertion Sort an adaptive algorithm?",
		options: [
			"Yes, it adapts by reducing the number of comparisons when the array is nearly sorted",
			"No, it always runs in the worst-case time complexity",
			"Yes, but only in the worst case",
			"No, it does not adapt to the input",
		],
		answer: "Yes, it adapts by reducing the number of comparisons when the array is nearly sorted",
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
