import { loadData, range, aconsole } from './include/utils';
import * as _ from 'lodash';

const day = 10;

interface Point {
	x: number;
	y: number;
	deltaX: number;
	deltaY: number;
}
const rex = /position=<([-]?\s*\d+),\s+([-]?\d+)>\s+velocity=<\s*([-]?\d+),\s+([-]?\d+)>/;
let points: Point[] = [],
	midX: number = 0,
	midY: number = 0;

const getData = (data: string) => {
	points = data.splitLines().map(l => {
		const matches = l.match(rex);
		if (matches) {
			const [m, x, y, deltaX, deltaY] = matches.toNumbers();
			return <Point>{
				x: x,
				y: y,
				deltaX: deltaX,
				deltaY: deltaY
			};
		}
		return null;
	});
	midX = Math.ceil((points.minBy(p => p.x) + points.maxBy(p => p.x)) / 2);
	midY = Math.ceil((points.minBy(p => p.y) + points.maxBy(p => p.y)) / 2);
};

const solve = (timeout: number = 100, limit = 20000) => {
	let steps = 0, size = 35, seconds = 0;
	const tick = () => {
		const lines = range(midY - size, midY + size).map(y => {
					return range(midX - size, midX + size).map(x => {
						if (points.findIndex(p => p.x === x && p.y === y) >= 0) {
							return 'x';
						} else {
							return ' ';
						}
					}).join('');
				}).join('\n'),
			matches = lines.match(/x/g),
			numDrawn = matches ? matches.length : 0,
			anyDrawn = !!numDrawn;

		points = points.map(p => ({
			...p,
			x: p.x + (p.deltaX * (anyDrawn ? 1 : 20)),
			y: p.y + (p.deltaY * (anyDrawn ? 1 : 20))
		}));
		seconds += (anyDrawn ? 1 : 20); 

		if (anyDrawn) {
			aconsole.clear().log(lines).log('Seconds: ' + seconds);

			if (steps++ < limit) {
				setTimeout(tick, timeout * (numDrawn > 100 ? 4 : 1));
			}
		} else {
			tick();
		}
	};
	tick();
};

// Scaffolding:
loadData(day, (data: string) => {
	getData(data);
	solve();
});
