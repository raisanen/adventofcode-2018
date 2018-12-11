import { loadData } from './include/utils';
import * as _ from 'lodash';

const day = 7,
	rex = /Step ([A-Z]) must be finished before step ([A-Z]) can begin./,
	steps: {[name: string]: string[]} = {};

const getData = (data: string) => {
	data.splitLines().forEach(l => {
		const matches = l.match(rex);
		if (matches) {
			const [m, dependsOn, step] = matches;
			if (!steps[step]) {
				steps[step] = [];
			}
			if (!steps[dependsOn]) {
				steps[dependsOn] = [];
			}
			steps[step].push(dependsOn);
		}
	});
};

const part1 = () => {
	let order = '';
	const remaining = {...steps};
	while (_.keys(remaining).length > 0) {
		const currentStep = _.keys(remaining).filter(k => remaining[k].length === 0).sort()[0];
		order += currentStep;
		delete remaining[currentStep];
		_.keys(remaining).forEach(k => remaining[k] = remaining[k].filter(d => d !== currentStep));
	}
	return order;
};
const part2 = () => {};


// Scaffolding:
loadData(day, (data: string) => {
	getData(data);
	console.log('Part1: ', part1());
//	console.log('Part2: ', part2());
});
