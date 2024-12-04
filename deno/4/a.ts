const text = await Deno.readTextFile("../input/4/input.txt");

const horPad = [".",".","."]
let grid = text.split("\n").slice(0, -1).map(row => [...horPad, ...row.split(''), ...horPad])

const vertPad = Array(grid[0].length).fill('.')

grid = [vertPad, vertPad, vertPad, ...grid, vertPad, vertPad, vertPad]

const deltas = [[1,1],[1,0],[0,1],[-1,0], [0, -1], [-1, -1], [-1,1],[1,-1]]

const word = ['X','M','A','S']

let nbrFound = 0
for (let x=0;x<grid.length;x++) {
  for (let y=0;y<grid.length;y++) {
    if (grid[x][y] === 'X') {
      for (const [dx, dy] of deltas) {
        for (let i=1;i<=3;i++) {
          if (grid[x+dx*i][y+dy*i] !== word[i]) {
            break
          }
          if (i===3) {
            nbrFound +=1
          }
        }
      }
    }
  }
}

console.log(nbrFound)
