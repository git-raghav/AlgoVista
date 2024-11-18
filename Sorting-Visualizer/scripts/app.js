"use strict";
const HEIGHT_SCALING_FACTOR = 480;
const start = async () => {
	let algoValue = Number(document.querySelector(".algo-menu").value);
	let speedValue = Number(document.querySelector(".speed-menu").value);

	if (speedValue === 0) {
		speedValue = 1;
	}
	if (algoValue === 0) {
		alert("No Algorithm Selected");
		return;
	}

	let algorithm = new sortAlgorithms(speedValue);
	if (algoValue === 1) await algorithm.BubbleSort();
	if (algoValue === 2) await algorithm.SelectionSort();
	if (algoValue === 3) await algorithm.InsertionSort();
	if (algoValue === 4) await algorithm.MergeSort();
	if (algoValue === 5) await algorithm.QuickSort();
};

const RenderScreen = async () => {
	let algoValue = Number(document.querySelector(".algo-menu").value);
	await RenderList();
};

const RenderList = async () => {
	let sizeValue = Number(document.querySelector(".size-menu").value);
	await clearScreen();

	let list = await randomList(sizeValue);
	const arrayNode = document.querySelector(".array");
	console.log(arrayNode);
	console.log(list);
	for (const element of list) {
		const node = document.createElement("div");
		node.className = "cell";
		node.setAttribute("value", String(element));
		node.style.height = `${3.8 * element}px`;
        node.innerText = element;
		arrayNode.appendChild(node);
	}
};

const RenderArray = async (sorted) => {
	let sizeValue = Number(document.querySelector(".size-menu").value);
	await clearScreen();

	let list = await randomList(sizeValue);
	if (sorted) list.sort((a, b) => a - b);

	const arrayNode = document.querySelector(".array");
	const divnode = document.createElement("div");
	divnode.className = "s-array";

	for (const element of list) {
		const dnode = document.createElement("div");
		dnode.className = "s-cell";
		dnode.innerText = element;
		divnode.appendChild(dnode);
	}
	arrayNode.appendChild(divnode);
};

const randomList = async (Length) => {
	let list = new Array();
	let lowerBound = 1;
	let upperBound = 100;

	for (let counter = 0; counter < Length; ++counter) {
		let randomNumber = Math.floor(Math.random() * (upperBound - lowerBound + 1) + lowerBound);
		list.push(parseInt(randomNumber));
	}
	return list;
};

const clearScreen = async () => {
	document.querySelector(".array").innerHTML = "";
};

const response = () => {
	let Navbar = document.querySelector(".navbar");
	if (Navbar.className === "navbar") {
		Navbar.className += " responsive";
	} else {
		Navbar.className = "navbar";
	}
};

const handleCustomArray = async () => {
    const input = document.getElementById("custom-array-input").value;
    const values = input.split(",").map((v) => parseInt(v.trim()));

    // Validate input: Check for NaN and ensure all values are numbers
    if (values.some((v) => isNaN(v))) {
        alert("Please enter a valid comma-separated list of numbers.");
        return;
    }

    // Clear existing bars and render new ones
    await clearScreen();

    const arrayNode = document.querySelector(".array");
    const maxHeight = 440;
    const maxValue = Math.max(...values);

    for (const element of values) {
        const node = document.createElement("div");
        node.className = "cell";
        node.setAttribute("value", String(element));

        // Use the global scaling factor for consistency
        const barHeight = (element / maxValue) * HEIGHT_SCALING_FACTOR;
        node.style.height = `${barHeight}px`;
        node.innerText = element; // Display value inside the bar
        arrayNode.appendChild(node);
    }
};

const toggleCustomArrayVisibility = () => {
    const customArrayContainer = document.querySelector(".custom-array-container");
    if (customArrayContainer.classList.contains("visible")) {
        customArrayContainer.classList.remove("visible"); // Hide the container
    } else {
        customArrayContainer.classList.add("visible"); // Show the container
    }
};

document.querySelector(".icon").addEventListener("click", response);
document.querySelector(".start").addEventListener("click", start);
document.querySelector(".size-menu").addEventListener("change", RenderScreen);
document.querySelector(".algo-menu").addEventListener("change", RenderScreen);
document.getElementById("custom-array-submit").addEventListener("click", handleCustomArray);
document.getElementById("custom-array-link").addEventListener("click", toggleCustomArrayVisibility);
window.onload = RenderScreen;
