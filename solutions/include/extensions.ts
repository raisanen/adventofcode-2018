//#region Array
interface Array<T> {
	sum(): number;
	sumBy(predicate: (e: any) => number): number;
	product(): number;
	toNumbers(): number[];
	removeFalsy(): any[];
	min(): number;
	max(): number;
	minBy(predicate: (e: any) => number): number;
	maxBy(predicate: (e: any) => number): number;
	mapTo(key: string): any[];
}

Array.prototype.sum = function() {
	return this.reduce((p, c) => p + c, 0);
};

Array.prototype.sumBy = function(predicate: (e: any) => number): number {
	return this.map(predicate).sum();
};

Array.prototype.product = function() {
	return this.reduce((p, c) => p * c, 1);
};

Array.prototype.toNumbers = function() {
	return this.map(Number);
};

Array.prototype.removeFalsy = function() {
	return this.filter(i => !!i);
};

Array.prototype.min = function (): number {
	let min = Number.MAX_SAFE_INTEGER;
	for (let i = 0; i < this.length; i++) {
		if (this[i] < min) {
			min = this[i];
		}
	}
	return min;
};

Array.prototype.max = function (): number {
	let max = Number.MIN_SAFE_INTEGER;
	for (let i = 0; i < this.length; i++) {
		if (this[i] > max) {
			max = this[i];
		}
	}
	return max;
};

Array.prototype.minBy = function (predicate: (e: any) => number): number {
	return this.map(predicate).min();
};

Array.prototype.maxBy = function (predicate: (e: any) => number): number {
	return this.map(predicate).max();
};

Array.prototype.mapTo = function (key: string): any[] {
	return this.map(e => e[key]);
}
//#endregion

//#region String
interface String {
	splitLines(): string[];
	splitChars(): string[];
	rejoin(joinChar?: string, splitChar?: string): string;
	map(callback: (value: string, index?: number, array?: string[]) => any, splitChar?: string, joinChar?: string): string;
	mapChars(callback: (value: string, index?: number, array?: string[]) => any, joinChar?: string): string;
	mapLines(callback: (value: string, index?: number, array?: string[]) => any, joinChar?: string): string;
}

String.prototype.splitLines = function() {
	return this.split(/\n+/);
};

String.prototype.splitChars = function() {
	return this.split('');
};

String.prototype.rejoin = function (joinChar=null, splitChar=null) {
	return this.split(splitChar || '').join(joinChar || '');
}

String.prototype.map = function(
	callback: (value: string, index: number, array: string[]) => any,
	splitChar=null,
	joinChar=null
) {
	return this.split(splitChar || '').map(callback).join(joinChar || splitChar || '');
}
String.prototype.mapChars = function(
	callback: (value: string, index: number, array: string[]) => any,
	joinChar=null
) {
	return this.map(callback, '', joinChar || '');
}
String.prototype.mapLines = function(
	callback: (value: string, index: number, array: string[]) => any,
	joinChar=null
) {
	return this.map(callback, '\n', joinChar || '\n');
}
//#endregion
