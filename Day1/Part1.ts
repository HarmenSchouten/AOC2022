const text = await Deno.readTextFile("./Day1/input.txt")

const items = text.split("\r\n")

type CalorieCount = {
    number: number
}

console.log(items.reduce((acc, item) => {
    if (item.trim() === "") {
        acc.push({} as CalorieCount)
        return acc
    } else {
        const last = acc.pop()
        return [...acc, {number: Number(last?.number ?? 0) + Number(item)}]
    }
}, [] as CalorieCount[]).sort((a,b) => a.number - b.number).pop()?.number)