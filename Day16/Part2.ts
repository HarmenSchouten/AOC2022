const text = await Deno.readTextFile("./Day16/input.txt")
const items = text.split("\r\n")
type Room = {
    name: string
    rate: number
    tunnels: string[]
}

const rooms = items
    .map((line) => line.split(";"))
    .map(([lineA, lineB]) => {
        const [name, rate] = lineA.split(" has flow rate=")
        const multiple = lineB.split(" tunnels lead to valves ")
        const single = lineB.split(" tunnel leads to valve ")
        const split = multiple.length > 1 ? multiple : single
        const tunnels = split[1].split(",").map(item => item.trim().toString())

        return {
            name: name.slice(-2),
            rate: parseInt(rate),
            tunnels,
        } as Room
    })

const destRooms = rooms.filter(line => line.rate != 0)

const findPathToValves = (start: Room, destRooms: Room[], rooms: Room[]) => {
    const visitedRooms = [] as string[]
    const toVisit = [start] as Room[]
    const lowestCost = {
        [start.name]: 0	
    } as Record<string, number>

    let curr:Room | undefined;
    while ((curr = toVisit.shift())) {
        if (visitedRooms.includes(curr.name)) {
            continue;
        }

        const neighbours = curr.tunnels
            .filter(t => !visitedRooms.includes(t))
            .map(t => rooms.find(r => r.name === t)!)

        toVisit.push(...neighbours)

        neighbours.forEach(room => {
                const newCost = lowestCost[curr!.name] + 1
                const neighbourCost = lowestCost[room!.name] ?? newCost
                if (newCost <= neighbourCost) {
                    lowestCost[room!.name] = newCost
                }
            });

        visitedRooms.push(curr.name)
    }

    return destRooms.reduce((acc, room) => {
        return {
            ...acc,
            [room.name]: lowestCost[room.name]
        }
    }, {} as Record<string, number>)
}

const costMap:Record<string, Record<string, number>> = rooms.reduce((acc, line) => {
    return {
        ...acc,
        [line.name]: findPathToValves(line, destRooms.filter(v => v.name !== line.name), rooms)
    }
}, {} as Record<string, Record<string, number>>);

console.log(costMap)

type WalkedPath = {
    name: string
    toVisit: string[]
    remainingTime: number,
    isFinished: boolean
    steps: string[]
    pressure: number
}

const maxPressure = (destinationRooms:Room[], allRooms:Room[]) => {
    const maxTime = 26;
    const paths = [{
        name: "AA",
        toVisit: destinationRooms.map(r => r.name),
        remainingTime: maxTime,
        isFinished: false,
        steps: [],
        pressure: 0
    }] as WalkedPath[]

    for (let i = 0; i < paths.length; i++) {
        const currPath = paths[i]
        if (currPath.remainingTime <= 0 || currPath.isFinished) {
            currPath.isFinished = true
            continue;
        }

        const costs = costMap[currPath.name]
        let madeNewPath = false
        currPath.toVisit
            .filter(room => room !== currPath.name && (currPath.remainingTime - costs[room]) > 1)
            .forEach(room => {
                madeNewPath = true
                paths.push({
                    name: room,
                    toVisit: currPath.toVisit.filter(r => r !== room),
                    remainingTime: currPath.remainingTime - costs[room] - 1,
                    isFinished: false,
                    steps: [...currPath.steps, room],
                    pressure: currPath.pressure + (currPath.remainingTime - costs[room] - 1) * (allRooms.find(r => r.name === room)!.rate)
                })
            })
        
        if (!madeNewPath) {
            currPath.isFinished = true
        }
    }

    return paths.filter(path => path.isFinished).sort((a, b) => b.pressure - a.pressure)
}

// We get all paths by calling the maxPresure function
const paths = maxPressure(destRooms, rooms)

// Now, we walk both paths, with the hooman and the elephant
// A valid path contains a path where the elephant doesn't share any steps with the hooman, I think....
let pressure = 0;
for (let hoomanPath = 0; hoomanPath < paths.length; hoomanPath++)
for (let elephantPath = hoomanPath + 1; elephantPath < paths.length; elephantPath++) {
    // If the paths don't share any steps, then we have a valid path
    if (paths[hoomanPath].steps.every(step => !paths[elephantPath].steps.includes(step))) {
        // Check if the pressure for the path of elephant + hooman is greater than the current max pressure
        if (paths[hoomanPath].pressure + paths[elephantPath].pressure > pressure) {
            pressure = paths[hoomanPath].pressure + paths[elephantPath].pressure
        }
    }
}

console.log(pressure)