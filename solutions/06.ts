import { loadData, range, aconsole } from './include/utils';
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
		return <Point>{ id: String.fromCharCode(char++), x: x, y: y, numClose: 0, infinite: false };
	});
};

const manhattan = (a: Point, b: Point) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const nearestSite = (points: Point[], p: Point): Point => {
	let ret: Point = null;
	let distance = 0, numAtDistance = 0;
	for (let k = 0; k < points.length; k++) {
		const d = manhattan(points[k], p);
		if (k === 0 || d <= distance) {
			if (d === distance) {
				numAtDistance++;
			} else {
				numAtDistance = 0;
			}
			distance = d;
			ret = points[k];
		}
	}
	return numAtDistance > 0 ? null : ret;
};

const totalDistance = (points: Point[], p: Point): number => {
	return points.map(c => manhattan(p, c)).sum();
};

const part1 = (points: Point[]) => {
	const xs = points.map(p => p.x),
		ys = points.map(p => p.y),
		fudge = 1,
		minX = _.min(xs) - fudge,
		minY = _.min(ys) - fudge,
		maxX = _.max(xs) + fudge,
		maxY = _.max(ys) + fudge;

	const plot = range(minY, maxY).map(y => {
		return range(minX, maxX).map(x => {
			const closest = nearestSite(points, { x: x, y: y });
			let isSite = false;
			if (closest) {
				isSite = x === closest.x && y === closest.y;
				closest.numClose++;
				if (y === minY || y === maxY || x === minX || x === maxX) {
					closest.infinite = true;
				}
			}
			return closest ? (isSite ? closest.id : closest.id.toLowerCase()) : '.';
		}).join('')
	}).join('\n');
	aconsole
		.log(points)
		.log('\n')
		.log(plot);
	return points.filter(p => !p.infinite).maxBy(p => p.numClose);
};
const part2 = (points: Point[], limit = 32) => {
	const xs = points.map(p => p.x),
		ys = points.map(p => p.y),
		fudge = 0,
		minX = _.min(xs) - fudge,
		minY = _.min(ys) - fudge,
		maxX = _.max(xs) + fudge,
		maxY = _.max(ys) + fudge;
	let inArea = 0;

	range(minY, maxY).forEach(y => {
		range(minX, maxX).forEach(x => {
			if (totalDistance(points, {x: x, y: y}) < limit) {
				inArea++;
			}
		});
	});
	return inArea;
};


// Scaffolding:
loadData(day, (data: string) => {
	let points = getData(data);
	//console.log('Part1:\n', part1(points));
	console.log('Part2: ', part2(points, 10000));
});
