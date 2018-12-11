import { loadData } from './include/utils';
import * as _ from 'lodash';

class Step {
	name: string;
	dependsOn: string[];
	timeRemaining: number;
}

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
const part2 = (numWorkers = 5, minTime = 60) => {
	let done = '',
		seconds = 0,
		remaining: Step[] = _.keys(steps).map(k => {
			return <Step>{
				name: k,
				dependsOn: [...steps[k]],
				timeRemaining: minTime + (k.charCodeAt(0) - 'A'.charCodeAt(0)) + 1
			};
		}).sort((a, b) => a.dependsOn.length - b.dependsOn.length),
		workers: string[] = [];
	while (remaining.length > 0) {
		let doneThisStep = '';
		while (workers.length < numWorkers) {
			const currentSteps = remaining.filter(r => workers.indexOf(r.name) < 0 && r.dependsOn.length === 0);
			if (currentSteps.length > 0) {
				workers.push(currentSteps.map(s => s.name).sort()[0]);
			} else {
				break;
			}
		}
		workers.map(w => remaining.find(r => r.name === w)).forEach(r => {
			r.timeRemaining--;
			if (r.timeRemaining === 0) {
				doneThisStep += r.name;
				remaining.forEach(rr => rr.dependsOn = rr.dependsOn.filter(d => d !== r.name));
			}
		});
		// console.log(seconds, workers, done);
		workers = workers.filter(w => remaining.find(r => r.name === w).timeRemaining > 0);
		remaining = remaining.filter(r => r.timeRemaining > 0);
		seconds++;
		done += doneThisStep;
	}
	// console.log(seconds, workers, done);
	return [done, seconds];
};


// Scaffolding:
loadData(day, (data: string) => {
	getData(data);
	console.log('Part1: ', part1());
	console.log('Part2: ', part2(5, 60));
});
