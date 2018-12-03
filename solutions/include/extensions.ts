
interface Array<T> {
	sum(): number;
	product(): number;
	toNumbers(): number[];
	filterFalsy(): any[];
}

interface String {
	splitLines(): string[];
	splitChars(): string[];
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

Array.prototype.filterFalsy = function() {
	return this.filter(i => !!i);
};

String.prototype.splitLines = function() {
	return this.split(/\n+/);
};

String.prototype.splitChars = function() {
	return this.split('');
};
