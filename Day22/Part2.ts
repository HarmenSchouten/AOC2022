const text = await Deno.readTextFile("./Day22/input.txt")

const directionMap = { R: 90, L: 270, U: 0, D: 180 } as Record<string, number>

const directionScoreMap = { R: 0, D: 1, L: 2, U: 3 } as Record<string, number>

const [mapRaw, instructionsRaw] = text.split("\r\n\r\n")

const mapLines = mapRaw.split("\r\n")
const linesCubeSideAB = mapLines.slice(0, 50).map(item => item.trim())
const cubeLinesA = linesCubeSideAB
    .map(item => item.slice(0, 50))
    .flatMap((item, y) => [...item].map((item, x) => ({ 
        x: x, y: y, side: "A", value: item, isWall: item === "#", right: "B", left: "X", up: "X", down: "X" 
    })))

const cubeLinesB = linesCubeSideAB
    .map(item => item.slice(50))
    .flatMap((item, y) => [...item].map((item, x) => ({ 
        x: x, y: y, side: "B", value: item, isWall: item === "#", right: "X", left: "A", up: "X", down: "X" 
    })))

const cubeLinesC = mapLines
    .slice(50, 100)
    .map(item => item.trim())
    .flatMap((item, y) => [...item].map((item, x) => ({
        x: x, y: y, side: "C", value: item, isWall: item === "#", right: "D", left: "X", up: "A", down: "X"
    })))

const cubeLinesDE = mapLines.slice(100, 150).map(item => item.trim())

const cubeLinesD = cubeLinesDE
    .map(item => item.slice(0, 50))
    .flatMap((item, y) => [...item].map((item, x) => ({
        x: x, y: y, side: "D", value: item, isWall: item === "#", right: "E", left: "X", up: "B", down: "X"
    })))

const cubeLinesE = cubeLinesDE
    .map(item => item.slice(50))
    .flatMap((item, y) => [...item].map((item, x) => ({
        x: x, y: y, side: "E", value: item, isWall: item === "#", right: "X", left: "D", up: "C", down: "X"
    })))

const cubeLinesF = mapLines
    .slice(150)
    .map(item => item.trim())
    .flatMap((item, y) => [...item].map((item, x) => ({
        x: x, y: y, side: "F", value: item, isWall: item === "#", right: "X", left: "E", up: "X", down: "X"
    })))

const instructions = [...instructionsRaw.matchAll(/[A-Z]|\d+/g)]
    .map(match => ({
        isDirection: match[0].match(/[A-Z]/) !== null,
        value: match[0]
    }))

const cube = [...cubeLinesA, ...cubeLinesB, ...cubeLinesC, ...cubeLinesD, ...cubeLinesE, ...cubeLinesF]

const startNode = cube.find(node => node.x === 0 && node.y === 0 && node.side === "A")!
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
        const steps = Number(instruction.value)
        for (let i = 0; i < steps; i++) {
            let nextNode:typeof currentNode | undefined = undefined
            switch (direction) {
                case "R":
                    {
                        nextNode = cube.find(item => item.x === currentNode.x + 1 && item.y === currentNode.y && item.side === currentNode.side)
                        if (!nextNode) {
                            // Handle side change
                        }
                        break;
                    }
                case "L":
                    {
                        nextNode = cube.find(item => item.x === currentNode.x - 1 && item.y === currentNode.y && item.side === currentNode.side)
                        if (!nextNode) {
                            // Handle side change
                        }
                        break;
                    }
                case "U":
                    {
                        nextNode = cube.find(item => item.x === currentNode.x && item.y === currentNode.y - 1 && item.side === currentNode.side)
                        if (!nextNode) {
                            // Handle side change
                        }
                        break;
                    }
                case "D":
                    {
                        nextNode = cube.find(item => item.x === currentNode.x && item.y === currentNode.y + 1 && item.side === currentNode.side)
                        if (!nextNode) {
                            // Handle side change
                        }
                        break;
                    }
            }
            if (nextNode?.isWall) {
                break;
            }
            currentNode = nextNode!
        }
    }
})

const row = currentNode.y + 1
const col = currentNode.x + 1
const dir = directionScoreMap[direction]!
const answer = (row * 1000) + (col * 4) + dir

console.log(answer)