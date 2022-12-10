const text = await Deno.readTextFile("./Day9/input.txt")
const items = text.split("\r\n")

type Coord = {
    x: number
    y: number
}

let head = {x: 0, y: 0} as Coord
let tail = {x: 0, y: 0} as Coord

const visitedCoord = [] as Coord[]

const updateCoord = (coord: Coord, direction: string) => {
    switch (direction) {
        case "R":
            coord.x += 1
            break;
        case "L":
            coord.x -= 1
            break;
        case "U":
            coord.y += 1
            break;
        case "D":
            coord.y -= 1
            break;
    }

    return coord
}

const adjacents = (coord: Coord) => [
    {x: coord.x + 1, y: coord.y},
    {x: coord.x - 1, y: coord.y},
    {x: coord.x, y: coord.y + 1},
    {x: coord.x, y: coord.y - 1},
    {x: coord.x + 1, y: coord.y + 1},
    {x: coord.x - 1, y: coord.y - 1},
    {x: coord.x - 1, y: coord.y + 1},
    {x: coord.x + 1, y: coord.y - 1}
]

items
    .map(line => line.split(" "))
    .reduce((acc, [direction, distance]) => {
        for (let i = 1; i <= Number(distance); i++) {
            head = updateCoord(head, direction)

            if (!adjacents(head).some(adj => adj.x === tail.x && adj.y === tail.y)) {
                if (head.x - tail.x == 2 && head.y === tail.y) {
                    tail = updateCoord(tail, direction)
                } else if (head.x - tail.x == -2 && head.y === tail.y) {
                    tail = updateCoord(tail, direction)
                } else if (head.y - tail.y == 2 && head.x === tail.x) {
                    tail = updateCoord(tail, direction)
                } else if (tail.y - head.y == 2 && head.x === tail.x) {
                    tail = updateCoord(tail, direction)
                } else {
                    if (head.x < tail.x) {
                        tail = updateCoord(tail, "L")
                    }
                    if (head.x > tail.x) {
                        tail = updateCoord(tail, "R")
                    }
                    if (head.y < tail.y) {
                        tail = updateCoord(tail, "D")
                    }
                    if (head.y > tail.y) {
                        tail = updateCoord(tail, "U")
                    }
                }
                visitedCoord.push({...tail})
            }
        }

        return acc
}, 0)

console.log(visitedCoord.filter((item,index) => visitedCoord.findIndex(i => item.x === i.x && item.y === i.y) === index).length + 1)