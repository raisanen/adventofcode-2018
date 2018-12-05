//#region Array
interface Array<T> {
	sum(): number;
	product(): number;
	toNumbers(): number[];
	removeFalsy(): any[];
}

Array.prototype.sum = function() {
	return this.reduce((p, c) => p + c, 0);
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
//#endregion

//#region String
interface String {
	splitLines(): string[];
	splitChars(): string[];
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
