import * as fs from 'fs';

export function sum(list: number[]): number {
	return list.reduce((sum, current) => sum + current, 0);
}

export function flatten<T>(list: T[][]): T[] {
	return list.reduce((all, current) => all.concat(current));
}

export function generateN(amount: number): number[] {
	return Array.from(new Array(amount).keys());
}

export function objectValues<T>(object: { [index: number]: T }): T[] {
	return Object.keys(object).map(k => object[k as any]);
}

export function split(input: string, separator = "\n"): string[] {
	return input.split(separator);
}

export function toNumbers(input: string[]): number[] {
	return input.map(s => parseInt(s));
}

export function product(arr: number[]): number {
	return arr.reduce((p, c) => p * c, 1);
}

export function loadData(day: number, callback: Function): void {
	const filename = `solutions/data/${day}.dat`;
	fs.readFile(filename, (error, data) => {
		if (!error) {
			callback(data.toString());
		}
	});
}