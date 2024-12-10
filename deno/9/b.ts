const input = (await Deno.readTextFile('../input/9/input.txt')).split('').slice(0, -1).map(d => parseInt(d));

type File = {
  id: number
  length: number
  startIndex: number
}

type Blank = {
  length: number
  startIndex: number
}

type FileSystem = {
  files: File[]
  blanks: Blank[]
  length: number
}

const fs: FileSystem = { blanks: [],files: [], length: 0 }

let id = 0
let fsIndex = 0

const idsToTryMove: number[] = []

for (let i=0;i<input.length;i+=2) {
  const fileLength = input[i]
  const blankLength = input[i+1]
  idsToTryMove.push(id)

  fs.files.push({
    id: id++,
    length: fileLength,
    startIndex: fsIndex
  })
  fsIndex += fileLength
  if (blankLength){
    fs.blanks.push({
      length: blankLength,
      startIndex: fsIndex
    })
    fsIndex += blankLength
  }
}
fs.length = fsIndex 

while (idsToTryMove.length > 0) {
  const idToTryMove = idsToTryMove.pop()
  const targetFileToMove = fs.files.find(f => f.id === idToTryMove) as File

  const suitableBlank = fs.blanks.find(blank => blank.length >= targetFileToMove.length && blank.startIndex < targetFileToMove.startIndex)

  if (suitableBlank) {
    targetFileToMove.startIndex = suitableBlank.startIndex
    suitableBlank.length -= targetFileToMove.length
    suitableBlank.startIndex += targetFileToMove.length
  }
}

const getFileAtIndex = (fs:FileSystem, requestIndex: number): File | null => 
  fs.files.find(file => requestIndex >= file.startIndex && requestIndex < file.startIndex + file.length) ?? null

const getChecksum = (fs: FileSystem) => {
  let sum = 0

  for (let i=0;i<fs.length;i++) {
    const fileAtIndex = getFileAtIndex(fs, i)
    if (fileAtIndex) {
      sum += i * fileAtIndex.id
    }
  }
  return sum
}
console.log(getChecksum(fs))
