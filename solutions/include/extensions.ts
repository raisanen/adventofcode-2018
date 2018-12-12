type ComparePredicate = (a: any, b: any) => boolean;
type NumAction = (obj: any) => number;

//#region Array
interface Array<T> {
	skip(n: number): any[];
	take(n: number): any[];
	first(): any;
	last(): any;
	sum(): number;
	sumBy(predicate: NumAction): number;
	product(): number;
	toNumbers(): number[];
	removeFalsy(): any[];
	min(): number;
	max(): number;
	minBy(predicate: NumAction): number;
	maxBy(predicate: NumAction): number;
	mapTo(key: string): any[];
	allSame(other: any[], cmp?: ComparePredicate): boolean;
}

Array.prototype.skip = function (n: number): any[] {
	return this.length > n ? this.slice(n) : []; 
};

Array.prototype.take = function (n: number): any[] {
	return this.length > n ? this.slice(0, n) : [];
};

Array.prototype.first = function(): any {
	return this.length > 0 ? this[0] : null;
};

Array.prototype.last = function(): any {
	return this.length > 0 ? this.slice(-1)[0] : null;
}

Array.prototype.sum = function(): number {
	return this.reduce((p, c) => p + c, 0);
};

Array.prototype.sumBy = function(predicate: NumAction): number {
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
	return this.reduce((p, c) =>
	 c < p ? c : p, Number.MAX_SAFE_INTEGER);
};

Array.prototype.max = function (): number {
	return this.reduce((p, c) => c > p ? c : p, Number.MIN_SAFE_INTEGER);
};

Array.prototype.minBy = function (predicate: NumAction): number {
	return this.map(predicate).min();
};

Array.prototype.maxBy = function (predicate: NumAction): number {
	return this.map(predicate).max();
};

Array.prototype.mapTo = function (key: string): any[] {
	return this.map(e => e[key]);
}

Array.prototype.allSame = function (other: any[], cmp?: ComparePredicate): boolean {
	const cmpCallback = cmp ? cmp : (a: any, b: any) => a === b;
	return this.length === other.length && this.every((v, i) => cmpCallback(v, other[i]));
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
