import { loadData } from './include/utils';
import * as _ from 'lodash';

interface Point {
	x: number;
	y: number;
}

const day = 6;

const getData = (data: string): Point[] => {
	return data.splitLines().map(l => {
		const [x, y] = l.split(/,\s+/).toNumbers();
		return <Point>{x: y, y: y};
	});
};

const manhattan = (a: Point, b: Point) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const part1 = (data: Point[]) => {
	
};
const part2 = (data: Point[]) => data;


// Scaffolding:
loadData(day, (data: string) => {
	let points = getData(data);
	console.log('Part1: ', part1(points));
	console.log('Part2: ', part2(points));
});
