import { range } from './include/utils';
import { flatten } from 'lodash';

const day = 11;

class Cell {
	static SERIAL_NUMBER: number = 18;
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	get rackId(): number {
		return this.x + 10;
	}

	get powerLevel(): number {
		let power = (
			((this.rackId * this.y) + Cell.SERIAL_NUMBER) * this.rackId
		).toString();
		
		return (power.length < 3 ? 0 : parseInt(power[power.length - 3])) - 5;
	}
}

const cells: Cell[] = flatten(
	range(0, 300)
		.map(y => range(0, 300).map(x => new Cell(x, y)))
);

const part1 = () => {};
const part2 = () => {};

// Scaffolding:
const solve = () => {
	console.log('Part1: ', part1());
	console.log('Part2: ', part2());
};

solve();
