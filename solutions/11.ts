import { range } from './include/utils';

const sums = range(0, 300).map(() => range(0,300).map(() => 0));

const powerLevel = (x: number, y: number, serial: number): number => {
	const rackId = x + 10;
	return Math.floor((((rackId * y) + serial) * rackId) / 100) % 10 - 5;
};

/**
 * calcSums & score thanks to https://www.geeksforgeeks.org/submatrix-sum-queries/
 */ 

const calcSums = (serial: number): void => {
	range(1, 300).forEach(y => sums[1][y] = powerLevel(1, y, serial));
	range(1, 300)
		.forEach(y => range(2, 300)
			.forEach(x => {
				sums[x][y] = powerLevel(x, y, serial) + sums[x-1][y];
			})
		);
	range(2, 300)
		.forEach(y => range(1, 300)
			.forEach(x => {
				sums[x][y] += sums[x][y-1];
			})
		);
};

const score = (x: number, y: number, side: number): number => {
	const x1 = x + side - 1,
		y1 = y + side - 1;
	let res = sums[x1][y1];

	if (x1 > 1) {
		res -= sums[x-1][y1];
	}
	if (y1 > 1) {
		res -= sums[x1][y-1];
	}
	if (x > 1 && y > 1) {
		res += sums[x-1][y-1];
	}
	return res;
};

const part1 = () => {
	let maxScore = 0,
		maxCoords: { x: number, y: number } = null;

	range(1, 298).forEach(y => {
		range(1, 298).forEach(x => {
			const thisScore = score(x, y, 3);
			if (thisScore > maxScore) {
				maxScore = thisScore;
				maxCoords = { x: x, y: y };
			}
		});
	});
	return [maxCoords, maxScore];
};

const part2 = () => {
	let maxScore = 0,
		maxCoords: { x: number, y: number, size: number } = null;

	range(1, 300).forEach(y => {
		range(1, 300).forEach(x => {
			range(1, 300 - Math.max(x, y)).forEach(s => {
				const thisScore = score(x, y, s);
				if (thisScore > maxScore) {
					maxScore = thisScore;
					maxCoords = { x: x, y: y, size: s };
				}
			});
		});
	});
	return [maxCoords, maxScore];
};

// Scaffolding:
const solve = () => {
	calcSums(6878);
	// 6878
	console.log('Part1: ', part1());
	console.log('Part1: ', part2());
};

solve();
