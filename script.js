const toggle = document.getElementById("theme-toggle");
const body = document.body;

document.addEventListener("DOMContentLoaded", function () {
	// After 3 seconds, hide the logo and show the landing page
	setTimeout(function () {
		document.getElementById("logo-container").classList.add("hide-logo");
		document.getElementById("landing-page").style.display = "block"; // Show the landing page
	}, 3000);

	const cards = document.querySelectorAll(".card");

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("show");
				}
			});
		},
		{ threshold: 0.1 }
	);

	cards.forEach((card) => {
		observer.observe(card);
	});
});

toggle.addEventListener("change", () => {
	if (toggle.checked) {
		body.classList.add("light-theme");
	} else {
		body.classList.remove("light-theme");
	}
});
