const quizData = [
	{
		question: "What does the A* algorithm guarantee?",
		options: ["Shortest path", "Longest path", "Quickest solution", "Minimum spanning tree"],
		answer: "Shortest path",
	},
	{
		question: "A* algorithm uses which of the following?",
		options: ["Priority Queue", "Stack", "Simple Queue", "Deque"],
		answer: "Priority Queue",
	},
	{
		question: "What is the heuristic function in A* called?",
		options: ["G(n)", "H(n)", "F(n)", "C(n)"],
		answer: "H(n)",
	},
	{
		question: "In A* algorithm, F(n) is defined as:",
		options: ["Cost of the path", "Estimated cost", "Total cost (path + heuristic)", "Depth of the node"],
		answer: "Total cost (path + heuristic)",
	},
	{
		question: "A* is most similar to which other algorithm?",
		options: ["Dijkstra’s", "BFS", "DFS", "Bellman-Ford"],
		answer: "Dijkstra’s",
	},
	{
		question: "When will A* become identical to Dijkstra’s algorithm?",
		options: ["When H(n) = 0", "When G(n) = 0", "When H(n) is large", "When F(n) is negative"],
		answer: "When H(n) = 0",
	},
	{
		question: "A* is complete and optimal when:",
		options: ["The heuristic is admissible", "The graph is fully explored", "There is no negative cycle", "The graph is dense"],
		answer: "The heuristic is admissible",
	},
	{
		question: "What is the time complexity of A*?",
		options: ["O(V)", "O(E log V)", "O(V^2)", "O(E + V)"],
		answer: "O(E log V)",
	},
	{
		question: "A* is widely used in which domain?",
		options: ["Game development", "Operating systems", "Cryptography", "Image processing"],
		answer: "Game development",
	},
	{
		question: "Which problem type does A* solve?",
		options: ["Optimization", "Decision-making", "Search", "Network flow"],
		answer: "Search",
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
