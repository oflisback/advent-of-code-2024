const input = (await Deno.readTextFile('../input/9/example-2.txt')).split('').slice(0, -1).map(d => parseInt(d));

type File = {
  id: number
  length: number
  // number är index på fs, andra number är length i detta blocket
  blocks: Record<number, number>
}

type Blank = {
  length: number
  startIndex: number
}

type FileSystem = {
  files: File[]
  blanks: Blank[]
  firstAvailableIndex: number
  lastAvailableIndex: number
  length: number
}

const fs: FileSystem = { blanks: [],files: [], firstAvailableIndex: 0, lastAvailableIndex: 0,length: 0 }


// facit: 0099811188827773336446555566..............
// mitt : 0099811188827773336446555566..............

const getFileAtIndex = (fs:FileSystem, requestIndex: number): File => {
  let targetFile: fs.files[0]
  for (let i=0;i<fs.files.length;i++) {
    const file = fs.files[i]

    Object.entries(file.blocks).forEach(([blockIndex, length]) => {
    if (requestIndex >= parseInt(blockIndex) && requestIndex < parseInt(blockIndex) + length) {
      targetFile = file
    }
    })
  }
  return targetFile
}

const getChecksum = (fs: FileSystem) => {
  let sum = 0

  for (let i=0;i<fs.lastAvailableIndex;i++) {
//    console.log('adding: ', getFileAtIndex(fs, i).id)
      sum += i * getFileAtIndex(fs, i).id
    }
  return sum
}


const removeBlankIndex = (fs: FileSystem, removeIndex: number) => {
//  console.log('blanks before remove: ', fs.blanks)
//  console.log('targeting remove index: ', removeIndex)
  let targetBlank: Blank | null = null
  let targetBlankIndex = -1
  for (let i=0;i<fs.blanks.length;i++) {
    const blank = fs.blanks[i]
    if (removeIndex >= blank.startIndex && removeIndex <= blank.startIndex + blank.length) {
      targetBlank = blank
      targetBlankIndex = i
    }
  }
//  console.log('targetBlank: ', targetBlank)
//  console.log('targetBlankIndex: ', targetBlankIndex)
  if (!targetBlank) {
    throw new Error("Failed to find blank")
  }
  targetBlank!.length--
  if (targetBlank!.length === 0) {
//    console.log('removing blank because length 0')
    fs.blanks.splice(targetBlankIndex, 1);
  } else {
//    console.log('moving blank start one step to the right')
    targetBlank!.startIndex++
  }
//  console.log('blanks after remove: ', fs.blanks)
}

const findFirstBlankIndex = (fs: FileSystem) => {
  let firstBlankIndex = 100_000
  for (let i=0;i<fs.blanks.length;i++) {
    const blank = fs.blanks[i]
    if (blank.startIndex <firstBlankIndex) {
      firstBlankIndex = blank.startIndex
    }
  }
  return firstBlankIndex
}

const findLastBlankIndex = (fs: FileSystem) => {
  let lastBlankIndex = -1
  for (let i=0;i<fs.blanks.length;i++) {
    const blank = fs.blanks[i]
    if (blank.startIndex >lastBlankIndex) {
      lastBlankIndex = blank.startIndex + blank.length
    }
  }
  return lastBlankIndex
}

const removeLeftOverBlanksFrom = (fs: FileSystem, cutoff: number) => {
  for (let i=0;i<fs.blanks.length;i++) {
    const blank = fs.blanks[i]
    if (blank.startIndex >cutoff) {
      fs.blanks.splice(i, 1)
    }
  }
}

const getBlockAtIndexIndex = (file: File, targetIndex: number) => {
  let targetBlockIndex: number | null = null
  Object.entries(file.blocks).forEach(([blockIndexStr, length]) => {
    const blockIndex = parseInt(blockIndexStr)
    if (targetIndex >= blockIndex || targetIndex <= blockIndex + length) {
      targetBlockIndex = blockIndex
    }
  })
  return targetBlockIndex
}

let id = 0
let fsIndex = 0

fs.firstAvailableIndex = input[0]

for (let i=0;i<input.length;i+=2) {
  const fileLength = input[i]
  const blankLength = input[i+1]

  console.log('fileLength: ', fileLength)
  console.log('blankLength: ', blankLength)
  fs.files.push({
    id: id++,
    length: fileLength,
    blocks: { [fsIndex]: fileLength}
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

console.log(fs.length)
console.log(input)

String.prototype.replaceAt = function(index: number, replacement: string) {
  const part1 = this.substring(0, index)
  const part2 = replacement
  const lastParam = index + replacement.length
  const part3 = this.substring(lastParam)

    return  part1 + part2 + part3;
}

const printFs = (fs: FileSystem) => {
  let representation = ".".repeat(fs.length)

  for (const file of fs.files) {
    // Key becomes string!!!11111111
    for (const [index, length] of Object.entries(file.blocks)) {
      representation = representation.replaceAt(parseInt(index), `${file.id}`.repeat(length))
    }
  }

  console.log(representation)
}

let i =0;

console.log('firstAvailableIndex: ', fs.firstAvailableIndex)

while (true) {
  console.log('--- new round ---')
  console.log('first available: ', fs.firstAvailableIndex)
  console.log('last available: ', fs.lastAvailableIndex)
//  console.log('nbr blanks: ', Object.keys(fs.blanks).length)
//  printFs(fs)
  i++
  let targetFileToMove: File | null = null
  let blockIndexStart = 0
  fs.files.forEach(file => {
    Object.keys(file.blocks).forEach((index) => {
      if (parseInt(index) > blockIndexStart) {
      blockIndexStart = parseInt(index)
      targetFileToMove = file
      }
    })
  })

  const lastBlankIndex = findLastBlankIndex(fs)

  if (fs.firstAvailableIndex === fs.lastAvailableIndex - 1 || lastBlankIndex === -1) {
    break
  }

  removeLeftOverBlanksFrom(fs, blockIndexStart)

  targetFileToMove!.blocks[blockIndexStart] -= 1

  const sameFileBlockAtPrevIndexIndex = getBlockAtIndexIndex(targetFileToMove!, fs.firstAvailableIndex - 1)
  if (sameFileBlockAtPrevIndexIndex) {
    // Extend the existing block by one
    targetFileToMove!.blocks[sameFileBlockAtPrevIndexIndex] += 1
  } {
    // Create a new block at that index
    targetFileToMove!.blocks[fs.firstAvailableIndex] = 1
  }
  try {
  removeBlankIndex(fs, fs.firstAvailableIndex)
  } catch (e) {
    break
  }
  // Reduce the moved block length by one
  // Skip updating blanks, we don't care about what's after fs.lastAvailableIndex anyway
  targetFileToMove!.blocks[blockIndexStart]--
  fs.lastAvailableIndex = blockIndexStart + targetFileToMove!.blocks[blockIndexStart]
  if (targetFileToMove!.blocks[blockIndexStart] === 0) {
    delete targetFileToMove!.blocks[blockIndexStart]
  }


  // Move the available index to the next available one.
  fs.firstAvailableIndex = findFirstBlankIndex(fs)
}

console.log(getChecksum(fs))

