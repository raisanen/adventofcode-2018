import * as uuid from 'uuid';

class TapeCell<T> {
	id: string;
	value: T;
	prev: TapeCell<T>;
	next: TapeCell<T>;

	constructor(value: T = null, prev: TapeCell<T> = null, next: TapeCell<T> = null) {
		this.id = uuid.v4();
		this.value = value;
		this.prev = prev;
		this.next = next;
	}
}

export class InfiniteTape<T> {
	private defaultValue: T = null;
	private centerCell: TapeCell<T>;
	private currentCell: TapeCell<T>;
	private currentIndex: 0;

	private minIndex = 0;
	private maxIndex = 0;

	constructor(values: T[] = null, defaultValue: T = null, startAt: number = 0) {
		this.defaultValue = defaultValue;
		this.currentCell = this.centerCell = new TapeCell<T>();
		if (values && values.length > 0) {
			this.replace(startAt, ...values);
		}
	}

	get startIndex(): number {
		return this.minIndex;
	}
	get endIndex(): number {
		return this.maxIndex;
	}

	private findCell(id: string): TapeCell<T> {
		this.start();
		do {
			if (this.currentCell.id === id) {
				return this.currentCell;
			}
		} while (this.moveRight(false) !== null);
		return null;
	}

	private moveLeft(grow: boolean = true): TapeCell<T> {
		if (this.currentCell.prev === null) {
			if (!grow) {
				return null;
			}
			this.currentCell.prev = new TapeCell<T>(this.defaultValue, null, this.currentCell);
		}
		this.currentCell = this.currentCell.prev;
		this.currentIndex--;
		if (this.currentIndex < this.minIndex) {
			this.minIndex = this.currentIndex;
		}
		return this.currentCell;
	}
	private moveRight(grow: boolean = true): TapeCell<T> {
		if (this.currentCell.next === null) {
			if (!grow) {
				return null;
			}
			this.currentCell.next = new TapeCell<T>(this.defaultValue, this.currentCell);
		}
		this.currentCell = this.currentCell.next;
		this.currentIndex++;
		if (this.currentIndex > this.maxIndex) {
			this.maxIndex = this.currentIndex;
		}
		return this.currentCell;
	}

	private getCellAt(index: number): TapeCell<T> {
		if (index === 0 || (this.currentIndex > 0 && index < 0) || (this.currentIndex < 0 && index > 0)) {
			this.currentCell = this.centerCell;
			this.currentIndex = 0;
		}
		const move = index < this.currentIndex ? this.moveLeft : this.moveRight;
		while (this.currentIndex !== index) {
			move();
		}
		return this.currentCell;
	}

	private doWitoutMoving(action: () => any): any {
		const previousIndex = this.currentIndex,
			result = action();

		this.moveTo(previousIndex);

		return result;
	}

	zip(fromIndex: number, toIndex: number): InfiniteTape<T> {
		this.moveTo(fromIndex);
		const currentId = this.currentCell.id;
		let endItem: TapeCell<T> = this.currentCell;

		for (let i = fromIndex; i < toIndex; i++) {
			endItem = endItem.next;
			if (endItem === null) {
				break;
			}
		}

		this.currentCell.next = endItem;
		this.minIndex = 0;
		this.maxIndex = 0;
		this.end();
		this.start();

		this.findCell(currentId);

		return this;
	}

	moveTo(index: number): InfiniteTape<T> {
		this.getCellAt(index);
		return this;
	}

	start(): InfiniteTape<T> {
		this.center();
		while(this.moveLeft(false) !== null);

		return this;
	}

	end(): InfiniteTape<T> {
		this.center();
		while(this.moveRight(false) !== null);

		return this;
	}

	center(): InfiniteTape<T> {
		return this.moveTo(0);
	}

	currentValue(): T {
		return this.currentCell.value;
	}

	next(): T {
		return this.currentIndex < this.maxIndex ? this.moveRight().value : null;
	}
	prev(): T {
		return this.currentIndex > this.minIndex ? this.moveLeft().value : null;
	}

	itemAt(index: number, newValue?: T): T {
		return newValue === null ? this.getCellAt(index).value : (this.getCellAt(index).value = newValue);
	}

	append(...newValue: T[]): InfiniteTape<T> {
		newValue.forEach(v => this.itemAt(this.minIndex - 1, v));
		return this;
	}
	prepend(...newValue: T[]): InfiniteTape<T> {
		newValue.forEach(v => this.itemAt(this.maxIndex + 1, v));
		return this;
	}

	slice(from?: number, to?: number): T[] {
		return this.doWitoutMoving(() => {
			const output: T[] = [],
				startAt = from === null ? this.minIndex : from,
				endAt = to === null ? this.maxIndex : to;

			for (let i = startAt; i <= endAt; i++) {
				output.push(this.itemAt(i));
			}

			return output;
		});
	}
	insert(at: number, ...newValues: T[]): InfiniteTape<T> {
		const tmpLeft: T[] = this.slice(this.startIndex, at - 1),
			tmpRight: T[] = this.slice(at, this.endIndex);
		this.replace(this.startIndex, ...[...tmpLeft, ...newValues, ...tmpRight]);
		return this;
	}

	replace(from: number, ...newValues: T[]): InfiniteTape<T> {
		for (let i = from, j = 0; j < newValues.length; i++ , j++) {
			this.itemAt(i, newValues[j]);
		}
		return this;
	}

	indexOf(value: T): number {
		return this.doWitoutMoving(() => {
			this.start();
			do {
				if (this.currentValue() === value) {
					return this.currentIndex;
				}
			} while (this.next() !== null);
			return null;	
		});
	}

	findIndex(predicate: (v: T) => boolean): number {
		return this.doWitoutMoving(() => {
			this.start();
			do {
				if (predicate(this.currentValue())) {
					return this.currentIndex;
				}
			} while (this.next() !== null);
			return null;	
		});
	}

	find(predicate: (v: T) => boolean): T {
		return this.doWitoutMoving(() => {
			const idx = this.findIndex(predicate);
			return idx === null ? null : this.itemAt(idx);	
		});
	}

	map(callback: (v: T, idx: number) => T, startAt?: number, numItems?: number): T[] {
		if (startAt !== null) {
			this.moveTo(startAt);
		} else {
			this.start();
		}
		for (let i = 0; numItems === null ? this.currentIndex < this.maxIndex : i < numItems; i++) {
			this.itemAt(this.currentIndex, callback(this.itemAt(this.currentIndex), this.currentIndex));
			this.next();
		}
		return null;
	}
}
