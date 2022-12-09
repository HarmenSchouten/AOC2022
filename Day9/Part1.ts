const text = await Deno.readTextFile("./Day9/input.txt")
const items = text.split("\r\n")

type Coord = {
    x: number
    y: number
}

let head = {x: 0, y: 0} as Coord
let tail = {x: 0, y: 0} as Coord

const visitedCoord = [] as Coord[]

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
            head = updateCoord(head, direction, 1)

            if ((head.x - tail.x == 1 && head.y === tail.y) || 
            (head.x - tail.x == -1 && head.y === tail.y) || 
            (head.y - tail.y == 1 && head.x === tail.x) || 
            (head.y - tail.y == -1 && head.x === tail.x) ||
            (head.x - tail.x === 1 && head.y - tail.y === 1) ||
            (head.x - tail.x === -1 && head.y - tail.y === -1) ||
            (head.x - tail.x === -1 && head.y - tail.y === 1) ||
            (head.x - tail.x === 1 && head.y - tail.y === -1)) {
                continue;
            } else if (head.x - tail.x == 2 && head.y === tail.y) {
                tail = updateCoord(tail, "R", 1, true)
            } else if (head.x - tail.x == -2 && head.y === tail.y) {
                tail = updateCoord(tail, "L", 1, true)
            } else if (head.y - tail.y == 2 && head.x === tail.x) {
                tail = updateCoord(tail, "U", 1, true)
            } else if (tail.y - head.y == 2 && head.x === tail.x) {
                tail = updateCoord(tail, "D", 1, true)
            } else {
                if (head.x < tail.x) {
                    console.log("L")
                    tail = updateCoord(tail, "L", 1, false)
                }
                if (head.x > tail.x) {
                    tail = updateCoord(tail, "R", 1, false)
                }
                if (head.y < tail.y) {
                    tail = updateCoord(tail, "D", 1, false)
                }
                if (head.y > tail.y) {
                    console.log("U")
                    tail = updateCoord(tail, "U", 1, false)
                }
                visitedCoord.push({...tail})
            }
        }

        return acc
}, 0)


console.log(visitedCoord.filter((item,index) => visitedCoord.findIndex(i => item.x === i.x && item.y === i.y) === index).length + 1)