const text = await Deno.readTextFile('../input/7/input.txt');

type Operators = ((a: number, b: number) => number)[];

const isValid = (
	{ currentValue, target, operands, operators }: { currentValue: number; target: number; operands: number[]; operators: Operators },
): boolean =>
	!operands[0] || currentValue >= target
		? target === currentValue
		: operators.some((op) => isValid({ currentValue: op(currentValue, operands[0]), target, operands: operands.slice(1), operators }));

const getSumOfValid = (operators: Operators) =>
	text.split('\n').slice(0, -1).map((line) => ({
		target: parseInt(line.split(': ')[0]),
		operands: line.split(': ')[1].split(' ').map((s) => parseInt(s)),
	})).reduce(
		(sum, { target, operands }) =>
			isValid({ currentValue: operands[0], target, operands: operands.slice(1), operators }) ? sum + target : sum,
		0,
	);

const ops = [
	(a: number, b: number) => a + b,
	(a: number, b: number) => a * b,
];
console.log('a: ', getSumOfValid(ops));
console.log('b: ', getSumOfValid([...ops, (a: number, b: number) => parseInt(`${a}${b}`)]));
