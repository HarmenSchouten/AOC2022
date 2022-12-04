const text = await Deno.readTextFile("./Day4/input.txt")
const items = text.split("\r\n")

console.log(items.reduce((acc, item) => {
    const split = item.split(",")
    const rangeA = [Number(split[0].split("-")[0]), Number(split[0].split("-")[1])]
    const rangeB = [Number(split[1].split("-")[0]), Number(split[1].split("-")[1])]

    const arrA = [] as number[]
    for (let i = rangeA[0]; i<= rangeA[1]; i++) {
        arrA.push(i)
    }

    const arrB = [] as number[]
    for (let i = rangeB[0]; i<= rangeB[1]; i++) {
        arrB.push(i)
    }

    if (arrA.filter(value => arrB.includes(value)).length >= 1) {
        return acc += 1
    }
    return acc
}, 0))