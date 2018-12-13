import { loadData } from './include/utils';
import * as _ from 'lodash';
import uuid = require('uuid');

const day = 13;

enum Direction {
	Right,
	Down,
	Left,
	Up
}
class Point {
	x: number;
	y: number;
	distance: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.distance = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	}

	isSame(b: Point): boolean {
		return this.x === b.x && this.y === b.y;
	}

	compare(b: Point): number {
		return this.distance - b.distance;
	}
}
class Identifiable {
	id: string;
	constructor() {
		this.id = uuid.v4();
	}
}

class Track extends Identifiable {
	topLeft: Point;
	topRight: Point;
	bottomRight: Point;
	bottomLeft: Point;

	constructor() { super(); }
}
class Cart extends Identifiable {
	position: Point;
	trackId: string;
	direction: Direction;

	constructor(position: Point, trackId: string, direction: Direction) {
		super();
		this.position = position;
		this.trackId = trackId;
		this.direction = direction;
	}
}

const tracks: Track[] = [];
const carts: Cart[] = [];

const findCollision = (): Point => {
	const sortedCarts = carts.sort((a, b) => a.position.compare(b.position));
	for (let i = 0; i < sortedCarts.length - 1; i++) {
		if (sortedCarts[i].position.isSame(sortedCarts[i + 1].position)) {
			return sortedCarts[i].position;
		}
	}
	return null;
};

const paint = (): void => {

};

const tick = (): Point => {
	const collision = findCollision();
	if (collision) {
		return collision;
	}
	// console.log('tick');
	carts.forEach(c => {
		const track = tracks.find(t => t.id === c.trackId);
		if (c.position.isSame(track.topLeft)) {
			if (c.direction === Direction.Up) {
				c.direction = Direction.Right;
			} else if (c.direction === Direction.Left) {
				c.direction = Direction.Down;
			}
		} else if (c.position.isSame(track.topRight)) {
			if (c.direction === Direction.Up) {
				c.direction = Direction.Left;
			} else if (c.direction === Direction.Right) {
				c.direction = Direction.Down;
			}
		} else if (c.position.isSame(track.bottomRight)) {
			if (c.direction === Direction.Down) {
				c.direction = Direction.Left;
			} else if (c.direction === Direction.Right) {
				c.direction = Direction.Up;
			}
		} else if (c.position.isSame(track.bottomLeft)) {
			if (c.direction === Direction.Down) {
				c.direction = Direction.Right;
			} else if (c.direction === Direction.Left) {
				c.direction = Direction.Up;
			}
		}
		switch (c.direction) {
			case Direction.Up: c.position.y--; break;
			case Direction.Right: c.position.x++; break;
			case Direction.Down: c.position.y++; break;
			case Direction.Left: c.position.x--; break;
		}
	});
	return null;
}

const getData = (data: string) => {
	const grid = data.splitLines().map(l => l.splitChars());
	for (let y = 0; y < grid.length - 1; y++) {
		const row = grid[y];
		console.log('Row', y);
		for (let x = 0; x < row.length - 1; x++) {
			if (row[x] === '/' && (row[x + 1] === '-' || row[x + 1] === '+' || row[x + 1] === '>' || row[x + 1] === '<')) {
				const topLeft = new Point(x, y); 
				if (tracks.findIndex(t => t.topLeft.isSame(topLeft)) < 0) {
					const newTrack = new Track();
					let foundCart = false;
					newTrack.topLeft =  topLeft;

					while (row[++x] !== '\\') {
						if (row[x] === '<' || row[x] === '>') {
							foundCart = true;
							carts.push(new Cart(new Point(x, y), newTrack.id, row[x] === '<' ? Direction.Left : Direction.Right));
						}
					}
					newTrack.topRight = new Point(x, y);

					let tempY = y;
					while (grid[++tempY][x] !== '/') {
						const cell = grid[tempY][x];
						if (cell === '^' || cell === 'v') {
							foundCart = true;
							carts.push(new Cart(new Point(x, tempY), newTrack.id, cell === 'v' ? Direction.Down : Direction.Up));
						}
					}

					newTrack.bottomLeft = new Point(x, y);

					let tempX = x;
					while (grid[tempY][--tempX] !== '\\') {
						const cell = grid[tempY][tempX];
						if (cell === '<' || cell === '>') {
							foundCart = true;
							carts.push(new Cart(new Point(tempX, tempY), newTrack.id, cell === '<' ? Direction.Left : Direction.Right));
						}
					}

					newTrack.bottomRight = new Point(tempX, tempY);

					while (grid[--tempY][tempX] !== '/') {
						const cell = grid[tempY][tempX];
						if (cell === '^' || cell === 'v') {
							foundCart = true;
							carts.push(new Cart(new Point(tempX, tempY), newTrack.id, cell === 'v' ? Direction.Down : Direction.Up));
						}
					}
					if (foundCart) {
						tracks.push(newTrack);
						console.log('Found track', tracks.length);	
					}
				}
			}
		}
	}
	console.log(tracks.length);
	console.log(carts.length);
};

const part1 = () => {
	let firstCollision: Point = null;
	while (firstCollision === null) {
		firstCollision = tick();
	}
	return firstCollision;
};
const part2 = () => { };


// Scaffolding:
loadData(day, (data: string) => {
	getData(data);
	console.log('Part1: ', part1());
	// console.log('Part2: ', part2());
});
