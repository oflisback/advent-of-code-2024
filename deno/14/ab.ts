const text = await Deno.readTextFile('../input/14/input.txt');

const guardRoom = {
  height: 103,
  width: 101
}

const guards: Guard[] = text.split('\n').slice(0,-1).map(line => {
  const [x, y, dx, dy] = line.match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/)!.slice(1,5).map(s => parseInt(s))
  return { p: { x, y }, v: { dx, dy }}
})

type Coord = { x: number; y: number };
type Velocity = { dx: number; dy: number };

type Guard = {
  p: Coord,
  v: Velocity
}

const checkRoom = (iteration: number) => {
  const room: number[][] = new Array(guardRoom.height).map(_ => [])

  for (let y=0;y<guardRoom.height;y++) {
    room[y] = new Array(guardRoom.width).fill(0)
  }
  let maxOne = true
  for (const g of guards) {
    room[g.p.y][g.p.x] += 1
    if (room[g.p.y][g.p.x] > 1) {
      maxOne = false
    }
  }

  if (iteration === 100) {
    const quadrantPopulation = [0,0,0,0]

    guards.forEach(g => {
      if (g.p.x < (guardRoom.width-1) / 2) {
        if (g.p.y < (guardRoom.height-1) / 2) {
          quadrantPopulation[0] += 1
        } else if (g.p.y > (guardRoom.height-1) / 2) {
          quadrantPopulation[1] += 1
        }
      } else if (g.p.x > (guardRoom.width-1) / 2){
        if (g.p.y < (guardRoom.height-1) / 2) {
          quadrantPopulation[2] += 1
        } else if (g.p.y > (guardRoom.height-1) / 2) {
          quadrantPopulation[3] += 1
        }
      }
    })

    console.log('a: ', quadrantPopulation.reduce((res, v) => res*v, 1))

  }

  if (maxOne) {
    console.log('b: ', iteration)
  }
}

for (let i=1;i<10000;i++) {
  for (const g of guards) {
    g.p.x = (g.p.x + g.v.dx) % guardRoom.width
    if (g.p.x < 0) {
      g.p.x = guardRoom.width + g.p.x
    }
    g.p.y = (g.p.y + g.v.dy) % guardRoom.height
    if (g.p.y < 0) {
      g.p.y = guardRoom.height + g.p.y
    }
  }
  checkRoom(i)
}


