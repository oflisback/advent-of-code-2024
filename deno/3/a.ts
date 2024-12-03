const text = await Deno.readTextFile("../input/3/input.txt");

const muls = text.match(/mul\(\d{1,3},\d{1,3}\)/g)

const result = muls!.reduce((acc: number, mul: string) => {
  console.log(mul)
  const terms = mul.substring(4,mul.length-1).split(',').map(s => parseInt(s))
  return acc + terms[0] * terms[1]
}, 0)


console.log(result)
