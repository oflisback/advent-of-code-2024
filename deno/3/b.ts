const text = await Deno.readTextFile("../input/3/input.txt");

const muls = text.match(/don\'t\(\)|do\(\)|mul\(\d{1,3},\d{1,3}\)/g)

let include = true
const included = []
for (let i=0;i<muls!.length;i++) {
  if (muls![i] === 'do()') {
    include = true
    continue
  }
  if (muls![i] === 'don\'t()') {
    include = false
    continue
  }
  if (!include) {
    continue
  }
  included.push(muls![i])
}

const result = included!.reduce((acc: number, mul: string) => {
  const terms = mul.substring(4,mul.length-1).split(',').map(s => parseInt(s))
  return acc + terms[0] * terms[1]
}, 0)


console.log(result)
