import { loadData } from './include/utils';
import * as _ from 'lodash';

interface Guard {
	id: number;
	totalSleepMinutes: number;
	minutesSlept: {[minute: string]: number};
}

let guards: Guard[] = [];

const getData = (data: string) => {
	let currentGuard: Guard = null;
	let fellAsleepAt: number = -1;
	let hasWoken = false;
	const lines = data.splitLines().sort();
	const wakeUp = (wokeUpAt: number) => {
		if (fellAsleepAt >= 0) {
			for (let i = fellAsleepAt; i < wokeUpAt; i++) {
				currentGuard.totalSleepMinutes++;
				currentGuard.minutesSlept[i] = (currentGuard.minutesSlept[i] || 0) + 1;
			}	
		}
		hasWoken = true;
	}

	for (let ln = 0; ln < lines.length; ln++) {
		const l = lines[ln];
		const match = l.match(/-(\d\d)-(\d\d) (\d\d):(\d\d)\]/);
		if (match) {
			const [str, month, date, hour, minute] = match.map(Number);
			if (l.indexOf('Guard') > 0) { // new Guard
				const guardNum = +(l.match(/Guard #(\d+)/)![1]);
				if (currentGuard) {
					if (!hasWoken) {
						wakeUp(60);
					}
					guards.push({...currentGuard});
				}
				fellAsleepAt = -1;
				currentGuard = guards.find(g => g.id === guardNum) || <Guard>{id: guardNum, totalSleepMinutes: 0, minutesSlept: {}};
			} else if (l.indexOf('falls asleep') > 0) {
				fellAsleepAt = minute;
			} else if (l.indexOf('wakes up') > 0) {
				wakeUp(minute);
			}
		}
	}
	guards = _.sortBy(guards, g => -g.totalSleepMinutes);
};

const part1 = () => {
	const mostSleepGuard = guards[0];
	let maxMinute = [0, 0];
	for (let i = 0; i < 60; i++) {
		if ((mostSleepGuard.minutesSlept[i] || 0) >= maxMinute[1]) {
			maxMinute = [i, (mostSleepGuard.minutesSlept[i] || 0)];
		}
	}
	return mostSleepGuard.id * maxMinute[0];
};
const part2 = () => {
	let maxGuardMinute = [0, 0, 0];
	for (let g = 0; g < guards.length; g++) {
		for (let i = 0; i < 60; i++) {
			var m = guards[g].minutesSlept[i] || 0;
			if (m >= maxGuardMinute[2]) {
				maxGuardMinute = [guards[g].id, i, m];
			}
		}	
	}
	return maxGuardMinute[0] * maxGuardMinute[1];
};

const solve = (data: string) => {
	getData(data);
	console.log('Part1: ', part1());
	console.log('Part2: ', part2());
}
loadData(4, solve);
