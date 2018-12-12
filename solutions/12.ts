import { loadData } from './include/utils';
import * as _ from 'lodash';

const day = 12;

let flowers: string[] = [],
	startLength = 0;
const rules: {[start: string]: string} = {},
	pad = '....'.splitChars();

const getData = (data: string) => {
	data.splitLines().forEach(l => {
		if (l.startsWith('initial state:')) {
			flowers.push(...(l.replace(/[^#.]/g, '').splitChars()));
			startLength = flowers.length;
		} else if (l.includes('=>')) {
			const [from, to] = l.split(' => ').map(s => s.replace(/\s+/g, ''));
			rules[from] = to;
		}
	});
};

const currScore = () => {
	const diff = (flowers.length - startLength) / 2;
	return flowers.map((f, i) => f === '#' ? i - diff : 0).sum();
}

const solve = () => {
	let lastScore = 0,
		diffs: number[] = [],
		completedGenerations = 0;

	for (let i = 0; i < 500; i++) {
		const score = currScore();
		
		diffs.push(score - lastScore);

		if (i === 20) {
			console.log('Part 1: ', score);
		}

		flowers = [...pad, ...flowers, ...pad];
		const next: string[] = [];
		for (let j = 2; j < flowers.length - 2; j++) {
			next.push(rules[flowers.slice(j-2, j+3).join('')]);
		}
		flowers = next;
		lastScore = score;
		completedGenerations++;
	}
	const avgDiff = diffs.slice(-100).sum() / 100;

	console.log('Part 2: ', currScore() + ((50000000000 - completedGenerations) * avgDiff));
};

// Scaffolding:
loadData(day, (data: string) => {
	getData(data);
	solve();
});
