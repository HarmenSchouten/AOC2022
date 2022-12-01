const text = await Deno.readTextFile("./Day1/input.txt")

console.log(text.split("\r\n").reduce((acc, item) => {
    item.trim() === ""
        ? acc.push(0)
        : acc.push((acc.pop() ?? 0 )+ Number(item))
    return acc
}, [] as number[]).sort((a,b) => a - b).pop())