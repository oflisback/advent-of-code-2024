const text = await Deno.readTextFile("../input/10/input.txt");

const map = text.split("\n").slice(0, -1).map((row: string) => row.split('').map(s => parseInt(s)))

type Coord = { x: number, y: number }

type Grid = number[][]

const getTrailHeads = (map: Grid) => {
  const starts: Coord[] = []

  for (let y=0;y<map.length;y++) {
    for (let x=0;x<map.length;x++) {
      if (map[y][x] === 0) {
        starts.push({ x, y})
      }
    }

  }
  return starts;
}

const goToNextStep = (c: Coord, prevHeight: number, pathsToTops: Set<string>, reachableTops: Set<string>, currentPath: Coord[]) => {
  if (!(c.x >= 0 && c.x < map[0].length && c.y >= 0 && c.y < map.length)) {
    return { pathsToTops, reachableTops }
  }

  if (map[c.y][c.x] !== prevHeight+1) {
    return { pathsToTops, reachableTops }
  }

  currentPath.push(c)

  if (map[c.y][c.x] === 9) {
    reachableTops.add(JSON.stringify(c))
    pathsToTops.add(JSON.stringify(currentPath))
    return { pathsToTops, reachableTops }
  }
  let pathsUnion = new Set<string>(pathsToTops);
  let reachableTopsUnion = new Set<string>(reachableTops);

  for (const [x, y] of [[1,0], [0,1],[-1,0],[0,-1]]) {
    const { pathsToTops: ptt, reachableTops: rt } = goToNextStep({ x: c.x + x, y: c.y + y}, map[c.y][c.x], new Set<string>(pathsToTops), new Set<string>(reachableTops), currentPath)
    pathsUnion = pathsUnion.union(ptt)
    reachableTopsUnion = reachableTopsUnion.union(rt)
  }
  return { pathsToTops: pathsUnion, reachableTops: reachableTopsUnion }
}

let totalPaths = 0
let totalTops = 0
getTrailHeads(map).forEach(trailHead => {
  const { pathsToTops, reachableTops } = goToNextStep(trailHead, -1, new Set([]), new Set([]), [])
  totalPaths += pathsToTops.size
  totalTops += reachableTops.size
})

console.log('a: ', totalTops)
console.log('b: ', totalPaths)
