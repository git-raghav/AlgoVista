// Runners
class Runner {
	constructor(name) {
		this.name = name;
		this.timer = null;
		this.fixedTimer = null;
		this.finish = null;
		this.count = 0;
		this.__speed = 0; // 0 = Max Speed
		this.onStop = null;
		this.onStart = null;
		this.onFrame = null;
		this.__startTime = null;
		this.__endTime = null;
	}

	recall() {
		this.onFrame ? this.onFrame() : null;
		this.perFrame();
		if (this.finish) {
			this.fixedRecall();
			return;
		}
		this.__speed != null ? (this.timer = setTimeout(() => this.recall(), this.__speed)) : null;
	}

	init() {
		this.finish = false;
		this.onStart ? this.onStart() : null;
		this.firstFrame();

		this.__speed != null ? (this.timer = setTimeout(() => this.recall(), this.__speed)) : null;
		this.__startTime = new Date().getTime();
	}

	fixedRecall() {
		if (!this.count) {
			this.onStop ? this.onStop() : null;
		}
		let i = this.count > states.MAX_FIXED_FRAME_COUNT ? states.MAX_FIXED_FRAME_COUNT : this.count;
		this.fixedTimer = setInterval(() => {
			if (i > 0) {
				this.fixedFrames();
				i--;
			} else {
				clearInterval(this.fixedTimer);
				this.fixedTimer = null;
				this.onStop ? this.onStop() : null;
			}
		}, this.__speed);
	}

	nextStep() {
		if (!this.finish) this.recall();
	}

	resume() {
		this.finish = false;
		this.recall();
	}

	done() {
		this.finish = true;
		this.stop();
	}

	stop() {
		clearTimeout(this.timer);
		this.timer = null;
		this.__endTime = new Date().getTime();
		// this.onStop ? this.onStop() : null;
	}

	firstFrame() {
		throw new Error("need to be implemented");
	}
	perFrame() {
		throw new Error("need to be implemented");
	}
	fixedFrames() {}

	set speed(speed) {
		this.__speed = speed;
	}

	get running() {
		return this.timer != null || this.fixedTimer != null ? true : false;
	}

	get speed() {
		return this.__speed;
	}

	get duration() {
		return this.finish ? this.__endTime - this.__startTime : 0;
	}
}

class NodeSetter extends Runner {
	constructor(name) {
		super(name);
		this.__startNode = null;
		this.__endNode = null;
	}

	setNode(start, end) {
		this.__startNode = start;
		this.__endNode = end;
	}

	get startNode() {
		return this.__startNode;
	}

	get endNode() {
		return this.__endNode;
	}
}
// Depth First Search
class DfsRunner extends NodeSetter {
	constructor() {
		super("Depth First Search");
		this.stack = null;
		this.path = null;
		this.visitedNodes = null;
		this.parent = null;
	}

	mapPath() {
		this.path = [];
		let node = this.endNode;
		while (node.id != this.startNode.id) {
			this.path.push(node);
			node = this.parent.get(node.id);
		}

		this.endNode.changeText(this.path.length);
		this.count = this.path.length;
	}

	firstFrame() {
		this.stack = new Stack();
		this.parent = new Map();
		this.visitedNodes = new Set();
		this.stack.push(this.startNode);
	}

	perFrame() {
		if (this.stack.size > 0) {
			let node = this.stack.pop();
			while (node && this.visitedNodes.has(node)) {
				node = this.stack.pop();
			}
			if (!node) {
				this.done();
				return;
			}

			if (node == this.endNode) {
				this.done();
				this.mapPath();
				return;
			}

			node != this.startNode ? node.setAsTraversed() : null;
			this.visitedNodes.add(node);

			node.adjacents.forEach((r) => {
				if (!this.visitedNodes.has(r)) {
					this.parent.set(r.id, node);
					this.stack.push(r);
				}
			});
		} else {
			this.done();
			this.mapPath();
			return;
		}
	}

	fixedFrames() {
		const n = this.path.pop();
		n.setAsPath();
	}
}

// Breadth First Search
class BfsRunner extends NodeSetter {
	constructor() {
		super("Breadth First Search");
		this.queue = null;
		this.path = null;
		this.parent = null;
	}

	mapPath() {
		this.path = [];
		let node = this.endNode;
		while (node.id != this.startNode.id) {
			this.path.push(node);
			node = this.parent.get(node.id);
		}
		this.endNode.changeText(this.path.length);
		this.count = this.path.length;
	}

	firstFrame() {
		this.queue = new Queue();
		this.parent = new Map();
		this.queue.enqueue(this.startNode);
	}

	perFrame() {
		if (this.queue.size > 0) {
			const node = this.queue.dequeue();
			if (!node) {
				this.done();
				return;
			}

			if (node.id == this.endNode.id) {
				this.done();
				this.mapPath();
				return;
			}

			node.id != this.startNode.id ? node.setAsTraversed() : null;
			node.adjacents.forEach((r) => {
				if (!this.parent.has(r.id)) {
					this.queue.enqueue(r);
					this.parent.set(r.id, node);
				}
			});
		} else {
			this.done();
			this.mapPath();
			return;
		}
	}

	fixedFrames() {
		const n = this.path.pop();
		n.setAsPath();
	}
}

// Dijkstra's Single Source shortest path
class DijkstraRunner extends NodeSetter {
	constructor() {
		super("Dijkstra's Algorithm");
		this.visitedNodes = null;
		this.notVisitedNodes = null;
		this.distance = null;
		this.path = null;
		this.parent = null;
	}

	getMinDistNode() {
		let min = Infinity;
		let min_node = null;
		this.distance.forEach((distance, node) => {
			if (distance < min && !this.visitedNodes.has(node)) {
				min = distance;
				min_node = node;
			}
		});

		return [min, min_node];
	}

	mapPath() {
		this.path = [];

		let node = this.endNode;

		while (node && node != this.startNode) {
			this.path.push(node);
			node = this.parent.get(node.id);
		}
		this.count = this.path.length;
	}

	firstFrame() {
		this.visitedNodes = new Set();
		this.notVisitedNodes = new Set([this.startNode]);
		this.distance = new Map();
		this.distance.set(this.startNode, 0);
		this.parent = new Map();
	}

	perFrame() {
		const [min_dist, min_node] = this.getMinDistNode();
		this.visitedNodes.add(min_node);
		min_node ? min_node.changeText(min_dist) : null;
		if (!min_node) {
			this.done();
			return;
		}
		if (min_node == this.endNode) {
			this.done();
			this.mapPath();
			return;
		}
		this.notVisitedNodes.delete(min_node);
		min_node.adjacents.forEach((n) => this.notVisitedNodes.add(n));

		min_node != this.startNode && min_node != this.endNode ? min_node.setAsTraversed() : null;

		this.notVisitedNodes.forEach((node) => {
			const dist = this.distance.get(node) || Infinity;

			if (!this.visitedNodes.has(node) && dist > min_dist + 1) {
				this.distance.set(node, min_dist + 1);
				this.parent.set(node.id, min_node);
			}
		});
	}

	fixedFrames() {
		const u = this.path.pop();
		u.setAsPath();
	}
}
