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
            let nextPosition = {} as typeof startNode;
            switch (option) {
                case "<":
                    {
                        nextPosition = mapCopy.find(item => item.x === b.x - 1 && item.y === b.y)!
                        if (!nextPosition.isField) {
                            const lastIndex = mapCopy.findLastIndex(item => item.x === lineLength - 1 && item.y === nextPosition.y)
                            nextPosition = mapCopy[lastIndex]!
                        }
                        break;
                    }
                case ">": 
                    {
                        nextPosition = mapCopy.find(item => item.x === b.x + 1 && item.y === b.y)!

                        if (!nextPosition.isField) {
                            const firstIndex = mapCopy.findIndex(item => item.x === 1 && item.y === nextPosition.y)
                            nextPosition = mapCopy[firstIndex]!
                        }
                        break;
                    }
                case "^": 
                    {
                        nextPosition = mapCopy.find(item => item.x === b.x && item.y === b.y - 1)!

                        if (!nextPosition.isField) {
                            const lastIndex = mapCopy.findLastIndex(item => item.x === nextPosition.x && item.isField)
                            nextPosition = mapCopy[lastIndex]!
                        }
                        break;
                    }
                case "v": 
                    {
                        nextPosition = mapCopy.find(item => item.x === b.x && item.y === b.y + 1)!

                        if (!nextPosition.isField) {
                            const lastIndex = mapCopy.findIndex(item => item.x === nextPosition.x && item.isField)
                            nextPosition = mapCopy[lastIndex]!
                        }
                        break;
                    }
            }

            if (nextPosition.char === ".") {
                nextPosition.char = option
            } else {
                nextPosition.char = nextPosition.char + option
            }
        })
    })
    return mapCopy
}

let steps = 0;
let map = ogMap
const myPositions = new Set<string>()
myPositions.add(`${startNode.x},${startNode.y}`)
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
            return x === endNode.x && y === endNode.y
        })
        
    myPositions.clear()
    for (const map of newPosition) {
        myPositions.add(map)
    }

    if (didReachEndNode) {
        break;
    }

    map = newMap
    console.log("Step:", steps)
}

console.log("Steps", steps)