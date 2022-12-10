const text = await Deno.readTextFile("./Day10/input.txt")
const items = text.split("\r\n")

// Build queue
const grid = items
    .map((item) => item.split(" "))
    .reduce((acc, [action, value]) => {
        action === "noop"
            ? acc.push(0)
            : acc.push(0, Number(value))
        return acc
    }, [] as number[])
    .reduce((acc, item) => {
        // Print value
        if (acc.cycleCounter === (acc.regX - 1) || 
            acc.cycleCounter === (acc.regX + 1) || 
            acc.cycleCounter === acc.regX) {
                acc.line[acc.cycleCounter] = "#"
        } else {
            acc.line[acc.cycleCounter] = "."
        }

        // Increase cycle counter
        acc.cycleCounter++

        // On line break, add line to total and reset line
        if (acc.cycleCounter % 40 === 0 && acc.cycleCounter !== 0) {
            acc.totals.push(acc.line)
            acc.line = []
            acc.cycleCounter = 0
        }

        acc.regX += item

        return acc
    }, {
        totals: [] as string[][],
        line: [] as string[],
        cycleCounter: 0,
        regX: 1
    })

console.log(grid.totals.map(line => line.join(" ")))