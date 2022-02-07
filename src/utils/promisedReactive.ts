import { onUnmounted, reactive, readonly, watchEffect } from 'vue';
import PromiseQueue from './PromiseQueue';

export interface PromisedReactive<T> {
	value: T;
	loading: boolean;
	error: Error | null;
}

export function promisedReactive<T>(defaultValue: T, cb: () => Promise<T>): PromisedReactive<T> {
	const promiseQueue = new PromiseQueue();
	const initialValue = reactive({
		value: defaultValue,
		loading: true,
		error: null
	}) as PromisedReactive<T>;
	let watchers = [] as (() => void)[];

	promiseQueue.add(() =>
		cb()
			.then(
				successValue => {
					initialValue.error = null;
					initialValue.value = successValue;
				},
				(error) => {
					initialValue.error = error;
				}
			)
			.then(() => {
				initialValue.loading = false;
			})
	);

	return initialValue;
}
