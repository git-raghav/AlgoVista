const quizData = [
	{
		question: "What is BFS used for?",
		options: ["Shortest Path", "Maximum Flow", "Traversal of a Graph", "All of the Above"],
		answer: "Traversal of a Graph",
	},
	{
		question: "BFS uses which data structure?",
		options: ["Queue", "Stack", "Priority Queue", "Heap"],
		answer: "Queue",
	},
	{
		question: "BFS explores nodes in what order?",
		options: ["Random", "Depth-first", "Breadth-first", "None"],
		answer: "Breadth-first",
	},
	{
		question: "BFS is optimal for unweighted graphs.",
		options: ["True", "False"],
		answer: "True",
	},
	{
		question: "Which of these is NOT an application of BFS?",
		options: ["Cycle Detection", "Finding Shortest Paths in Unweighted Graphs", "Sorting", "Traversal of Graphs"],
		answer: "Sorting",
	},
	{
		question: "What is the time complexity of BFS?",
		options: ["O(V + E)", "O(V^2)", "O(E log V)", "O(V)"],
		answer: "O(V + E)",
	},
	{
		question: "Which algorithm is BFS most commonly compared to?",
		options: ["A*", "DFS", "Dijkstra's", "Bellman-Ford"],
		answer: "DFS",
	},
	{
		question: "BFS is generally implemented using which method?",
		options: ["Iteration", "Recursion", "Divide and Conquer", "None of the Above"],
		answer: "Iteration",
	},
	{
		question: "In a tree, BFS will explore nodes in what order?",
		options: ["Leaf Nodes First", "All Nodes at the Same Depth First", "Random", "None of the Above"],
		answer: "All Nodes at the Same Depth First",
	},
	{
		question: "Which of the following is true about BFS?",
		options: [
			"It finds the shortest path in weighted graphs.",
			"It finds the shortest path in unweighted graphs.",
			"It finds the longest path in weighted graphs.",
			"It cannot find any path.",
		],
		answer: "It finds the shortest path in unweighted graphs.",
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
