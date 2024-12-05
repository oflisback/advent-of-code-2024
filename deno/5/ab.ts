const text = await Deno.readTextFile("../input/5/input.txt");

const lines: string[] = text.split("\n")
const blankIndex = lines.indexOf("")

const rules = lines.slice(1,blankIndex).map(spec => spec.split("|").map(n => parseInt(n)))
const updates = lines.slice(blankIndex + 1, -1).map(line => line.split(',').map(n => parseInt(n)))

const pageToAfters: Record<number, Set<number>> = {}
for (const [pageBefore, pageAfter] of rules) {
  if (pageToAfters[pageBefore]) {
    pageToAfters[pageBefore].add(pageAfter)
  } else {
    pageToAfters[pageBefore] = new Set([pageAfter])
  }
}

const swap = (update: number[], page1: number, page2: number) => {
  const index1 = update.findIndex(u => u === page1)
  const index2 = update.findIndex(u => u === page2)
  update[index1] = page2
  update[index2] = page1

  return update
}

const checkUpdate = (update: number[]) => {
  const pageToBefores: Record<number, Set<number>> = {}
  const befores: Set<number> = new Set()
  for (const page of update) {
    pageToBefores[page] = new Set(befores)
    const intersection = befores.intersection(pageToAfters[page] || new Set([]))
    if (intersection.size > 0)
  {
      return { ok: false, page1: page, page2: intersection.keys().next().value}
    }
    befores.add(page)
  }
  return { ok: true, page1: 0, page2: 0}
}

let mids = []
for (const update of updates) {
  const { ok } = checkUpdate(update)
  if (ok) {
      mids.push(update[(update.length-1) / 2])
  }
}
console.log('a: ' + mids.reduce((acc, v) => acc + v, 0))

mids = []

for (let update of updates) {
  let ok = false
  let okFromTheStart = true
  while (!ok) {
    const res = checkUpdate(update)
    ok = res.ok
    if (ok) {
      break
    }
    okFromTheStart = false
    update = swap(update, res.page1, res.page2 as number)
  }
  if (!okFromTheStart) {
      mids.push(update[(update.length-1) / 2])
  }
}

console.log('b: ' + mids.reduce((acc, v) => acc + v, 0))
