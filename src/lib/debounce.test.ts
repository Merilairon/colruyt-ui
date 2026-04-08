import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from './debounce';

describe('debounce', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('calls the callback after the specified wait time', () => {
		const callback = vi.fn();
		const debounced = debounce(callback, 300);

		debounced();
		expect(callback).not.toHaveBeenCalled();

		vi.advanceTimersByTime(300);
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('does not call the callback before the wait time elapses', () => {
		const callback = vi.fn();
		const debounced = debounce(callback, 500);

		debounced();
		vi.advanceTimersByTime(499);
		expect(callback).not.toHaveBeenCalled();
	});

	it('only calls the callback once when invoked multiple times within the wait window', () => {
		const callback = vi.fn();
		const debounced = debounce(callback, 300);

		debounced();
		debounced();
		debounced();
		vi.advanceTimersByTime(300);
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('resets the timer on each subsequent call', () => {
		const callback = vi.fn();
		const debounced = debounce(callback, 300);

		debounced();
		vi.advanceTimersByTime(200);
		debounced();
		vi.advanceTimersByTime(200);
		expect(callback).not.toHaveBeenCalled();

		vi.advanceTimersByTime(100);
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('passes the arguments to the callback', () => {
		const callback = vi.fn();
		const debounced = debounce(callback, 300);

		debounced('hello', 42);
		vi.advanceTimersByTime(300);
		expect(callback).toHaveBeenCalledWith('hello', 42);
	});

	it('uses the last set of arguments when called multiple times', () => {
		const callback = vi.fn();
		const debounced = debounce(callback, 300);

		debounced('first');
		debounced('second');
		debounced('third');
		vi.advanceTimersByTime(300);
		expect(callback).toHaveBeenCalledWith('third');
	});

	it('uses default wait of 300ms when no wait is specified', () => {
		const callback = vi.fn();
		const debounced = debounce(callback);

		debounced();
		vi.advanceTimersByTime(299);
		expect(callback).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1);
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('can be called again after the first debounced call fires', () => {
		const callback = vi.fn();
		const debounced = debounce(callback, 300);

		debounced();
		vi.advanceTimersByTime(300);
		expect(callback).toHaveBeenCalledTimes(1);

		debounced();
		vi.advanceTimersByTime(300);
		expect(callback).toHaveBeenCalledTimes(2);
	});
});
