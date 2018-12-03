import * as fs from 'fs';
import './extensions';

export function flatten<T>(list: T[][]): T[] {
	return list.reduce((all, current) => all.concat(current));
}

export function generateN(amount: number): number[] {
	return Array.from(new Array(amount).keys());
}

export function objectValues<T>(object: { [index: number]: T }): T[] {
	return Object.keys(object).map(k => object[k as any]);
}

export function loadData(day: number, callback: Function): void {
	const filename = `solutions/data/${day}.dat`;
	fs.readFile(filename, (error, data) => {
		if (!error) {
			callback(data.toString());
		}
	});
}
