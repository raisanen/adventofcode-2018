import { loadData, alphabetArray } from './include/utils';
import * as _ from 'lodash';

const getData = (data: string): string[] => {
	return data.splitLines();
}

const hasTwiceOrThrice = (row: string[]): boolean[] => {
	return [
		_.some(alphabetArray, (l) => row.filter((c) => c === l).length === 2 && row.filter((c) => c === l).length !== 3),
		_.some(alphabetArray, (l) => row.filter((c) => c === l).length === 3),
	];
};

const numDifferent = (a: string[], b: string[]): number => {
	return a.reduce((p, c, i) => p + (a[i] !== b[i] ? 1 : 0), 0);
};

const part1 = (data: string[][]): number => {
	return data
		.map(hasTwiceOrThrice)
		.reduce((p, c) => [p[0] + (c[0] ? 1 : 0), p[1] + (c[1] ? 1 : 0)], [0, 0])
		.product();
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
	let rows = getData(data).map(r => r.splitChars());
	console.log('Part1: ', part1(rows));
	console.log('Part2: ', part2(rows));
}

loadData(2, solve);
