import { loadData, repeatFunction } from './include/utils';

const recipies = [3, 7];
let elf1 = 0;
let elf2 = 1; 

const reset = () => {
	recipies.splice(0, recipies.length);
	recipies.push(3, 7);
	elf1 = 0;
	elf2 = 1;
}

const tick = () => {
	const sum = recipies[elf1] + recipies[elf2],
		newRecipies = sum.toString().splitChars().toNumbers();
	recipies.push(...newRecipies);
	elf1 = (elf1 + 1 + recipies[elf1]) % (recipies.length);
	elf2 = (elf2 + 1 + recipies[elf2]) % (recipies.length);
};

const part1 = (times: number): string => {
	repeatFunction(tick, times + 10);
	return recipies.slice(times, times + 10).join('');
};
const part2 = (wantString: string): number => {
	const stringLen = wantString.length,
		lastNum = wantString.splitChars().toNumbers().last();
	let gotString = '';
	reset();
	while (true) {
		tick();
		const numRecipies = recipies.length;
		gotString = recipies[numRecipies-1] === lastNum && numRecipies >= stringLen ? recipies.slice(-stringLen).join('') : '';

		if (gotString === wantString) {
			return numRecipies - stringLen;
		}
	};
};

(() => {
	console.log('Part1: ', part1(509671));
	console.log('Part2: ', part2('509671'));
})();
