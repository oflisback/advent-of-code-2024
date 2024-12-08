const text = await Deno.readTextFile('../input/8/input.txt');

const grid: string[][] = text.split('\n').map((line) => line.split('')).slice(0, -1);

type Coord = { x: number; y: number };

const withinBounds = (c: Coord) => c.x >= 0 && c.y >= 0 && c.x < grid[0].length && c.y < grid[1].length;

const freqPositions: Record<string, Coord[]> = {};

for (let x = 0; x < grid[0].length; x++) {
	for (let y = 0; y < grid.length; y++) {
		const freq = grid[y][x];
		if (freq !== '.') {
			if (freqPositions[freq]) {
				freqPositions[freq] = [...freqPositions[freq], { x, y }];
			} else {
				freqPositions[freq] = [{ x, y }];
			}
		}
	}
}

const rep = (c: Coord) => `${c.x}y${c.y}`;

const getNbrAntinodes = (considerResonantHarmonics: boolean) => {
	const antinodes = new Set<string>([]);

	Object.values(freqPositions).forEach((positions) => {
		for (const p1 of positions) {
			for (const p2 of positions) {
				if (p1 !== p2) {
					const step = { x: p1.x - p2.x, y: p1.y - p2.y };
					let i = considerResonantHarmonics ? 0 : 1;
					while (true) {
						const cand = { x: p1.x + i * step.x, y: p1.y + i * step.y };
						if (withinBounds(cand)) {
							antinodes.add(rep(cand));
						} else {
							break;
						}
						if (!considerResonantHarmonics) {
							break;
						}
						i++;
					}
				}
			}
		}
	});
	return antinodes.size;
};

console.log(getNbrAntinodes(false));
console.log(getNbrAntinodes(true));
