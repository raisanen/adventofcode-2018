import { loadData } from './include/utils';
import * as _ from 'lodash';

class Node {
	children: Node[];
	meta: number[];
}

const day = 8;

const getNode = (d: number[]): Node[] => {
	const numChildren = d.shift(),
		numMeta = d.shift(),
		children: Node[] = [],
		meta: number[] = [];

	for (let i = 0; i < numChildren; i++) {
		children.push(...getNode(d));
	}
	for (let i = 0; i < numMeta; i++) {
		meta.push(d.shift());
	}
	return [<Node>{children: children, meta: meta}];
};


const getData = (data: string) => {
	return getNode(data.split(/\s+/).toNumbers())[0];
};

const part1 = (root: Node) => {
	let checksum = 0;
	const printNode = (n: Node, level = '') => {
		checksum += n.meta.sum();
		console.log(level, n.meta);
		n.children.forEach(c => printNode(c, level + '\t'));
	};
	printNode(root);
	return checksum;
};
const part2 = (data: any) => data;


// Scaffolding:
loadData(day, (data: string) => {
	const root = getData(data);
	console.log('Part1: ', part1(root));
//	console.log('Part2: ', part2(rows));
});
