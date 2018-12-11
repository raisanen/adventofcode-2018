import { loadData, repeat } from './include/utils';
import * as _ from 'lodash';

const day = 9;
let numPlayers = 0,
	lastMarble = 0;

class Node {
	value: number;
	next: Node;
	prev: Node;

	constructor(value: number, prev: Node = null, next: Node = null) {
		this.value = value;
		this.next = next;
		this.prev = prev;
	}
}

const getData = (data: string) => {
	const matches = data.match(/(\d+)\D+(\d+)/);
	if (matches) {
		[numPlayers, lastMarble] = matches.skip(1);
	}
};

/**
 * I solved part 1 using an array, but it was WAY
 * too inefficient for part 2, so I changed it to
 * use a linked list instead
 */
const solve = (multiplyBy: number = 1) => {
	lastMarble *= multiplyBy;
	let current = new Node(0), 
		currentMarble = 0,
		currentPlayer = 0,
		scores = repeat(0, numPlayers).toNumbers();

	current.next = current.prev = current;

	const right = (c: Node, n: number): Node => n > 0 ? right(c.next, n - 1) : c;
	const left = (c: Node, n: number): Node => n > 0 ? left(c.prev, n - 1) : c;

	while (currentMarble <= lastMarble) {
		currentMarble++;
		if (currentMarble % 23 !== 0) {
			const next = right(current, 1);
			const nextnext = right(next, 1);
			const newNode = new Node(currentMarble, next, nextnext);
			next.next = nextnext.prev = newNode;
			current = newNode;
		} else {
			let remove = left(current, 7);
			const marbleScore = remove.value;
			scores[currentPlayer] += marbleScore + currentMarble;
			const prev = remove.prev;
			prev.next = remove.next;
			const next = remove.next;
			next.prev = remove.prev;
			current = next;
		}
		currentPlayer = (currentPlayer + 1) % numPlayers;
	}
	return scores.max();
};


// Scaffolding:
loadData(day, (data: string) => {
	getData(data);
	console.log('Part1: ', solve());
	console.log('Part2: ', solve(100));
});
