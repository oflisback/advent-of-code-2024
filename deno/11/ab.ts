const input = await Deno.readTextFile("../input/11/input.txt");

const getStonesLengthMap = (map: Map<number, number>) => {
  let len = 0
  map.values().forEach(count => {
    len += count
  })
  return len
}


const add = (value: number, count: number, obj: Map<number, number>) => {
  const curCount = obj.get(value)
  if (curCount) {
    obj.set(value, curCount+count)
  } else {
    obj.set(value, count)
  }
}

let stones: Map<number, number> = new Map<number, number>()

for (const stone of input.split(' ').map(s => parseInt(s))) {
  add(stone, 1, stones)
}

for (let i=1;i<=75;i++) {
  const thisIterStones = new Map<number, number>()
  stones.entries().forEach((([n, count]) => {
    if (n === 0) {
      add(1, count, thisIterStones)
      return
    }
    const s = n.toString()
    if (s.length % 2 === 0) {
      add(parseInt(s.substring(0, s.length / 2)), count, thisIterStones)
      add(parseInt(s.substring(s.length / 2)), count, thisIterStones)
    } else {
      add(n * 2024, count, thisIterStones)
    }
  }))
  stones = thisIterStones
  if (i===25) {
    console.log(`a: ${getStonesLengthMap(stones)}`)
  }
}
console.log(`b: ${getStonesLengthMap(stones)}`)
