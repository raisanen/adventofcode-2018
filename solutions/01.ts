import { loadData } from './utils';

const getData = (data: string): number[] => {
	return data.splitLines().toNumbers();
}

const part1 = (data: number[]): number => {
	return data.sum();
};

const part2 = (data: number[]): number => {
	let current = 0,
		seen: {[key: number]: boolean} = {};
	while(true) {
		for (let i = 0; i < data.length; i++) {
			current += data[i];
			if (seen[current]) {
				return current;
			}
			seen[current] = true;
		}	
	}
};

loadData(1, (data: string) => {
	let numbers = getData(data);
	console.log('Part1: ', part1(numbers));
	console.log('Part2: ', part2(numbers));
});