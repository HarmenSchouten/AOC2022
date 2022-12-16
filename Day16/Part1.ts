const text = await Deno.readTextFile("./Day16/input.txt")
const items = text.split("\r\n")
type Line = {
    name: string
    rate: number
    tunnels: string[]
}

const lines = items
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
        } as Line
    })

const sorted = [...lines].sort((a, b) => b.rate - a.rate)

console.log(sorted)

type OpenValve = {
    name: string
    rate: number
    minutes: number
}

const openValves = [] as OpenValve[]
let currentValve = lines.find((_, index) => index === 0)!
const minutes = 10;

const findPath = (currentValve: Line, targetValve: Line) => {
    let valves = [] as string[];
    if (currentValve.name === targetValve.name) {
        return valves
    }
}

for (let i = 1; i <= minutes; i++){
    console.log(currentValve.name)
    if (currentValve.rate > 0) {
        openValves.push({name: currentValve.name, rate: currentValve.rate, minutes: minutes - i})
        continue;
    }

    const nextValve = lines.filter(line => openValves.some(ov => ov.name === line.name)).find(line => line.name === currentValve.tunnels[0])
    currentValve = nextValve!
}