type MinMax = {
    minX: number
    maxX: number
    minY: number
    maxY: number
    minZ: number
    maxZ: number
}

const text = await Deno.readTextFile("./Day18/input.txt")
const items = text.split("\r\n")

const blocks: Record<string, number|null> = {}
for (let i = 0; i < items.length; i++) {
    blocks[items[i]] = 1
}
const numbered = items.map(item => item.split(",").map(Number))

const minMax = numbered.reduce((acc, [x, y, z]) => {
    acc.minX = Math.min(acc.minX, x)
    acc.maxX = Math.max(acc.maxX, x)
    acc.minY = Math.min(acc.minY, y)
    acc.maxY = Math.max(acc.maxY, y)
    acc.minZ = Math.min(acc.minZ, z)
    acc.maxZ = Math.max(acc.maxZ, z)
    return acc
}, {
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
    minZ: 0,
    maxZ: 0
} as MinMax)

for (let z = minMax.minZ; z <= minMax.maxZ; z++)
for (let y = minMax.minY; y <= minMax.maxY; y++)
for (let x = minMax.minX; x <= minMax.maxX; x++) {
    if (!blocks[`${x},${y},${z}`]) blocks[`${x},${y},${z}`] = 0
}

const floodDelete = (x: number, y: number, z: number) => {
    blocks[`${x},${y},${z}`] = null

    if (blocks[`${x - 1},${y},${z}`] === 0) floodDelete(x - 1, y, z)
    if (blocks[`${x + 1},${y},${z}`] === 0) floodDelete(x + 1, y, z)
    if (blocks[`${x},${y - 1},${z}`] === 0) floodDelete(x, y - 1, z)
    if (blocks[`${x},${y + 1},${z}`] === 0) floodDelete(x, y + 1, z)
    if (blocks[`${x},${y},${z - 1}`] === 0) floodDelete(x, y, z - 1)
    if (blocks[`${x},${y},${z + 1}`] === 0) floodDelete(x, y, z + 1)
}

floodDelete(minMax.minX, minMax.minY, minMax.minZ)

const count = Object.keys(blocks).reduce((acc, key) => {
    if (blocks[key] === null) return acc

    const coords = key.split(",").map(Number)
    if (blocks[`${coords[0] - 1},${coords[1]},${coords[2]}`] == null) acc++
    if (blocks[`${coords[0] + 1},${coords[1]},${coords[2]}`] == null) acc++
    if (blocks[`${coords[0]},${coords[1] - 1},${coords[2]}`] == null) acc++
    if (blocks[`${coords[0]},${coords[1] + 1},${coords[2]}`] == null) acc++
    if (blocks[`${coords[0]},${coords[1]},${coords[2] - 1}`] == null) acc++
    if (blocks[`${coords[0]},${coords[1]},${coords[2] + 1}`] == null) acc++

    return acc
}, 0)

console.log(count)