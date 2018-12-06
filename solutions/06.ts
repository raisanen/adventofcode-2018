import { loadData } from './include/utils';
import * as _ from 'lodash';

interface Point {
	id?: string;
	x: number;
	y: number;
	numClose?: number;
	infinite?: boolean;
}

const day = 6;

const getData = (data: string): Point[] => {
	let char = 'A'.codePointAt(0);
	return data.splitLines().map(l => {
		const [x, y] = l.split(/,\s+/).toNumbers();
		return <Point>{ id: String.fromCharCode(char++), x: y, y: y, numClose: 1, infinite: false };
	});
};

const manhattan = (a: Point, b: Point) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const closestPoints = (points: Point[]) => {
	const xs = points.map(p => p.x),
		ys = points.map(p => p.y),
		fudge = 2,
		minX = _.min(xs) - fudge,
		minY = _.min(ys) - fudge,
		maxX = _.max(xs) + fudge,
		maxY = _.max(ys) + fudge;

	let candidates = _.clone(points);

	for (let currY = minY; currY <= maxY; currY++) {
		const points = [];
		for (let currX = minX; currX <= maxX; currX++) {
			let closest: Point = { x: Number.MIN_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER },
				currPoint: Point = { x: currX, y: currY },
				closestDistance = manhattan(currPoint, closest),
				infinite = (currX === minX || currX === maxX || currY === minY || currY === maxY),
				multiple = false;

			for (let p = 0; p < candidates.length; p++) {
				const currDistance = manhattan(candidates[p], currPoint);
				if (currDistance < closestDistance) {
					closest = candidates[p];
					closestDistance = currDistance;
					candidates[p].numClose++;
					candidates[p].infinite = infinite;
				} else if (currDistance === closestDistance) {
					closest = candidates[p];
					multiple = true;
				}
			}
			points.push(multiple ? '.' : closest.id);
		}
		console.log(points.join(''));
	}
	return candidates;
};

const part1 = (data: Point[]) => closestPoints(data);
const part2 = (data: Point[]) => data;


// Scaffolding:
loadData(day, (data: string) => {
	let points = getData(`1, 1
	1, 6
	8, 3
	3, 4
	5, 5
	8, 9`);
	console.log('Part1: ', part1(points));
	// console.log('Part2: ', part2(points));
});
