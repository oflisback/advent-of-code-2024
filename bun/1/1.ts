const text = await Bun.file("../input/1/input.txt").text();

const numbers = text
  .split(/\W/)
  .filter((n) => n.trim() !== "")
  .map((n) => parseInt(n));

const [left, right] = numbers
  .reduce(
    (acc: [number[], number[]], v, index) => {
      if (index % 2) {
        acc = [[...acc[0], v], acc[1]];
      } else {
        acc = [acc[0], [...acc[1], v]];
      }
      return acc;
    },
    [[], []],
  )
  .map((n) => n.toSorted());

const dist = left.reduce((acc, l, i) => (acc += Math.abs(l - right[i])), 0);
console.log(dist);

const similarityScore = left.reduce(
  (acc, l) => (acc += l * right.filter((n) => n === l).length),
  0,
);
console.log(similarityScore);
