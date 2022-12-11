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
            start: start.match(/\d+/g)!.map(Number),
            operation: op.split("=")[1],
            test: (result:number) => (result % Number(testSplit[testSplit.length - 1]) === 0)
                ? Number(trueSplit[trueSplit.length - 1])
                : Number(falseSplit[falseSplit.length - 1]),
            inspections: 0
        }

        return acc
    }, {} as Record<number, {
        start: number[],
        operation: string,
        test: (result:number) => number
        inspections: number
    }>);

[...Array(20).keys()].forEach((_) => {
    Object.entries(monks).forEach(([key, _]) => {
        const monk = monks[Number(key)]
        monk.start.forEach(value => {
            const result = Math.floor(eval(monk.operation.replaceAll("old", value.toString())) / 3)
            const testResult = monk.test(result)
            monks[testResult] = {...monks[testResult], start: [...monks[testResult].start, result]}
            monk.inspections++
        })

        monks[Number(key)] = {...monk, start: []}
    })
})

console.log(Object.entries(monks).map(([_, val]) => val.inspections).sort((a, b) => b - a).slice(0, 2).reduce((acc, val) => acc * val, 1));