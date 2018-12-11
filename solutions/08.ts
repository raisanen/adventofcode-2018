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
	const calcNode = (n: Node): number => {
		return n.meta.sum() + n.children.sumBy(c => calcNode(c));
	};
	return calcNode(root);
};
const part2 = (root: Node) => {
	const calcNode = (n: Node): number => {
		if (n.children.length > 0) {
			return n.meta
				.filter(m => m <= n.children.length)
				.map(m => calcNode(n.children[m - 1]))
				.sum();
		}
		return n.meta.sum();
	};
	return calcNode(root);
};


// Scaffolding:
loadData(day, (data: string) => {
	const root = getData(data);
	console.log('Part1: ', part1(root));
	console.log('Part2: ', part2(root));
});
