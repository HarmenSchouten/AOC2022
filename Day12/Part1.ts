const text = await Deno.readTextFile("./Day12/input.txt")
const items = text.split("\r\n")

const grid = items.reduce((acc, line) => [...acc, [...line].reduce((subAcc, number) => [...subAcc, number], [] as string[])], [] as string[][])

type Coord = {
    x: number
    y: number
}

const alphabet = [..."abcdefghijklmnopqrstuvwxyz"]

const findStart = () => {
    for (let i = 0; i < grid.length; i++)
    for (let j = 0; j < grid[i].length; j++)
        if (grid[i][j] === "S") {
            return { x: j, y: i }
        }
}

const findEnd = () => {
    for (let i = 0; i < grid.length; i++)
    for (let j = 0; j < grid[i].length; j++)
        if (grid[i][j] === "E") {
            return { x: j, y: i }
        }
}

const neighbours = (x:number, y:number) => [
    {x: x, y: y - 1},
    {x: x, y: y + 1},
    {x: x - 1, y: y},
    {x: x + 1, y: y},
]

const hasItem = (x: number, y:number, grid: string[][]) => {
    const line = grid[y]
    const item = line?.[x] ?? undefined
    return item ?? undefined
}

const getLowest = (map:Record<string, number>) => {
    const arr = Object.keys(map);
    if (arr.length > 0) {
        const lowestItem = arr.reduce((acc, item) => {
            if (map[item] < map[acc]) {
                return item 
            } else {
                return acc
            }
        })
    
        delete map[lowestItem]
        
        queue = map
    
        return lowestItem    
    }
    return undefined
}

const getString = (value:string) => {
    if (value === "S") {
        return "a"
    }
    if (value === "E") {
        return "z"
    }
    return value
}

const start = findStart()!
const end = findEnd()!

let queue: Record<string, number> = {}
queue[`${start.x}.${start.y}`] = 0

const riskMap = {} as Record<string, number>
riskMap[`${start.x}.${start.y}`] = 0

while (true) {
    const pointString = getLowest(queue)

    if (pointString === undefined) {
        break;
    }

    const point = {
        x: Number(pointString.split('.')[0]),
        y: Number(pointString.split('.')[1])
    } as Coord

    if (point.x === end.x && point.y === end.y) {
        break;
    }

    const adjacent = neighbours(point.x, point.y)
    adjacent.forEach(item => {
        const gridItem = hasItem(item.x, item.y, grid)
        if (gridItem) {
            if (alphabet.indexOf(getString(gridItem)) - alphabet.indexOf(grid[point.y][point.x]) <= 1) {
                const totalRisk = riskMap[`${point.x}.${point.y}`] + 1
                if (totalRisk < (riskMap[`${item.x}.${item.y}`] ?? Number.MAX_SAFE_INTEGER)) {
                    riskMap[`${item.x}.${item.y}`] = totalRisk
                    queue[`${item.x}.${item.y}`] = totalRisk
                }
            }
        }
    })
}

console.log(riskMap[`${end.x}.${end.y}`])