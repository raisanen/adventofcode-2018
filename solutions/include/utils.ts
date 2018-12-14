import * as fs from 'fs';
import './extensions';

export const alphabet = 'abcdefghijklmnopqrstuvwxyz';
export const alphabetArray = alphabet.splitChars();

export const range = (from: number, to: number, direction: number = 1): number[] => {
	const ret: number[] = [];
	for (let i = from; i <= to; i += direction) {
		ret.push(i);
	}
	return ret;
};

export const repeat = (value: any, times: number): any[] => {
	return range(1, times).map(() => value);
};

export const repeatFunction = (func: () => void, times: number): void => {
	for (let i = 0; i < times; i++) {
		func();
	}
};

export const loadData = (day: number, callback: Function): void => {
	const filename = `solutions/data/${day}.dat`;
	fs.readFile(filename, (error, data) => {
		if (!error) {
			callback(data.toString());
		}
	});
};

class AConsole {
	log(message?: any, ...params: any[]): AConsole {
		console.log(message);
		return this;
	}
	clear(): AConsole {
		console.clear();
		return this;
	}
}

export const aconsole = new AConsole();
