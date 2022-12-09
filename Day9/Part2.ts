const text = await Deno.readTextFile("./Day9/input.txt")
const items = text.split("\r\n")

type Coord = {
    x: number
    y: number
}

const coords = [{x: 0, y: 0}, {x: 0, y: 0},{x: 0, y: 0}, {x: 0, y: 0},{x: 0, y: 0}, {x: 0, y: 0},{x: 0, y: 0}, {x: 0, y: 0},{x: 0, y: 0}, {x: 0, y: 0}]

const visitedCoord = [{x: 0, y: 0}] as Coord[]

const updateCoord = (coord: Coord, direction: string, distance: number, count?:boolean) => {
    switch (direction) {
        case "R":
            coord.x += distance
            break;
        case "L":
            coord.x -= distance
            break;
        case "U":
            coord.y += distance
            break;
        case "D":
            coord.y -= distance
            break;
    }

    if (count) {
        visitedCoord.push({...coord})
    }

    return coord
}

items
    .map(line => line.split(" "))
    .reduce((acc, curr) => {
        console.log(curr)
        const [direction, distance] = curr

        for (let i = 1; i <= Number(distance); i++) {

            for (let j = 0; j < coords.length - 1; j++) {
                const h = coords[j]
                const t = coords[j + 1]

                if (j === 0) {

                    coords.splice(j, 1, updateCoord(h, direction, 1))
                }

                if ((h.x - t.x == 1 && h.y === t.y) || 
                (h.x - t.x == -1 && h.y === t.y) || 
                (h.y - t.y == 1 && h.x === t.x) || 
                (h.y - t.y == -1 && h.x === t.x) ||
                (h.x - t.x === 1 && h.y - t.y === 1) ||
                (h.x - t.x === -1 && h.y - t.y === -1) ||
                (h.x - t.x === -1 && h.y - t.y === 1) ||
                (h.x - t.x === 1 && h.y - t.y === -1)) {
    
                } else if (h.x - t.x == 2 && h.y === t.y) {
                    coords.splice(j+1, 1, updateCoord(t, "R", 1, (j + 1 === coords.length -1)))
                } else if (h.x - t.x == -2 && h.y === t.y) {
                    coords.splice(j+1, 1, updateCoord(t, "L", 1, (j + 1 === coords.length -1)))
                } else if (h.y - t.y == 2 && h.x === t.x) {
                    coords.splice(j+1, 1, updateCoord(t, "U", 1, (j + 1 === coords.length -1)))
                } else if (t.y - h.y == 2 && h.x === t.x) {
                    coords.splice(j+1, 1, updateCoord(t, "D", 1, (j + 1 === coords.length -1)))
                } else {
                    if (h.x < t.x) {
                        coords.splice(j+1, 1, updateCoord(t, "L", 1, false))
                    }
                    if (h.x > t.x) {
                        coords.splice(j+1, 1, updateCoord(t, "R", 1, false))
                    }
                    if (h.y < t.y) {
                        coords.splice(j+1, 1, updateCoord(t, "D", 1, false))
                    }
                    if (h.y > t.y) {
                        coords.splice(j+1, 1, updateCoord(t, "U", 1, false))
                    }

                    if (j + 1 === coords.length -1) {
                        visitedCoord.push({...t})

                    }
                }
            }
        }

        return acc
}, 0)


console.log(visitedCoord.filter((item,index) => visitedCoord.findIndex(i => item.x === i.x && item.y === i.y) === index).length)