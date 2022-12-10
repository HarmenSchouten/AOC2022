const text = await Deno.readTextFile("./Day9/input.txt")
const items = text.split("\r\n")

type Coord = {
    x: number
    y: number
}

const coords = [] as Coord[]

[...Array(10).keys()].forEach(_ => coords.push({x: 0, y: 0}))

const visitedCoord = [{x: 0, y: 0}] as Coord[]

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
            for (let j = 0; j < coords.length - 1; j++) {
                const h = coords[j]
                const t = coords[j + 1]

                if (j === 0) {
                    coords.splice(j, 1, updateCoord(h, direction))
                }

                if (!adjacents(h).some(adj => adj.x === t.x && adj.y === t.y)) {
                    if (h.x - t.x == 2 && h.y === t.y) {
                        coords.splice(j+1, 1, updateCoord(t, "R"))
                    } else if (h.x - t.x == -2 && h.y === t.y) {
                        coords.splice(j+1, 1, updateCoord(t, "L"))
                    } else if (h.y - t.y == 2 && h.x === t.x) {
                        coords.splice(j+1, 1, updateCoord(t, "U"))
                    } else if (t.y - h.y == 2 && h.x === t.x) {
                        coords.splice(j+1, 1, updateCoord(t, "D"))
                    } else {
                        if (h.x < t.x) {
                            coords.splice(j+1, 1, updateCoord(t, "L"))
                        }
                        if (h.x > t.x) {
                            coords.splice(j+1, 1, updateCoord(t, "R"))
                        }
                        if (h.y < t.y) {
                            coords.splice(j+1, 1, updateCoord(t, "D"))
                        }
                        if (h.y > t.y) {
                            coords.splice(j+1, 1, updateCoord(t, "U"))
                        }
                    }
                    if ((j + 1) === coords.length -1) {
                        visitedCoord.push({...t})
                    }
                }
            }
        }

        return acc
}, 0)

console.log(visitedCoord.filter((item,index) => visitedCoord.findIndex(i => item.x === i.x && item.y === i.y) === index).length)