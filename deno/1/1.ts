import { chunk } from 'std/collections/chunk.ts';
import { unzip } from 'std/collections/unzip.ts';

const text = await Deno.readTextFile('../input/1/input.txt');

const numbers = text
	.split(/\W/)
	.filter((n) => n.trim() !== '')
	.map((n) => parseInt(n));

const [left, right] = unzip(chunk(numbers, 2) as [number, number][]).map(
	(a: number[]) => a.toSorted(),
);

const dist = left.reduce((acc, l, i) => (acc += Math.abs(l - right[i])), 0);
console.log(dist);

const similarityScore = left.reduce(
	(acc, l) => (acc += l * right.filter((n) => n === l).length),
	0,
);
console.log(similarityScore);
