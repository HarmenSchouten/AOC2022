const text = await Deno.readTextFile("./Day10/input.txt")
const items = text.split("\r\n")

// Build queue
const signalStrengths = items
    .map((item) => item.split(" "))
    .reduce((acc, [action, value]) => {
        action === "noop"
            ? acc.push(0)
            : acc.push(0, Number(value))
        return acc
    }, [] as number[])
    .reduce((acc, item) => {
        acc.cycleCounter++

        if (acc.limits.includes(acc.cycleCounter)) {
            acc.signalStrength += (acc.cycleCounter * acc.regX)
        }

        acc.regX += item

        return acc
    }, {
        cycleCounter: 0,
        regX: 1,
        signalStrength: 0,
        limits: [20, 60, 100, 140, 180, 220]
    } )

console.log(signalStrengths.signalStrength)