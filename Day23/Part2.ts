const text = await Deno.readTextFile("./Day23/input.txt")
const items = text.split("\r\n").map(item => item.split(""))

type ElveCoord = {
    x: number,
    y: number
    directions: ((items: string[][], x:number, y:number) => boolean|{x: number, y:number})[]
}

const GetElvesCoords = (items: string[][]) => {
    return items.reduce((acc, line, y) => 
    [
        ...acc, 
        ...line
            .reduce((acc, item, x) =>
                item === "#" 
                    ? [...acc, {x: x, y: y, directions: [isClearNorth, isClearSouth, isClearWest, isClearEast]} as ElveCoord]
                    : acc
                , [] as ElveCoord[])
    ], [] as ElveCoord[])
}

const isClear = (value?:string) => (value === "." || value === undefined)

const isClearNorth = (items:string[][], x:number, y:number) => {
    const n = items?.[y - 1]?.[x]
    const nw = items?.[y - 1]?.[x - 1]
    const ne = items?.[y - 1]?.[x + 1]
    return isClear(n) && isClear(nw) && isClear(ne) && {x: x, y: y - 1}
}

const isClearSouth = (items:string[][], x:number, y:number) => {
    const s = items?.[y + 1]?.[x]
    const sw = items?.[y + 1]?.[x - 1]
    const se = items?.[y + 1]?.[x + 1]
    return isClear(s) && isClear(sw) && isClear(se) && {x: x, y: y + 1}
}

const isClearWest = (items:string[][], x:number, y:number) => {
    const w = items?.[y]?.[x - 1]
    const nw = items?.[y - 1]?.[x - 1]
    const sw = items?.[y + 1]?.[x - 1]
    return isClear(w) && isClear(nw) && isClear(sw) && {x: x - 1, y: y}
}

const isClearEast = (items:string[][], x:number, y:number) => {
    const e = items?.[y]?.[x + 1]
    const ne = items?.[y - 1]?.[x + 1]
    const se = items?.[y + 1]?.[x + 1]
    return isClear(e) && isClear(ne) && isClear(se) && {x: x + 1, y: y}
}

const shiftElveDirectionFunction = (elve: ElveCoord) => {
    const fns = elve.directions.splice(0, 1)
    elve.directions.push(...fns)
}

const getElveProposal = (items:string[][], elve: ElveCoord):{x:number, y:number} => {
    const nw = items?.[elve.y - 1]?.[elve.x - 1]
    const n = items?.[elve.y - 1]?.[elve.x]
    const ne = items?.[elve.y - 1]?.[elve.x + 1]
    const sw = items?.[elve.y + 1]?.[elve.x - 1]
    const s = items?.[elve.y + 1]?.[elve.x]
    const se = items?.[elve.y + 1]?.[elve.x + 1]
    const w = items?.[elve.y]?.[elve.x - 1]
    const e = items?.[elve.y]?.[elve.x + 1]

    if (isClear(nw) && isClear(n) && isClear(w) && isClear(ne) && isClear(e) && isClear(sw) && isClear(s) && isClear(se)) {
        shiftElveDirectionFunction(elve)
        return {
            x: elve.x,
            y: elve.y
        }
    }

    const directionIndex = elve.directions.findIndex(item => {
        const proposal = item(items, elve.x, elve.y)
        return proposal !== false
    })
    
    if (directionIndex !== -1) {
        const directionFn = elve.directions[directionIndex]
        const proposal = directionFn(items, elve.x, elve.y) as {x:number, y:number}
        shiftElveDirectionFunction(elve)
        return proposal
    } else {
        shiftElveDirectionFunction(elve)
        return {
            x: elve.x,
            y: elve.y
        }
    }
}

const elves = GetElvesCoords(items)

const round = (items:string[][], elves:ElveCoord[]) => {
    const elveProposals = new Map<{x:number, y:number}, {x:number, y:number}>()
    elves.forEach(elve => elveProposals.set(elve, getElveProposal(items, elve)))

    let increaseY = 0;
    let increaseX = 0;

    elveProposals.forEach((proposal, elve, map) => {
        // If we're the only one moving to this spot, move there
        if ([...map.entries()].filter(item => item[1].x === proposal.x && item[1].y === proposal.y).length === 1) {
            //Fill the area with empty spots on the y axis
            if (items[proposal.y] === undefined && proposal.y < 0) {
                items.splice(0, 0, new Array(items[0].length).fill("."))
                increaseY++
            } else if (items[proposal.y] === undefined && proposal.y > 0) {
                items.push(new Array(items[0].length).fill("."))
            }

            if (items[proposal.y + increaseY]?.[proposal.x] === undefined && proposal.x < 0) {
                items.forEach(item => item.splice(0, 0, "."))
                increaseX++
            } else if (items[proposal.y + increaseY]?.[proposal.x] === undefined && proposal.x >= (items[0].length - 1)) {
                items.forEach(item => item.push("."))
            }

            if (items[proposal.y + increaseY]?.[proposal.x + increaseX] !== undefined) {
                items[elve.y + increaseY][elve.x + increaseX] = "."
                items[proposal.y + increaseY][proposal.x + increaseX] = "#"
                elve.x = (proposal.x + increaseX)
                elve.y = (proposal.y + increaseY)
            }
        }
    })

    return items
}

let itemsCopy = JSON.parse(JSON.stringify(items)) as string[][]

let counter = 0;
while (true) {
    const elvesPositions = elves.map(item => `${item.x},${item.y}`)

    const update = round(itemsCopy, elves)
    const elvesPositions2 = elves.map(item => `${item.x},${item.y}`)

    if (elvesPositions.join("") === elvesPositions2.join("")) {
        break
    }
    itemsCopy = update
    counter++
}

itemsCopy.map(item => console.log(item.join(""))).join("")
console.log(counter++)