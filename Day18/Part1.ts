type Point = {
    x: number
    y: number
    z: number
}
const text = await Deno.readTextFile("./Day18/input.txt")
const items = text.split("\r\n")

const blocks: Record<string, number> = {}
for (let i = 0; i < items.length; i++) {
    blocks[items[i]] = 1
}
let counter = 0;
items
    .map(item => item.split(",").map(Number))
    .forEach(([x, y, z]) => {
        if (!blocks[`${x - 1},${y},${z}`]) counter++
        if (!blocks[`${x + 1},${y},${z}`]) counter++
        if (!blocks[`${x},${y - 1},${z}`]) counter++
        if (!blocks[`${x},${y + 1},${z}`]) counter++
        if (!blocks[`${x},${y},${z - 1}`]) counter++
        if (!blocks[`${x},${y},${z + 1}`]) counter++

    })

console.log(counter)