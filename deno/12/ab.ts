const text = await Deno.readTextFile("../input/12/input.txt");

const grid: string[][] = text.split('\n').map((line) => line.split('')).slice(0, -1);

type Coord = { x: number; y: number };

const withinBounds = (c: Coord) => c.x >= 0 && c.y >= 0 && c.x < grid[0].length && c.y < grid[1].length;

type Region = {
  area: number
  crop: string
  perimeterPlots: PerimeterPlot[]
  perimeterSidePlots: PerimeterPlot[]
  plots: string[]
  sides: number
}

const getPerimeterBasedPrice = (region: Region) => region.area * region.perimeterPlots.reduce((sum, pp) => sum += pp.perimeterDirections.length, 0)

const getSideBasedPrice = (region: Region) => region.area * region.sides

const directions = ['up','right','down','left'] as const

type Direction = typeof directions[number]

type PerimeterPlot = {
  plot: Coord
  perimeterDirections: Direction[]
}

const diffs = {
  'up': [0,-1],
  'down': [0,1],
  'right': [1,0],
  'left': [-1,0]
}

const getPerimeterPlots = (crop: string, plots: Set<string>): PerimeterPlot[] => {
  const perimeterPlots: PerimeterPlot[] = []

  plots.forEach(plot => {
    const plotCoord = JSON.parse(plot)
    const perimeterPlotCandidate: PerimeterPlot = { plot: plotCoord, perimeterDirections: [] } 

    for (const dir of directions) {
      const { x, y } = plotCoord
      const [dx, dy] = diffs[dir]
      const n = { x: x + dx, y: y + dy}
      if (!withinBounds(n) || grid[n.y][n.x] !== crop) {
        perimeterPlotCandidate.perimeterDirections.push(dir)
      }
    }
    if (perimeterPlotCandidate.perimeterDirections.length > 0) {
      perimeterPlots.push(perimeterPlotCandidate)
    }
  })
  return perimeterPlots
}

const directionsToCheck: Record<Direction, Direction[]> = {
  'left': ['up', 'down'],
  'right': ['up', 'down'],
  'down': ['left', 'right'],
  'up': ['left', 'right'],
}

const getRegionSides = (region: Region) => {
  const pPlots = region.perimeterSidePlots

  let sideCount = 0

  pPlots.forEach(pPlot => {
    for (const perDirection of pPlot.perimeterDirections) {
      sideCount++
      for (const checkDir of directionsToCheck[perDirection]) {
        const [dx, dy] = diffs[checkDir]
        let keepGoingJao = true
          const n = { x: pPlot.plot.x + dx, y: pPlot.plot.y + dy}
        while (keepGoingJao) {
          let foundOne = false
          for (const otherPlot of region.perimeterSidePlots) {
            if (otherPlot.plot.x === n.x && otherPlot.plot.y === n.y) {
              if (otherPlot.perimeterDirections.includes(perDirection)) {
                otherPlot.perimeterDirections = otherPlot.perimeterDirections.filter(dir => dir !== perDirection)
                foundOne = true
              }
            }
          }
          if (!foundOne) {
            keepGoingJao = false
          }

          n.x += dx
          n.y += dy
        }
      }}})

  return sideCount
}

const regions: Record<string, string> = {
}

const takenPlots = new Set<string>()

const toS = (c: Coord) => JSON.stringify(c)

const getRegionPlots = (s: Coord) => {
  const crop = grid[s.y][s.x]
  const plots = new Set<string>()

  const visit = (crop: string, { x, y}: Coord) => {
    const plot = toS({ x, y })
    if (!withinBounds({ x, y}) || grid[y][x] !== crop || takenPlots.has(plot)) {
      return
    }
    plots.add(plot)
    takenPlots.add(plot)
    ;[[1,0],[0,1],[-1,0],[0,-1]].forEach(([dx, dy]) => {
        visit(crop, {x: x + dx, y: y + dy})
    })
  }

  visit(crop, s)

  return plots
}

for (let y=0;y<grid.length;y++) {
  for (let x=0;x<grid.length;x++) {
    const c: Coord = { x, y }
    const topLeftPlot = toS(c)
    if (!takenPlots.has(topLeftPlot)) {
      const plots = getRegionPlots(c)
      const crop = grid[y][x]
      const region: Region = {
        area: plots.size,
        crop,
        perimeterPlots: getPerimeterPlots(crop, plots),
        plots: [...plots],
        perimeterSidePlots: getPerimeterPlots(crop, plots),
        sides: 0
      }
      region.sides = getRegionSides(region)
      regions[topLeftPlot] = JSON.stringify(region)
    }
  }
}

let perimeterBasedPrice = 0
let sideBasedPrice = 0
Object.values(regions).forEach((region: string) => {
  const r: Region = JSON.parse(region)
  perimeterBasedPrice += getPerimeterBasedPrice(r)
  sideBasedPrice += getSideBasedPrice(r)
})

console.log('perimeterBasedPrice: ', perimeterBasedPrice)
console.log('sideBasedPrice: ', sideBasedPrice)
