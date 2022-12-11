const text = await Deno.readTextFile("./Day11/input.txt")
const items = text.split("Monkey")

const monks = items
    .map(line => line.split("\r\n"))
    .reduce((acc, [monk, start, op, test, testTrue, testFalse]) => {
        if (!monk) return acc
        const testSplit = test.split(" ")
        const trueSplit = testTrue.split(" ")
        const falseSplit = testFalse.split(" ")

        acc[Number(monk[1])] = {
            start: start.match(/\d+/g)!.map(BigInt),
            operation: op.split("=")[1],
            mod: Number(testSplit[testSplit.length - 1]),
            test: (result:bigint) => (result % BigInt(testSplit[testSplit.length - 1]) === BigInt(0))
                ? Number(trueSplit[trueSplit.length - 1])
                : Number(falseSplit[falseSplit.length - 1]),
            inspections: 0
        }

        return acc
    }, {} as Record<number, {
        start: bigint[],
        operation: string,
        mod: number,
        test: (result:bigint) => number
        inspections: number
    }>)

const mod = Object.entries(monks).reduce((acc, [_, val]) => acc * val.mod, 1);

[...Array(10000).keys()].forEach((_) => {
    Object.entries(monks).forEach(([key, _]) => {
        const monk = monks[Number(key)]
        monk.start.forEach(value => {
            const result = eval(monk.operation.replaceAll("old", value.toString()))
            const testResult = monk.test(BigInt(result))
            monks[testResult] = {...monks[testResult], start: [...monks[testResult].start, BigInt(result) % BigInt(mod)]}
            monk.inspections++
        })

        monks[Number(key)] = {...monk, start: []}
    })
})

console.log(Object.entries(monks).map(([_, val]) => val.inspections).sort((a, b) => b - a).slice(0, 2).reduce((acc, val) => acc * val, 1))