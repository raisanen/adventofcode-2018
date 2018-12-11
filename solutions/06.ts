import { loadData, range } from './include/utils';

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
	range(0, points.length - 1).forEach(k => {
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
	});
	return numAtDistance > 0 ? null : ret;
};

const totalDistance = (points: Point[], p: Point) => points.sumBy(c => manhattan(p, c));

const part1 = (points: Point[]) => {
	const xs = points.mapTo('x'),
		ys = points.mapTo('y'),
		fudge = 1,
		minX = xs.min() - fudge,
		minY = ys.min() - fudge,
		maxX = xs.max() + fudge,
		maxY = ys.max() + fudge;

	range(minY, maxY).forEach(y => {
		range(minX, maxX).forEach(x => {
			const closest = nearestSite(points, { x: x, y: y });
			if (closest) {
				closest.numClose++;
				if (y === minY || y === maxY || x === minX || x === maxX) {
					closest.infinite = true;
				}
			}
		});
	});

	return points.filter(p => !p.infinite).maxBy(p => p.numClose);
};
const part2 = (points: Point[], limit = 32) => {
	const xs = points.mapTo('x'),
		ys = points.mapTo('y');

	return range(ys.min(), ys.max()).map(y => {
		return range(xs.min(), xs.max()).map(x => {
			return (totalDistance(points, {x: x, y: y}) < limit) ? 1 : 0;
		}).sum();
	}).sum();
};


// Scaffolding:
loadData(day, (data: string) => {
	let points = getData(data);
	console.log('Part1: ', part1(points));
	console.log('Part2: ', part2(points, 10000));
});
