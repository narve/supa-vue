export default class PromiseQueue {
	private builderQueue: (() => Promise<any>)[];
	private activePromise: Promise<any>;

	constructor() {
		this.builderQueue = [];
		this.activePromise = Promise.resolve();
	}

	add(promiseBuilder: () => Promise<any>) {
		this.activePromise.then(() => this.next());
		this.builderQueue.push(promiseBuilder);
	}

	private next() {
		const nextPromise = this.builderQueue.shift();
		if (nextPromise) {
			this.activePromise = nextPromise();
		} else {
			this.activePromise = Promise.resolve();
		}
	}
}