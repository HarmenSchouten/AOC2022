const text = await Deno.readTextFile("./Day22/input.txt")

const directionMap = { R: 90, L: 270, U: 0, D: 180 } as Record<string, number>

const directionScoreMap = { R: 0, D: 1, L: 2, U: 3 } as Record<string, number>

const [mapRaw, instructionsRaw] = text.split("\r\n\r\n")

const instructions = [...instructionsRaw.matchAll(/[A-Z]|\d+/g)]
    .map(match => ({
        isDirection: match[0].match(/[A-Z]/) !== null,
        value: match[0]
    }))

const mapLines = mapRaw.split("\r\n")
const supposedLength = mapLines.reduce((acc, state) => Math.max(acc, state.length), 0)

const map = mapLines
    .map(line => line.padEnd(supposedLength, " "))
    .flatMap((line, y) => [...line].map((char, x) => ({ x, y, char, isWall: char === "#", isField: char === ".", isVoid: char === " " })))

const startNode = map.find(node => node.y === 0 && node.isField)!
let direction = "R"
let currentNode = startNode
instructions.forEach(instruction => {
    if (instruction.isDirection) {
        const currentDirection = directionMap[direction]
        const newDirection = instruction.value === "R"
            ? currentDirection + 90
            : currentDirection - 90 + 360
        direction = Object.keys(directionMap).find(key => directionMap[key] === newDirection % 360)!
    } else {
        const steps = parseInt(instruction.value)
        for (let i = 0; i < steps; i++) {
            let nextNode: typeof currentNode | undefined
            switch (direction) {
                case "R": 
                    {
                        nextNode = map.find(item => item.x === currentNode.x + 1 && item.y === currentNode.y)
                        if (!nextNode || nextNode.isVoid) {
                            nextNode = map.find(item => item.y === currentNode.y && !item.isVoid)
                        }
                        break;
                    }
                case "L":
                    {
                        nextNode = map.find(item => item.x === currentNode.x - 1 && item.y === currentNode.y)
                        if (!nextNode || nextNode.isVoid) {
                            nextNode = map.findLast(item => item.y === currentNode.y && !item.isVoid)
                        }
                        break;
                    }
                case "U":
                    {
                        nextNode = map.find(item => item.x === currentNode.x && item.y === currentNode.y - 1)
                        if (!nextNode || nextNode.isVoid) {
                            nextNode = map.findLast(item => item.x === currentNode.x && !item.isVoid)
                        }
                        break;
                    }
                case "D": 
                    {
                        nextNode = map.find(item => item.x === currentNode.x && item.y === currentNode.y + 1)
                        if (!nextNode || nextNode.isVoid) {
                            nextNode = map.find(item => item.x === currentNode.x && !item.isVoid)
                        }
                        break;   
                    }
            }
            if (nextNode?.isWall) break;
            currentNode = nextNode!
        }
    }
})

const row = currentNode.y + 1
const col = currentNode.x + 1
const actualColumn = map.filter(item => item.y === row && item.x < col && item.isVoid).length + col
const dir = directionScoreMap[direction]!
const answer = (row * 1000) + (actualColumn * 4) + dir

console.log(answer)