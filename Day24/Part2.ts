const text = await Deno.readTextFile("./Day24/input.txt")

const lines = text.split("\r\n")
const lineLength = lines[0].length - 1

const ogMap = lines
    .flatMap((line, y) => [...line].map((char, x) => ({ x, y, char, isField: char !== "#" })))

const startNode = ogMap.find(item => item.y === 0 && item.char === ".")!
startNode.char = "E"
const endNode = ogMap.find(item => item.y === lines.length - 1 && item.char === ".")!

const doStep = (map: typeof ogMap):typeof ogMap => {
    const blizzards = map.filter(item => 
        item.char.includes(">")
        || item.char.includes("<")
        || item.char.includes("^")
        || item.char .includes("v"))

    const mapCopy = [...map].map(item => ({...item, char: (item.char !== "." && item.char !== "#") ? '.' : item.char}))
    blizzards.forEach(b => {
        const options = [...b.char]
        options.forEach(option => {
            switch (option) {
                case "<":
                    {
                        let nextPosition = mapCopy.find(item => item.x === b.x - 1 && item.y === b.y)!
                        if (!nextPosition.isField) {
                            const lastIndex = mapCopy.findLastIndex(item => item.x === lineLength - 1 && item.y === nextPosition.y)
                            nextPosition = mapCopy[lastIndex]!
                        }
                        if (nextPosition.char === ".") {
                            nextPosition.char = "<"
                        } else {
                            nextPosition.char = nextPosition.char + option
                        }
                        break;
                    }
                case ">": 
                    {
                        let nextPosition = mapCopy.find(item => item.x === b.x + 1 && item.y === b.y)!

                        if (!nextPosition.isField) {
                            const firstIndex = mapCopy.findIndex(item => item.x === 1 && item.y === nextPosition.y)
                            nextPosition = mapCopy[firstIndex]!
                        }
                        if (nextPosition.char === ".") {
                            nextPosition.char = ">"
                        } else {
                            nextPosition.char = nextPosition?.char + option
                        }
                        break;
                    }
                case "^": 
                    {
                        let nextPosition = mapCopy.find(item => item.x === b.x && item.y === b.y - 1)!

                        if (!nextPosition.isField) {
                            const lastIndex = mapCopy.findLastIndex(item => item.x === nextPosition.x && item.isField)
                            nextPosition = mapCopy[lastIndex]!
                        }
                        if (nextPosition.char === ".") {
                            nextPosition.char = "^"
                        } else {
                            nextPosition.char = nextPosition.char + option
                        }
                        break;
                    }
                case "v": 
                    {
                        let nextPosition = mapCopy.find(item => item.x === b.x && item.y === b.y + 1)!

                        if (!nextPosition.isField) {
                            const lastIndex = mapCopy.findIndex(item => item.x === nextPosition.x && item.isField)
                            nextPosition = mapCopy[lastIndex]!
                        }
                        if (nextPosition.char === ".") {
                            nextPosition.char = "v"
                        } else {
                            nextPosition.char = nextPosition.char + option
                        }
                        break;
                    }
            }
        })
    })
    return mapCopy
}

const doRun = (mapp: typeof ogMap, stepStart: number, start: typeof startNode, end: typeof endNode): {map: typeof ogMap, steps: number} => {
    let steps = stepStart;
    let map = mapp
    const myPositions = new Set<string>()
    myPositions.add(`${start.x},${start.y}`)
    while (true) {
        steps++

        const newMap = doStep(map);
        const newPosition = new Set<string>();
        [...myPositions.values()]
            .forEach(item => {
                const [x, y] = item.split(",").map(i => parseInt(i));
                [
                    { x: x, y: y },
                    { x: x - 1, y: y },
                    { x: x + 1, y: y },
                    { x: x, y: y - 1 },
                    { x: x, y: y + 1 }
                ]
                .filter(item => newMap.find(i => i.x === item.x && i.y === item.y)?.char === ".")
                .forEach(item => newPosition.add(`${item.x},${item.y}`)
            )
        })

        const didReachEndNode = [...newPosition.values()]
            .some(map => {
                const [x, y] = map.split(",").map(i => parseInt(i));
                return x === end.x && y === end.y
            })
            
        myPositions.clear()
        for (const map of newPosition) {
            myPositions.add(map)
        }

        map = newMap
        console.log("Step", steps, myPositions.size, map.filter(item => item.char === '.').length)
        if (didReachEndNode) {
            break;
        }

    }
    return {map, steps}
}

const {map:map1, steps} = doRun(ogMap, 0, startNode, endNode)
const {map:map2, steps:steps2} = doRun(map1, steps, endNode, startNode)
const {map:_, steps:steps3} = doRun(map2, steps2, startNode, endNode)

console.log("Steps", steps3)