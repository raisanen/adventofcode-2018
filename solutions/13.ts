import { loadData } from './include/utils';
import * as _ from 'lodash';
import uuid = require('uuid');

const day = 13;

enum Direction {
	Up,
	Right,
	Down,
	Left,
}
class Point {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	isSame(b: Point): boolean {
		return this.x === b.x && this.y === b.y;
	}
}

const turns = ['left', 'straight', 'right'];

class Cart  {
	id: string;
	position: Point;
	direction: Direction;
	currTurn = turns[0];
	isCrashed = false;

	constructor(position: Point, direction: Direction) {
		this.id = uuid.v4();
		this.position = position;
		this.direction = direction;
	}
}

let grid: string[][] = [];
let carts: Cart[] = [];

const findCollision = (cart: Cart): Cart => {
	return carts.filter(c => !c.isCrashed).find(c => c.id !== cart.id && c.position.isSame(cart.position));
};

const paint = (): void => {

};

// Up, Right, Down, Left
const transform = (cur: Direction, part: string): Direction => {
	switch (cur) {
		case Direction.Up: return part === '/' ? Direction.Right : Direction.Left; 
		case Direction.Right: return part === '/' ? Direction.Up : Direction.Down;
		case Direction.Down: return part === '/' ? Direction.Left : Direction.Right;
		case Direction.Left: return part === '/' ? Direction.Down : Direction.Up;
	}
}
const doTurn= (cur: Direction, currTurn: string): Direction => {
	switch (cur) {
		case Direction.Up: return currTurn === 'left' ? Direction.Left : (currTurn === 'right' ? Direction.Right : cur);
		case Direction.Right: return currTurn === 'left' ? Direction.Up : (currTurn === 'right' ? Direction.Down : cur);
		case Direction.Down: return currTurn === 'left' ? Direction.Right : (currTurn === 'right' ? Direction.Left : cur);
		case Direction.Left: return currTurn === 'left' ? Direction.Down : (currTurn === 'right' ? Direction.Up : cur);
	}
}

const directions: {[id: string]: Direction} = {
	'^': Direction.Up,
	'>': Direction.Right,
	'v': Direction.Down,
	'<': Direction.Left
};
const directionsToTrackpart: {[id: string]: string} = {
	'^': '|',
	'>': '-',
	'v': '|',
	'<': '-'
};

const tick = () => {
	carts = carts.sort((a, b) => a.position.y === b.position.y ? a.position.x - b.position.x : a.position.y - b.position.y);
	const processCarts = carts.filter(c => !c.isCrashed);
	if (processCarts.length === 1) {
		const lastCart = processCarts[0];
		console.log('Part 2:', lastCart.position.x, lastCart.position.y);
		return true;
	}
	for (let i = 0; i < processCarts.length; i++) {
		const c = processCarts[i],
			currPoint = grid[c.position.y][c.position.x];

		if (currPoint === '\\' || currPoint === '/') {
			c.direction = transform(c.direction, currPoint);
		} else if (currPoint === '+') {
			c.direction = doTurn(c.direction, c.currTurn);
			c.currTurn = turns[(turns.indexOf(c.currTurn) + 1) % turns.length];
		}
		switch (c.direction) {
			case Direction.Up: c.position.y--; break;
			case Direction.Right: c.position.x++; break;
			case Direction.Down: c.position.y++; break;
			case Direction.Left: c.position.x--; break;
		}
		const collidesWith = findCollision(c);
		if (collidesWith) {
			c.isCrashed = collidesWith.isCrashed = true;
			if (processCarts.length === carts.length) {
				console.log('Part 1:', c.position.x, c.position.y);
			}
		}
	}
	return false;
}

const getData = (data: string) => {
	grid = data.splitLines().map(l => l.splitChars());
	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[y].length; x++) {
			const cell = grid[y][x];
			if (cell === '<' || cell === '>' || cell === '^' || cell === 'v') {
				carts.push(new Cart(new Point(x, y), directions[cell]));
				grid[y][x] = directionsToTrackpart[cell];
			}
		}
	}
};

const solve = () => {
	let isDone = false;
	while (!isDone) {
		isDone = tick();
	}
};
const part2 = () => { };


// Scaffolding:
loadData(13, (data: string) => {
	getData(data);
	solve();
});
