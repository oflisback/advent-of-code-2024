const rows = (await Deno.readTextFile("../input/13/input.txt")).split('\n');
import nerdamer  from 'npm:nerdamer'
import 'npm:nerdamer/Algebra.js'
import 'npm:nerdamer/Calculus.js'
import 'npm:nerdamer/Solve.js'


type Tuple = {
  x: number,
  y: number
}

type Machine = {
  a: Tuple,
  b: Tuple,
  p: Tuple
}

const machines: Machine[] = []

while (rows.length > 0) {
  const [aInstruction, bInstruction, price, _] = rows.splice(0,4)

  machines.push({
    a: { 
      x: parseInt(aInstruction.match(/X\+(\d+)/)![1]),
      y: parseInt(aInstruction.match(/Y\+(\d+)/)![1]),
    },
    b: { 
      x: parseInt(bInstruction.match(/X\+(\d+)/)![1]),
      y: parseInt(bInstruction.match(/Y\+(\d+)/)![1]),
    },
    p: { 
      x: parseInt(price.match(/X\=(\d+)/)![1]),
      y: parseInt(price.match(/Y\=(\d+)/)![1]),
    }
  })
}

const getTokensRequired = (prefix?: number) => 
  machines.map(m => {
    if (prefix) {
      m.p.x = prefix + m.p.x
      m.p.y = prefix + m.p.y
    }
    const equations = [`A*${m.a.x}+B*${m.b.x}=${m.p.x}`, `A*${m.a.y}+B*${m.b.y}=${m.p.y}`]
    const [aRes, bRes] = nerdamer.solveEquations(equations, ['A', 'B'])
    const a = aRes[1]
    const b = bRes[1]
    if (Number.isInteger(a) && Number.isInteger(b)) {
      return { a, b}
    }
  }).filter(res => res).reduce((sum, val) => sum + val!.a*3 + val!.b, 0)

console.log('a: ', getTokensRequired())
console.log('b: ', getTokensRequired(10000000000000))

