const text = await Deno.readTextFile('../input/2/input.txt');

const reportOk = (report: number[]) => {
	for (let i = 1; i < report.length; i++) {
		const diff = Math.abs(report[i] - report[i - 1]);
		if (diff > 3 || diff < 1) {
			return false;
		}
		if (report[1] > report[0]) {
			if (report[i] < report[i - 1]) {
				return false;
			}
		} else {
			if (report[i] > report[i - 1]) {
				return false;
			}
		}
	}
	return true;
};

const numbers = text
	.split('\n')
	.slice(0, -1)
	.map((row) => row.split(' ').map((c) => parseInt(c)));

const getNbrValidReports = (allowAnError: boolean) =>
	numbers.filter((report) => {
		if (reportOk(report)) {
			return true;
		}
		if (!allowAnError) {
			return false;
		}

		for (let i = 0; i < report.length; i++) {
			const subReport = [...report];
			subReport.splice(i, 1);
			if (reportOk(subReport)) {
				return true;
			}
		}
		return false;
	}).length;

console.log(getNbrValidReports(false));
console.log(getNbrValidReports(true));
