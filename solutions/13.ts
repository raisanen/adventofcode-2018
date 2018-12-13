import { loadData } from './include/utils';
import * as _ from 'lodash';
import uuid = require('uuid');

const day = 13;

enum TrackPart {
	Slash = '/',
	Backslash = '\\',
	Intersection = '+',
}
enum Direction {
	Up = '^',
	Right = '>',
	Down = 'v',
	Left = '<',
}
enum Turn {
	Left,
	Straight,
	Right
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

class Cart  {
	id: string;
	position: Point;
	direction: Direction;
	currTurn: Turn = Turn.Left;
	isCrashed = false;

	constructor(position: Point, direction: Direction) {
		this.id = uuid.v4();
		this.position = position;
		this.direction = direction;
	}

	isSame(b: Cart): boolean {
		return this.id === b.id;
	}

	isSimilar(b: Cart): boolean {
		return this.position.isSame(b.position);
	}
}

const directions = [Direction.Up, Direction.Right, Direction.Down, Direction.Left].toStrings();
let grid: string[][] = [];
let carts: Cart[] = [];

const nonCrashed = (): Cart[] => carts.filter(c => !c.isCrashed);

const findCollision = (cart: Cart): Cart => {
	return nonCrashed().find(c => !c.isSame(cart) && c.isSimilar(cart));
};

const transform = (cur: Direction, part: string): Direction => {
	switch (cur) {
		case Direction.Up:    return part === TrackPart.Slash ? Direction.Right : Direction.Left; 
		case Direction.Right: return part === TrackPart.Slash ? Direction.Up    : Direction.Down;
		case Direction.Down:  return part === TrackPart.Slash ? Direction.Left  : Direction.Right;
		case Direction.Left:  return part === TrackPart.Slash ? Direction.Down  : Direction.Up;
	}
}
const doTurn = (cur: Direction, currTurn: Turn): Direction => {
	switch (cur) {
		case Direction.Up:
			return currTurn === Turn.Left
				? Direction.Left
				: (currTurn === Turn.Right ? Direction.Right : cur);
		case Direction.Right:
			return currTurn === Turn.Left
				? Direction.Up
				: (currTurn === Turn.Right ? Direction.Down : cur);
		case Direction.Down:
			return currTurn === Turn.Left
				? Direction.Right
				: (currTurn === Turn.Right ? Direction.Left : cur);
		case Direction.Left:
			return currTurn === Turn.Left
				? Direction.Down
				: (currTurn === Turn.Right ? Direction.Up : cur);
	}
};

const nextTurn = (currTurn: Turn): Turn => {
	switch(currTurn) {
		case Turn.Left:     return Turn.Straight;
		case Turn.Straight: return Turn.Right;
		case Turn.Right:    return Turn.Left;
	}
};

const tick = () => {
	carts = carts.sort((a, b) => a.position.y === b.position.y ? a.position.x - b.position.x : a.position.y - b.position.y);

	const processCarts = nonCrashed();
	if (processCarts.length === 1) {
		const lastCart = processCarts[0];
		console.log('Part 2:', lastCart.position.x, lastCart.position.y);
		return true;
	}
	for (let i = 0; i < processCarts.length; i++) {
		const c = processCarts[i],
			currPoint = grid[c.position.y][c.position.x];

		if (currPoint === TrackPart.Backslash || currPoint === TrackPart.Slash) {
			c.direction = transform(c.direction, currPoint);
		} else if (currPoint === TrackPart.Intersection) {
			c.direction = doTurn(c.direction, c.currTurn);
			c.currTurn = nextTurn(c.currTurn);
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
			if (directions.includes(cell)) {
				carts.push(new Cart(new Point(x, y), <Direction>cell));
			}
		}
	}
};

const solve = () => {
	while (!tick());
};

// Scaffolding:
loadData(day, (data: string) => {
	getData(data);
	solve();
});
