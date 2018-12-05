import { alphabetArray, loadData } from './include/utils';
import * as _ from 'lodash';

const day = 5;

const transformationRex: RegExp = ((): RegExp => {
	return new RegExp(
		alphabetArray
			.map(c => c.toLowerCase() + c.toUpperCase() + '|' + c.toUpperCase() + c.toLowerCase())
			.join('|'),
		'g'
	);
})();

const transform = (data: string) => {
	while (data.match(transformationRex)) {
		data = data.replace(transformationRex, '');
	}
	return data;
};

const part1 = (data: string) => transform(data).length;
const part2 = (data: string) => _.min(alphabetArray.map((c) => transform(data.replace(new RegExp(c, 'gi'), '')).length));

// Scaffolding:
loadData(day, (data: string) => {
	console.log('Part1: ', part1(data));
	console.log('Part2: ', part2(data));
});
