"use strict";
class Helper {
	constructor(time, list = []) {
		this.time = parseInt(400 / time);
		this.list = list;
	}

	mark = async (index) => {
		this.list[index].setAttribute("class", "cell current");
	};

	markSpl = async (index) => {
		this.list[index].setAttribute("class", "cell min");
	};

	unmark = async (index) => {
		this.list[index].setAttribute("class", "cell");
	};

	pause = async () => {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, this.time);
		});
	};

	compare = async (index1, index2) => {
		await this.pause();
		let value1 = Number(this.list[index1].getAttribute("value"));
		let value2 = Number(this.list[index2].getAttribute("value"));
		if (value1 > value2) {
			return true;
		}
		return false;
	};

	swap = async (index1, index2) => {
		await this.pause();
		let value1 = this.list[index1].getAttribute("value");
		let value2 = this.list[index2].getAttribute("value");

        const maxValue = Math.max(...Array.from(this.list).map(bar => Number(bar.getAttribute("value")))); // Dynamically find maxValue

		this.list[index1].setAttribute("value", value2);
		// this.list[index1].style.height = `${3.8*value2}px`;
		// this.list[index1].style.height = `${(value2 / 100) * HEIGHT_SCALING_FACTOR}px`;
        this.list[index1].style.height = `${(value2 / maxValue) * HEIGHT_SCALING_FACTOR}px`; // Use dynamic maxValue
		this.list[index1].innerText = value2; // Update displayed value

		this.list[index2].setAttribute("value", value1);
		// this.list[index2].style.height = `${3.8*value1}px`;
		// this.list[index2].style.height = `${(value1 / 100) * HEIGHT_SCALING_FACTOR}px`;
        this.list[index2].style.height = `${(value1 / maxValue) * HEIGHT_SCALING_FACTOR}px`; // Use dynamic maxValue
		this.list[index2].innerText = value1; // Update displayed value
	};
}
