import { loadData } from './include/utils';
import * as _ from 'lodash';

class Node {
	children: Node[];
	meta: number[];
}

const day = 8;

const parseNode = (nums: number[]): Node => {
	const data = [...nums],
		numChildren = data.shift(),
		numMeta = data.shift(),
		meta = data.slice(-numMeta),
		children: Node[] = [];
	
	data.splice(-numMeta);

	return <Node>{
		children: [],
		meta: meta
	};
}

const getData = (data: string) => {
	return parseNode(data.split(/\s+/).toNumbers());
};

const part1 = (data: any) => data;
const part2 = (data: any) => data;


// Scaffolding:
loadData(day, (data: string) => {
	const root = getData(`2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2`);
	console.log('Part1: ', part1(root));
//	console.log('Part2: ', part2(rows));
});
