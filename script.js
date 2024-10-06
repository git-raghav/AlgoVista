const toggle = document.getElementById("theme-toggle");
const body = document.body;

document.addEventListener("DOMContentLoaded", function () {
	// After 3 seconds, hide the logo and text, and show the landing page
	setTimeout(function () {
		document.getElementById("logo-container").classList.add("hide-logo");
		document.getElementById("landing-page").style.visibility = "visible";
	}, 3000);
});

toggle.addEventListener("change", () => {
	if (toggle.checked) {
		body.classList.add("light-theme");
	} else {
		body.classList.remove("light-theme");
	}
});
