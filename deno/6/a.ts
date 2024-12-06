const text = await Deno.readTextFile("../input/6/input.txt");

const grid: string[][] = text.split("\n").map(line => line.split('')).slice(0,-1)

type Coord = {
  x: number
  y: number
}

const posString = ({x, y}: Coord) => `x${x}y${y}`

const guard = { x: -1, y: -1, direction: 'up'}

grid.forEach((row: string[], y: number) => {
  const x = row.findIndex((c: string) => c ==='^')
  if (x !== -1) {
    guard.x = x;
    guard.y = y;
  }
})

const visited = new Set<string>([])

const inBounds = ({x, y}: Coord) => x >= 0 && y >= 0 && x < grid[0].length && y < grid.length

while (true) {
  visited.add(posString(guard))
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
    break
  }

  if (['.','^'].includes(grid[next.y][next.x])) {
    guard.x = next.x
    guard.y = next.y
  } else {
    guard.direction = next.direction
  }
}

console.log(visited.size)
