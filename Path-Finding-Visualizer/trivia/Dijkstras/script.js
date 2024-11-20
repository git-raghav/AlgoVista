const quizData = [
	{
		question: "Which data structure is used in Dijkstra's Algorithm?",
		options: ["Queue", "Priority Queue", "Stack", "Array"],
		answer: "Priority Queue",
	},
	{
		question: "What type of graph does Dijkstra's algorithm work on?",
		options: ["Cyclic", "Acyclic", "Weighted", "Unweighted"],
		answer: "Weighted",
	},
	{
		question: "Which property of Dijkstra's algorithm makes it unsuitable for negative weights?",
		options: ["Greediness", "Optimality", "Relaxation", "Efficiency"],
		answer: "Greediness",
	},
	{
		question: "What is the time complexity of Dijkstra’s algorithm with a priority queue?",
		options: ["O(V^2)", "O(V+E)", "O(E log V)", "O(EV)"],
		answer: "O(E log V)",
	},
	{
		question: "Dijkstra's algorithm is a type of what search algorithm?",
		options: ["Depth-First", "Breadth-First", "Greedy", "A*"],
		answer: "Greedy",
	},
	{
		question: "In Dijkstra's algorithm, how is the next node selected?",
		options: ["Node with the highest cost", "Node with the smallest cost", "Random node", "Any visited node"],
		answer: "Node with the smallest cost",
	},
	{
		question: "What does Dijkstra’s algorithm compute?",
		options: ["Shortest path", "Longest path", "Maximum flow", "Minimum spanning tree"],
		answer: "Shortest path",
	},
	{
		question: "Dijkstra’s algorithm can be terminated early when:",
		options: ["We find the source node", "We reach the target node", "We visit all nodes", "The graph is fully explored"],
		answer: "We reach the target node",
	},
	{
		question: "Which type of graph will make Dijkstra’s algorithm behave like a BFS?",
		options: ["Unweighted", "Fully connected", "Cyclic", "Sparse"],
		answer: "Unweighted",
	},
	{
		question: "Who invented Dijkstra's algorithm?",
		options: ["Edsger W. Dijkstra", "Alan Turing", "Donald Knuth", "John von Neumann"],
		answer: "Edsger W. Dijkstra",
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
		if (selectedOption && selectedOption.value === quizItem.answer) {
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
