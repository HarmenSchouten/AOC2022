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
            test: Number(testSplit[testSplit.length - 1]),
            testTrue: Number(trueSplit[trueSplit.length - 1]),
            testFalse: Number(falseSplit[falseSplit.length - 1]),
            inspections: 0
        }

        return acc
    }, {} as Record<number, {
        start: bigint[],
        operation: string,
        test: number
        testTrue: number,
        testFalse: number,
        inspections: number
    }>)

const calculation = (a:bigint, op:string, b:bigint):bigint => {
    switch (op) {
        case "+": return a + b
        case "-": return a - b
        case "*": return a * b
        case "/": return a / b
        default: return 0n
    }
}

const mod = Object.entries(monks).reduce((acc, [_, val]) => acc * val.test, 1);

[...Array(10000).keys()].forEach((_) => {
    Object.entries(monks).forEach(([key, _]) => {
        let monk = monks[Number(key)]
        const values = [...monk.start]
        values.forEach(value => {
            const {start:_start, operation, test, testTrue, testFalse} = monk
            const op = operation.replaceAll("old", value.toString()).split(" ").map(item => item.trim()).filter(item => item !== "")
            const result = calculation(BigInt(op[0]), op[1], BigInt(op[2]))!
            const hmm = BigInt(test)
            if ((result % hmm) !== BigInt(0)) {
                monks[testFalse] = {...monks[testFalse], start: [...monks[testFalse].start, BigInt(result) % BigInt(mod)]}
            } else {
                monks[testTrue] = {...monks[testTrue], start: [...monks[testTrue].start, BigInt(result) % BigInt(mod)]}
            }
            const vals = monk.start
            vals.shift()
            monk = {...monk, start: vals, inspections: monk.inspections + 1}
        })

        monks[Number(key)] = monk
    })
})

console.log(Object.entries(monks).map(([_, val]) => val.inspections).sort((a, b) => b - a).slice(0, 2).reduce((acc, val) => acc * val, 1))