const text = await Deno.readTextFile("./Day15/input.txt")

// With some help we did it. I'm the worst at this.
function solve() {
    let data = text.split("\r\n").map(e => /^Sensor at x=(\-?\d+), y=(\-?\d+)\: closest beacon is at x=(\-?\d+), y=(\-?\d+)$/.exec(e)!.slice(1).map(l => parseInt(l)));
    data = data.map(e => [...e, Math.abs(e[0] - e[2]) + Math.abs(e[1] - e[3])]);
    data.sort((a, b) => a[4] - b[4]);
    const max = 4000000;
    for (let j = 0; j < data.length; j++) {
        const d = data[j];
        const e = { minx: Math.max(0, d[0] - d[4] - 1), maxx: Math.min(max, d[0] + d[4] + 1), miny: Math.max(0, d[1] - d[4] - 1), maxy: Math.min(max, d[1] + d[4] + 1) } as { minx: number, maxx: number, miny: number, maxy: number };
        for (let x = e.minx, y = data[j][1]; (x <= data[j][0]) && (y <= e.miny); x++) {
            if (data.every(e => Math.abs(x - e[0]) + Math.abs(y - e[1]) > e[4])) {
                return x * 4000000 + y;
            }
            y--
        }

        for (let x = e.maxx, y = data[j][1]; (x >= data[j][0]) && (y <= e.maxy); x--) {
            if (data.every(e => Math.abs(x - e[0]) + Math.abs(y - e[1]) > e[4])) {
                return x * 4000000 + y;
            }
            y++;
        }

        for (let x = data[j][0], y = e.miny; (x <= e.maxx) && (y <= data[j][1]); x++) { 
            if (data.every(e => Math.abs(x - e[0]) + Math.abs(y - e[1]) > e[4])) {
                return x * 4000000 + y;
            } 
            y++; 
        }
        
        for (let x = data[j][0], y = e.maxy; (x >= e.minx) && (y >= data[j][1]); x--) { 
            if (data.every(e => Math.abs(x - e[0]) + Math.abs(y - e[1]) > e[4])) {
                return x * 4000000 + y;
            } 
            y--; 
        }
    }
}

console.log(solve())