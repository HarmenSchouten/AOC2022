const text = await Deno.readTextFile("./Day5/input.txt")
const items = text.split("\r\n")

const instructions = items.filter(line => line.startsWith("move") && line.trim() !== "")

const crates = items.filter(line => !instructions.includes(line) && line.trim() !== "")

type Hashmap = { [key: number]: string[] }

const cratesMap = () => {
    const map: Hashmap = {}

    map[1] = ["T", "R" ,"D" ,"H" ,"Q","N" ,"P","B"]
    map[2] = ["V","T","J","B","G","W"
    ]
    map[3] = [
        "Q"
        ,"M"
        ,"V"
        ,"S"
        ,"D"
        ,"H"
        ,"R"
        ,"N"
    ]
    map[4] = [
        "C",
        "M",
        "N",
        "Z",
        "P",
    ]
    map[5] = [
        "B",
        "Z",
        "D",]
    map[6] = [
        "Z",
        "W",
        "C",
        "V",
    ]
    map[7] = [
        "S",
        "L",
        "Q",
        "V",
        "C",
        "N",
        "Z",
        "G",
    ]
    map[8] = [
        "V",
        "N",
        "D",
        "M",
        "J",
        "G",
        "L",
    ]
    map[9] = [
        "G",
        "C",
        "Z",
        "F",
        "M",
        "P",
        "T",
    ]

    return map

}

const testMap = () => {
    const map = {} as Hashmap

    map[1] = ["N", "Z"]
    map[2] = ["D", "C", "M"]
    map[3] = ["P"]

    return map
}

const mappie:Hashmap = cratesMap();

instructions.forEach(item => {
    const test = item.match(/\d+/g)!
    const fromItems = mappie[Number(test[1])]
    const itemsToMove = fromItems.filter((_, index) => index <= (Number(test[0]) - 1))

    mappie[Number(test[1])] = fromItems.filter((_, index) => index > (Number(test[0]) - 1))

    mappie[Number(test[2])] = [...itemsToMove, ...mappie[Number(test[2])]].flat()
})

const result = Object.keys(mappie).reduce((acc, key) => acc += mappie[Number(key)][0] ?? "", "")

console.log(result)