import { loadData, product } from './utils';
import * as _ from 'lodash';

const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

const getData = (data: string): string[] => {
	return data.split(/\n+/);
}

const hasTwiceOrThrice = (row: string[]): boolean[] => {
	return [
		_.some(letters, (l) => row.filter((c) => c === l).length === 2 && row.filter((c) => c === l).length !== 3),
		_.some(letters, (l) => row.filter((c) => c === l).length === 3),
	];
};

const numDifferent = (a: string[], b: string[]): number => {
	return a.reduce((p, c, i) => p + (a[i] !== b[i] ? 1 : 0), 0);
};

const part1 = (data: string[][]): number => {
	return product(data.map(hasTwiceOrThrice).reduce((p, c) => [p[0] + (c[0] ? 1 : 0), p[1] + (c[1] ? 1 : 0)], [0, 0]));
};

const part2 = (data: string[][]): string => {
	let result = '';

	for (let i = 0; i < data.length - 1; i++) {
		for (let j = i + 1; j < data.length; j++) {
			if (numDifferent(data[i], data[j]) === 1) {
				return data[i].filter((c, i) => c === data[j][i]).join('');
			}
		}
	}

	return result;
};

const solve = (data: string) => {
	let rows = getData(data).map(r => r.split(''));
	console.log('Part1: ', part1(rows));
	console.log('Part2: ', part2(rows));
}

loadData(2, solve);
