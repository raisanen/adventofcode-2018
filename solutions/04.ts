import { loadData } from './utils';
import * as _ from 'lodash';

const getData = (data: string) => data;

const part1 = (data: any) => data;
const part2 = (data: any) => data;

const solve = (data: string) => {
	let rows = getData(data);
	console.log('Part1: ', part1(rows));
	console.log('Part2: ', part2(rows));
}

loadData(4, solve);
