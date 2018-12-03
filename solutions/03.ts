import { loadData } from './include/utils';
import * as _ from 'lodash';

interface Square {
	id: number;
	uniqPoints: string[];
}

// #id @ X,Y: XxY
const getData = (data: string): Square[] => {
	const pointsToStrings = (x: number, y: number, w: number, h: number): string[] => {
		return _.flatten(
			_.range(x, x + w)
				.map(currX => _.range(y, y + h).map(currY => `${currX}x${currY}`))
		);
	}

	return data.splitLines().map(r => {
		const matches = r.match(/#(\d+)\s+@\s+(\d+),(\d+):\s+(\d+)x(\d+)/);

		return !matches 
			? {id: 0, uniqPoints: []} 
			: {id: +matches[1], uniqPoints: pointsToStrings(+matches[2], +matches[3], +matches[4], +matches[5])};
	});
};

let overlapping: string[];
const getAllOverlapping = (data: Square[]): string[] => {
	if (!overlapping) {
		const foundPoints: {[id: string]: boolean} = {};
		const uniqOverlapping: {[id: string]: boolean} = {};
	
		data.forEach((d: Square) => {
			const points = d.uniqPoints;
			points.forEach(p => {
				if (foundPoints[p]) {
					uniqOverlapping[p] = true;
				}
			});
			points.forEach(p => foundPoints[p] = true);
		});
		overlapping = _.keys(uniqOverlapping);
	}

	return overlapping;
};

const part1 = (data: Square[]): number => {
	return _.values(getAllOverlapping(data)).length;
};

const part2 = (data: Square[]): number => {
	const overlapping = getAllOverlapping(data);
	const nonOverlapping = data.find(d => {
		const points = d.uniqPoints;
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
