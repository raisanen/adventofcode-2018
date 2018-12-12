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

	private currentIndex = 0;

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

	private move(direction: 1|-1 = 1, grow: boolean = true): TapeCell<T> {
		const prop: 'next'|'prev' = direction === 1 ? 'next' : 'prev';
		if (this.currentCell[prop] === null) {
			if (!grow) {
				return null;
			}
			this.currentCell[prop] = direction === 1 
				? new TapeCell<T>(this.defaultValue, this.currentCell)
				: new TapeCell<T>(this.defaultValue, null, this.currentCell);
		}
		this.currentCell = this.currentCell[prop];
		this.currentIndex += direction;
		if (this.currentIndex < this.minIndex) {
			this.minIndex = this.currentIndex;
		}
		if (this.currentIndex > this.maxIndex) {
			this.maxIndex = this.currentIndex;
		}
		if (this.currentIndex === 0) {
			this.centerCell = this.currentCell;
		}
		return this.currentCell;
	}

	private moveLeft(grow: boolean = true): TapeCell<T> {
		return this.move(-1, grow);
	}
	private moveRight(grow: boolean = true): TapeCell<T> {
		return this.move(1, grow);
	}

	private getCellAt(index: number): TapeCell<T> {
		if (index === 0 || (this.currentIndex > 0 && index < 0) || (this.currentIndex < 0 && index > 0)) {
			this.currentCell = this.centerCell;
			this.currentIndex = 0;
		}
		while (this.currentIndex !== index) {
			this.move(index < this.currentIndex ? -1: 1);
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

		for (let i = fromIndex; i < toIndex && endItem !== null; i++) {
			endItem = endItem.next;
		}

		this.currentCell.next = endItem;
		this.currentIndex = this.minIndex = this.maxIndex = 0;
		this.end().findCell(currentId);

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
		return this.moveRight(false)!.value;
	}
	prev(): T {
		return this.moveLeft(false)!.value;
	}

	setValue(index: number, newValue: T = null): InfiniteTape<T> {
		this.getCellAt(index).value = newValue;
		return this;
	}
	getValue(index: number): T {
		return this.getCellAt(index).value;
	}

	append(...newValue: T[]): InfiniteTape<T> {
		newValue.forEach(v => this.setValue(this.minIndex - 1, v));
		return this;
	}
	prepend(...newValue: T[]): InfiniteTape<T> {
		newValue.forEach(v => this.setValue(this.maxIndex + 1, v));
		return this;
	}

	slice(from?: number, to?: number): T[] {
		return this.doWitoutMoving(() => {
			const output: T[] = [],
				startAt = from === null ? this.minIndex : from,
				endAt = to === null ? this.maxIndex : to;

			for (let i = startAt; i <= endAt; i++) {
				output.push(this.getValue(i));
			}

			return output;
		});
	}
	splice(at: number, deleteCount: number, ...newValues: T[]): T[] {
		const ret: T[] = [];

		this.moveTo(at);

		if (deleteCount > 0) {
			ret.push(...this.slice(this.currentIndex, this.currentIndex + deleteCount));
			this.zip(this.currentIndex - 1, this.currentIndex + deleteCount);
		}
		if (newValues && newValues.length > 0) {
			const tmpLeft: T[] = this.slice(this.startIndex, this.currentIndex - 1),
			tmpRight: T[] = this.slice(this.currentIndex, this.endIndex);

			this.replace(this.startIndex, ...tmpLeft, ...newValues, ...tmpRight);
		}

		return ret;
	}

	replace(from: number, ...newValues: T[]): InfiniteTape<T> {
		for (let i = from, j = 0; j < newValues.length; i++ , j++) {
			this.setValue(i, newValues[j]);
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
			return idx === null ? null : this.getValue(idx);	
		});
	}

	map(callback: (v: T, idx: number) => T, startAt?: number, numItems?: number): T[] {
		if (startAt !== null) {
			this.moveTo(startAt);
		} else {
			this.start();
		}
		for (let i = 0; numItems === null ? this.currentIndex < this.maxIndex : i < numItems; i++) {
			this.setValue(this.currentIndex, callback(this.getValue(this.currentIndex), this.currentIndex));
			this.next();
		}
		return null;
	}
}
