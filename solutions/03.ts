import { loadData, product } from '../utils';
import * as _ from 'lodash';

const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

interface Point {
	x: number;
	y: number;
}
interface Square {
	id: number;
	position: Point;
	size: Point;
}

const uniqId = (x: number, y: number) => `${x}x${y}`;

const uniqPoints = (s: Square): string[] => {
	const points: string[] = [];
	for (let i = s.position.x; i < s.position.x + s.size.x; i++) {
		for (let j = s.position.y; j < s.position.y + s.size.y; j++) {
			points.push(uniqId(i, j));
		}
	}
	return points;
}

// #id @ X,Y: XxY
const getData = (data: string): Square[] => {
	return data.split(/\n+/).map(r => {
		const matches = r.match(/#(\d+)\s+@\s+(\d+),(\d+):\s+(\d+)x(\d+)/);
		return !matches ? <Square>{} : <Square>{
			id: +matches[1],
			position: { x: +matches[2], y: +matches[3] },
			size: { x: +matches[4], y: +matches[5] },
		};
	});
};

const getAllOverlapping = (data: Square[]): string[] => {
	const foundPoints: {[id: string]: boolean} = {};
	const uniqOverlapping: {[id: string]: boolean} = {};

	data.forEach((d: Square) => {
		const points = uniqPoints(d);
		points.forEach(p => {
			if (foundPoints[p]) {
				uniqOverlapping[p] = true;
			}
		});
		points.forEach(p => foundPoints[p] = true);
	});

	return _.keys(uniqOverlapping);
};

const part1 = (data: Square[]): number => {
	return _.values(getAllOverlapping(data)).length;
};

const part2 = (data: Square[]): number => {
	const overlapping = getAllOverlapping(data);
	const nonOverlapping = data.find(d => {
		const points = uniqPoints(d);
		return _.intersection(points, overlapping).length === 0;
	});

	return nonOverlapping ? nonOverlapping.id : 0;
};

const solve = (data: string) => {
	let rows = getData(data);
	console.log('Part1: ', part1(rows));
	console.log('Part2: ', part2(rows));
}

loadData(3, solve);
