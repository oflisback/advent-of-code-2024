const text = await Deno.readTextFile("../input/4/input.txt");

const grid = text.split("\n").slice(0, -1).map(row => row.split(''))

const delta1 = [[1,1],[-1,-1]]
const delta2 = [[-1,1],[1,-1]]

let nbrFound = 0
for (let x=1;x<grid.length-1;x++) {
  for (let y=1;y<grid.length-1;y++) {
    if (grid[x][y] !== 'A') {
      continue
    }
    const [x1,y1] = [delta1[0][0] + x, delta1[0][1] + y]
    const [x2,y2] = [delta1[1][0] + x, delta1[1][1] + y]

    const [x3,y3] = [delta2[0][0] + x, delta2[0][1] + y]
    const [x4,y4] = [delta2[1][0] + x, delta2[1][1] + y]

    if (['M', 'S'].includes(grid[x1][y1]) && ['M', 'S'].includes(grid[x2][y2]) && grid[x1][y1] !== grid[x2][y2] &&
['M', 'S'].includes(grid[x3][y3]) && ['M', 'S'].includes(grid[x4][y4]) && grid[x3][y3] !== grid[x4][y4])
     {
      nbrFound +=1
    }
  }
}

console.log(nbrFound)
