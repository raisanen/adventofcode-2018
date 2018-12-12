import { range } from './include/utils';
import { flatten } from 'lodash';

const day = 11;
const SERIAL_NUMBER: number = 42;

const powerLevel = (x: number, y: number): number => {
	const rackId = x + 10;
	let power = (
		((rackId * y) + SERIAL_NUMBER) * rackId
	).toString();
	
	return (
		power.length < 3 
			? 0 
			: parseInt(power.charAt(power.length - 2))
	) - 5;
};

const score = (startX: number, startY: number): number => {
	return range(startY, startY + 3)
		.map(y => range(startX, startX + 3)
			.map(x => powerLevel(x, y)).sum()
	).sum()
};

const part1 = () => {
	let maxScore = 0,
		maxCoords: {x: number, y: number} = null;

	range(1, 298).forEach(y => {
		range(1, 298).forEach(x => {
			const thisScore = score(x, y);
			if (thisScore > maxScore) {
				maxScore = thisScore;
				maxCoords = {x: x, y: y};
			}
			thisScore;
		});
	});
	return [maxCoords, maxScore];
};
const part2 = () => {};

// Scaffolding:
const solve = () => {
	console.log('Part1: ', part1());
	console.log('Part2:', powerLevel(21,61))
};

solve();
