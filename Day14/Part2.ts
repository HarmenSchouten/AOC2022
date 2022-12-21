type Coord = {
    x: number
    y: number
    val: string
}

const text = await Deno.readTextFile("./Day14/input.txt")
const items = text.split("\r\n").map(item => item.split(" -> ").map(item => item.split(",").map(Number)))

const cave = items.reduce((acc, coords) => {
    for (let x = 0; x < coords.length; x++) {
        const next = coords[x + 1]
        if (!next) {
            acc.push({x: coords[x][0], y: coords[x][1], val: "#"})
            continue
        }
        const xDiff = next[0] - coords[x][0]
        const yDiff = next[1] - coords[x][1]

        if (xDiff > 0) {
            for (let i = 0; i < xDiff; i++) {
                acc.push({x: coords[x][0] + i, y: coords[x][1], val: "#"})
            }
        }
        if (yDiff > 0) {
            for (let i = 0; i < yDiff; i++) {
                acc.push({x: next[0], y: coords[x][1] + i, val: "#"})
            }
        }
        if (xDiff < 0) {
            for (let i = 0; i > xDiff; i--) {
                acc.push({x: coords[x][0] + i, y: coords[x][1], val: "#"})
            }
        }
        if (yDiff < 0) {
            for (let i = 0; i > yDiff; i--) {
                acc.push({x: next[0], y: coords[x][1] + i, val: "#"})
            }
        }
    }

    return acc
}, [] as Coord[])

const sandOrigin = {x: 500, y: 0, val: 'o'} as Coord

const x = cave.map(item => item.x);
const y = cave.map(item => item.y);

const minCoords = {
    x : Math.min.apply(null, x),
    y : Math.min.apply(null, y)
}

const maxCoords = {
    x : Math.max.apply(null, x),
    y : Math.max.apply(null, y)
}

console.log(minCoords, maxCoords)

let sandCounter = 0;
while (true) {

    let sandUnit = sandOrigin
    while (sandUnit.y <= maxCoords.y) {
        const canMoveDown = !cave.find(item => (item.x == sandUnit.x) && (item.y == sandUnit.y + 1))
        if (!canMoveDown) {
            const canMoveDownLeft = !cave.find(item => (item.x == sandUnit.x - 1) && (item.y == sandUnit.y + 1))
            if (!canMoveDownLeft) {
                const canMoveDownRight = !cave.find(item => (item.x == sandUnit.x + 1) && (item.y == sandUnit.y + 1))
                if (!canMoveDownRight) {
                    break;
                } else {
                    sandUnit = {x: sandUnit.x + 1, y: sandUnit.y + 1, val: "o"}
                }
            } else {
                sandUnit = {x: sandUnit.x - 1, y: sandUnit.y + 1, val: "o"}
            }
        } else {
            sandUnit = {x: sandUnit.x, y: sandUnit.y + 1, val: "o"}
        }
    }
    if (sandUnit.y <= (maxCoords.y + 2) && !(sandUnit.x === sandOrigin.x && sandUnit.y === sandOrigin.y)) {
        cave.push(sandUnit)
        sandCounter += 1
    } else {
        break;
    }
}
console.log(sandCounter + 1)

const x1 = cave.map(item => item.x);
const y1 = cave.map(item => item.y);

const minCoords1 = {
    x : Math.min.apply(null, x1),
    y : Math.min.apply(null, y1)
}

const maxCoords1 = {
    x : Math.max.apply(null, x1),
    y : Math.max.apply(null, y1)
}

const caveChars = [] as string[]
for(let j = 0; j <= maxCoords1.y + 1; j++) {
    for(let i = minCoords1.x-1; i <= maxCoords1.x + 1; i++){
        const item = cave.find(item => (item.x == i) && (item.y == j))
        if (item?.val == "#") {
            caveChars.push(`\x1b[31m${item.val}`)
        } else if (item?.val == "o") {
            caveChars.push(`\x1b[33m${item.val}`)
        } else {
            caveChars.push("\x1b[30m.")
        }
    }
    caveChars.push("\r\n")
}


console.log(caveChars.join(""), "color:yellow")