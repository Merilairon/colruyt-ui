import { describe, it, expect } from 'vitest';
import { slugify } from './slugify';

describe('slugify', () => {
	it('converts a simple string to a slug', () => {
		expect(slugify('Hello World')).toBe('hello-world');
	});

	it('lowercases uppercase characters', () => {
		expect(slugify('HELLO')).toBe('hello');
	});

	it('replaces spaces with hyphens', () => {
		expect(slugify('foo bar baz')).toBe('foo-bar-baz');
	});

	it('replaces special characters with hyphens', () => {
		expect(slugify('foo@bar!baz')).toBe('foo-bar-baz');
	});

	it('collapses multiple consecutive non-alphanumeric chars into a single hyphen', () => {
		expect(slugify('foo  --  bar')).toBe('foo-bar');
	});

	it('strips leading hyphens', () => {
		expect(slugify('  hello')).toBe('hello');
	});

	it('strips trailing hyphens', () => {
		expect(slugify('hello  ')).toBe('hello');
	});

	it('handles strings with numbers', () => {
		expect(slugify('Product 42')).toBe('product-42');
	});

	it('preserves underscores', () => {
		expect(slugify('foo_bar')).toBe('foo_bar');
	});

	it('handles an already slugified string', () => {
		expect(slugify('already-a-slug')).toBe('already-a-slug');
	});

	it('handles accented characters by stripping them (trailing separators are removed)', () => {
		// 'é' is non-ASCII so it becomes '-', but the trailing '-' is then stripped
		expect(slugify('café')).toBe('caf');
	});

	it('handles an empty string', () => {
		expect(slugify('')).toBe('');
	});

	it('converts a number passed as a string', () => {
		expect(slugify('123')).toBe('123');
	});

	it('handles strings that are only special characters', () => {
		expect(slugify('!@#$%')).toBe('');
	});
});
