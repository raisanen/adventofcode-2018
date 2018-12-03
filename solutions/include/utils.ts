import * as fs from 'fs';
import './extensions';

export function loadData(day: number, callback: Function): void {
	const filename = `solutions/data/${day}.dat`;
	fs.readFile(filename, (error, data) => {
		if (!error) {
			callback(data.toString());
		}
	});
}
