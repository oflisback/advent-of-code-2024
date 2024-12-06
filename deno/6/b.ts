const text = await Deno.readTextFile("../input/6/input.txt");

const grid: string[][] = text.split("\n").map(line => line.split('')).slice(0,-1)

type Pos = {
  x: number
  y: number
  direction: 'up' | 'down' | 'right' | 'left'
}


const initialGuard = { x: -1, y: -1, direction: 'up' as Pos["direction"]}

grid.forEach((row: string[], y: number) => {
  const x = row.findIndex((c: string) => c ==='^')
  if (x !== -1) {
    initialGuard.x = x;
    initialGuard.y = y;
  }
})

const inBounds = ({x, y}: Pos) => x >= 0 && y >= 0 && x < grid[0].length && y < grid.length

const mapIsLoop = (floorMap: string[][]) => {
  const posString = ({x, y, direction}: Pos) => `x${x}y${y}d${direction}`

  const guard = {...initialGuard}
  const visitedStates = new Set<string>([])

  while (true) {
    const pos = posString(guard)

    if (visitedStates.has(pos)) {
      return true
    }
    visitedStates.add(pos)
    const next = {...guard}
    switch (next.direction) {
      case 'up':
        next.y -= 1
        next.direction = 'right'
        break
      case 'down':
        next.y += 1
        next.direction = 'left'
        break
      case 'left':
        next.x -= 1
        next.direction = 'up'
        break
      case 'right':
        next.x += 1
        next.direction = 'down'
        break
    }
    if (!inBounds(next)) {
      return false
    }

    if (['.','^'].includes(floorMap[next.y][next.x])) {
      guard.x = next.x
      guard.y = next.y
    } else {
      guard.direction = next.direction
    }
  }
}

const loopPositions = new Set<string>([])

for (let x = 0;x<grid[0].length;x++) {
  for (let y = 0;y<grid.length;y++) {
    if (grid[y][x] === '.') {
      grid[y][x] = '#'
      if (mapIsLoop(grid)) {
        loopPositions.add(`x${x}y${y}`)
      }
      grid[y][x] = '.'
    }
  }
}

console.log(loopPositions.size)
