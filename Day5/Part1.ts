const text = await Deno.readTextFile("./Day5/input.txt")
const items = text.split("\r\n")

type Hashmap = { [key: number]: string[] }

const instructions = items.filter(line => line.startsWith("move") && line.trim() !== "")
const crates = items.filter(line => !instructions.includes(line) && line.trim() !== "" && !line.includes("1"))

const cratesMap = {} as Hashmap
crates.forEach((line) => {
    for(let i = 0; i <= 9; i++) {
        if (line[(i*4)+1] && line[(i*4)+1].trim() !== "") {
            cratesMap[i + 1] = [...cratesMap[i + 1] ?? [], line[(i*4)+1].trim()]
        }
    }
})

instructions.forEach(item => {
    const test = item.match(/\d+/g)!
    const fromItems = cratesMap[Number(test[1])]
    const itemsToMove = fromItems.filter((_, index) => index <= (Number(test[0]) - 1))

    cratesMap[Number(test[1])] = fromItems.filter((_, index) => index > (Number(test[0]) - 1))

    cratesMap[Number(test[2])] = [...itemsToMove.reverse(), ...cratesMap[Number(test[2])]].flat()
})

console.log(Object.keys(cratesMap).reduce((acc, key) => acc += cratesMap[Number(key)][0] ?? "", ""))