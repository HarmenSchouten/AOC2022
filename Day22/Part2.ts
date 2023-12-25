const text = await Deno.readTextFile("./Day22/input.txt")

type Node = {
    x: number
    y: number
    side: string
    value: string
    isWall: boolean
    isEdge: boolean
}

const A = "A", B = "B", C = "C", D = "D", E = "E", F = "F", R = "R", L = "L", U = "U"

const faceMap = {
    A: { x: 0, y: 0 },
    B: { x: 50, y: 0 },
    C: { x: 50, y: 50 },
    D: { x: 0, y: 100 },
    E: { x: 50, y: 100 },
    F: { x: 0, y: 150 }
} as Record<string, {x: number, y: number}>

const SIZE = 50

const directionMap = { R: 90, L: 270, U: 0, D: 180 } as Record<string, number>

const directionScoreMap = { R: 0, D: 1, L: 2, U: 3 } as Record<string, number>

const [mapRaw, instructionsRaw] = text.split("\r\n\r\n")

const mapLines = mapRaw.split("\r\n")
const linesCubeSideAB = mapLines.slice(0, 50).map(item => item.trim())
const cubeLinesA = linesCubeSideAB
    .map(item => item.slice(0, 50))
    .flatMap((item, y) => [...item].map((item, x) => ({ 
        x: x + 1, y: y + 1, side: A, value: item, isWall: item === "#"  
    } as Node)))

const cubeLinesB = linesCubeSideAB
    .map(item => item.slice(50))
    .flatMap((item, y) => [...item].map((item, x) => ({ 
        x: x + 1, y: y + 1, side: B, value: item, isWall: item === "#" 
    } as Node)))

const cubeLinesC = mapLines
    .slice(50, 100)
    .map(item => item.trim())
    .flatMap((item, y) => [...item].map((item, x) => ({
        x: x + 1, y: y + 1, side: C, value: item, isWall: item === "#" 
    } as Node)))

const cubeLinesDE = mapLines.slice(100, 150).map(item => item.trim())

const cubeLinesD = cubeLinesDE
    .map(item => item.slice(0, 50))
    .flatMap((item, y) => [...item].map((item, x) => ({
        x: x + 1, y: y + 1, side: D, value: item, isWall: item === "#" 
    } as Node)))

const cubeLinesE = cubeLinesDE
    .map(item => item.slice(50))
    .flatMap((item, y) => [...item].map((item, x) => ({
        x: x + 1, y: y + 1, side: E, value: item, isWall: item === "#" 
    } as Node)))

const cubeLinesF = mapLines
    .slice(150)
    .map(item => item.trim())
    .flatMap((item, y) => [...item].map((item, x) => ({
        x: x + 1, y: y + 1, side: F, value: item, isWall: item === "#"
    } as Node)))

const instructions = [...instructionsRaw.matchAll(/[A-Z]|\d+/g)]
    .map(match => ({
        isDirection: match[0].match(/[A-Z]/) !== null,
        value: match[0]
    }))

const cube = [...cubeLinesA, ...cubeLinesB, ...cubeLinesC, ...cubeLinesD, ...cubeLinesE, ...cubeLinesF] as Node[]

const getNextPoint = (x: number, y: number, side: string, direction: string) => {
    if (side === A && x === SIZE && direction === R) return {
        node: cube.find(item => item.x === 1 && item.y === y && item.side === B)!,
        direction: R
    }
    if (side === A && x === 1 && direction === L) return {
        node: cube.find(item => item.x === 1 && item.y === SIZE - y && item.side === D)!,
        direction: R
    }
    if (side === A && y === 1 && direction === U) return {
        node: cube.find(item => item.x === 1 && item.y === x && item.side === F)!,
        direction: R
    }
    if (side === A && y === SIZE && direction === D) return {
        node: cube.find(item => item.x === 1 && item.y === x && item.side === C)!,
        direction: D
    }

    if (side === B && x === SIZE && direction === R) return {
        node: cube.find(item => item.x === SIZE && item.y === SIZE - y && item.side === E)!,
        direction: L
    }
    if (side === B && x === 1 && direction === L) return {
        node: cube.find(item => item.x === SIZE && item.y === y && item.side === A)!,
        direction: direction
    }
    if (side === B && y === 1 && direction === U) return {
        node: cube.find(item => item.x === x && item.y === SIZE && item.side === F)!,
        direction: U
    }
    if (side === B && y === SIZE && direction === D) return {
        node: cube.find(item => item.x === SIZE && item.y === x && item.side === C)!,
        direction: L
    }

    if (side === C && x === SIZE && direction === R) return {
        node: cube.find(item => item.x === y && item.y === SIZE && item.side === B)!,
        direction: U
    }
    if (side === C && x === 1 && direction === L) return {
        node: cube.find(item => item.x === y && item.y === 1 && item.side === D)!,
        direction: D
    }
    if (side === C && y === 1 && direction === U) return {
        node: cube.find(item => item.x === x && item.y === SIZE && item.side === A)!,
        direction: direction
    }
    if (side === C && y === SIZE && direction === D) return {
        node: cube.find(item => item.x === x && item.y === 1 && item.side === E)!,
        direction: D
    }

    if (side === D && x === SIZE && direction === R) return {
        node: cube.find(item => item.x === 1 && item.y === y && item.side === E)!,
        direction: R
    }
    if (side === D && x === 1 && direction === L) return  {
        node: cube.find(item => item.x === 1 && item.y === SIZE - y && item.side === A)!,
        direction: R
    }
    if (side === D && y === 1 && direction === U) return {
        node: cube.find(item => item.x === 1 && item.y === x && item.side === C)!,
        direction: R
    }
    if (side === D && y === SIZE && direction === D) return {
        node: cube.find(item => item.x === 1 && item.y === x && item.side === F)!,
        direction: D
    }

    if (side === E && x === SIZE && direction === R) return {
        node: cube.find(item => item.x === SIZE && item.y === SIZE - y && item.side === B)!,
        direction: L
    }
    if (side === E && x === 1 && direction === L) return {
        node: cube.find(item => item.x === SIZE && item.y === y && item.side === D)!,
        direction: L
    }
    if (side === E && y === 1 && direction === U) return {
        node: cube.find(item => item.x === x && item.y === SIZE && item.side === C)!,
        direction: U
    }
    if (side === E && y === SIZE && direction === D) return {
        node: cube.find(item => item.x === SIZE && item.y === x && item.side === F)!,
        direction: L
    }

    if (side === F && x === SIZE && direction === R) return {
        node: cube.find(item => item.x === y && item.y === SIZE && item.side === E)!,
        direction: U
    }
    if (side === F && x === 1 && direction === L) return {
        node: cube.find(item => item.x === y && item.y === 1 && item.side === A)!,
        direction: D
    }
    if (side === F && y === 1 && direction === U) return {
        node: cube.find(item => item.x === x && item.y === SIZE && item.side === D)!,
        direction: U
    }
    if (side === F && y === SIZE && direction === D) return {
        node: cube.find(item => item.x === x && item.y === 1 && item.side === B)!,
        direction: D
    }
}

const startNode = cube.find(node => node.x === 1 && node.y === 1 && node.side === A)!
let direction = R
let currentNode = {...startNode}
instructions.forEach(instruction => {
    if (instruction.isDirection) {
        const currentDirection = directionMap[direction]
        const newDirection = instruction.value === R
            ? currentDirection + 90
            : currentDirection - 90 + 360
        direction = Object.keys(directionMap).find(key => directionMap[key] === newDirection % 360)!
    } else {
        const steps = Number(instruction.value)
        for (let i = 0; i < steps; i++) {
            let nextNode:Node | undefined = undefined
            let directionOverride: string | undefined = undefined
            switch (direction) {
                case R:
                    {
                        nextNode = cube.find(item => item.x === currentNode.x + 1 && item.y === currentNode.y && item.side === currentNode.side)
                        if (!nextNode) {
                            const {node, direction: newDirection} = getNextPoint(currentNode.x, currentNode.y, currentNode.side, direction)!
                            nextNode = node
                            directionOverride = newDirection
                        }
                        break;
                    }
                case L:
                    {
                        nextNode = cube.find(item => item.x === currentNode.x - 1 && item.y === currentNode.y && item.side === currentNode.side)
                        if (!nextNode) {
                            const {node, direction: newDirection} = getNextPoint(currentNode.x, currentNode.y, currentNode.side, direction)!
                            nextNode = node
                            directionOverride = newDirection
                        }
                        break;
                    }
                case U:
                    {
                        nextNode = cube.find(item => item.x === currentNode.x && item.y === currentNode.y - 1 && item.side === currentNode.side)
                        if (!nextNode) {
                            const {node, direction: newDirection} = getNextPoint(currentNode.x, currentNode.y, currentNode.side, direction)!
                            nextNode = node
                            directionOverride = newDirection
                        }
                        break;
                    }
                case D:
                    {
                        nextNode = cube.find(item => item.x === currentNode.x && item.y === currentNode.y + 1 && item.side === currentNode.side)
                        if (!nextNode) {
                            const {node, direction: newDirection} = getNextPoint(currentNode.x, currentNode.y, currentNode.side, direction)!
                            nextNode = node
                            directionOverride = newDirection
                        }
                        break;
                    }
            }
            if (nextNode?.isWall) {
                break;
            }
            if (nextNode) {
                currentNode = nextNode!
                direction = directionOverride ?? direction
            }
        }
    }
})

const row = currentNode.y + faceMap[currentNode.side].y
const col = currentNode.x + faceMap[currentNode.side].x
const dir = directionScoreMap[direction]
const answer = (row * 1000) + (col * 4) + dir

console.log(answer)