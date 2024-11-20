const quizData = [
	{
		question: "What does DFS stand for?",
		options: ["Depth First Search", "Direct First Search", "Data First Search", "Double First Search"],
		answer: "Depth First Search",
	},
	{
		question: "DFS uses which data structure?",
		options: ["Stack", "Queue", "Priority Queue", "List"],
		answer: "Stack",
	},
	{
		question: "Which type of traversal is DFS?",
		options: ["Depth-wise", "Level-wise", "In-order", "Pre-order"],
		answer: "Depth-wise",
	},
	{
		question: "DFS is optimal for which type of graph?",
		options: ["Cyclic", "Acyclic", "Unweighted", "Weighted"],
		answer: "Acyclic",
	},
	{
		question: "Which of the following is true for DFS?",
		options: [
			"It explores the shallowest node first",
			"It explores the deepest node first",
			"It always finds the longest path",
			"It is faster than BFS",
		],
		answer: "It explores the deepest node first",
	},
	{
		question: "What is the time complexity of DFS?",
		options: ["O(V)", "O(E)", "O(V+E)", "O(log V)"],
		answer: "O(V+E)",
	},
	{
		question: "DFS can be used to:",
		options: ["Find shortest path", "Detect cycles", "Sort nodes", "Find strongly connected components"],
		answer: "Detect cycles",
	},
	{
		question: "DFS is ideal for solving:",
		options: ["Network traversal", "Puzzle solving", "Pathfinding in mazes", "Sorting algorithms"],
		answer: "Puzzle solving",
	},
	{
		question: "DFS is a variant of which search strategy?",
		options: ["Best-first", "Backtracking", "Forward checking", "Greedy search"],
		answer: "Backtracking",
	},
	{
		question: "DFS can be applied to which type of graphs?",
		options: ["Only connected", "Only directed", "Only undirected", "Any graph"],
		answer: "Any graph",
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
