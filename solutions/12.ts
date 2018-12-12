import { loadData } from './include/utils';
import * as _ from 'lodash';
import { InfiniteTape } from './include/infinite-tape';

const day = 12;

const tape: InfiniteTape<string> = new InfiniteTape<string>(null, '.');
const rules: {[start: string]: string} = {};

const getData = (data: string) => {
	data.splitLines().forEach(l => {
		if (l.startsWith('initial state:')) {
			const chars  = l.replace('initial state: ', '').splitChars().filter(c => c === '.' || c === '#');
			tape.append(...chars);
		} else if (l.includes('=>')) {
			const [from, to] = l.split(' => ');
			rules[from] = to;
		}
	});
	tape.prepend('.', '.', '.').center();
};

const part1 = (data: any) => data;
const part2 = (data: any) => data;


// Scaffolding:
loadData(day, (data: string) => {
	let rows = getData(data);
	console.log('Part1: ', part1(rows));
	console.log('Part2: ', part2(rows));
});
