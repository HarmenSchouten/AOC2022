const text = await Deno.readTextFile("./Day21/input.txt")
const items = text
    .split("\r\n")
    .map(item => item.split(": "))
    .reduce((acc, [key, value]) => {
        const val = value.split(" ")
        if (val.length > 1) {
            acc[key] = val
        } else {
            acc[key] = [Number(val[0])]
        }
        return acc
    }, {} as Record<string, (string|number)[]>)

// This is a very naive slow solution, but it works :)
// 27277ms on my machine (i7-7700HQ)
while(items["root"].length > 1) {
    Object.keys(items).forEach((item) => {
        if (items[item].length === 1) {
            const keyVal = Object.keys(items).find(key => Array.isArray(items[key]) && items[key].includes(item))
            if (keyVal && items[keyVal]) {
                items[keyVal].splice(items[keyVal].indexOf(item), 1, items[item][0])!
            }
        } else {
            try {
                const test = eval(items[item].join(" "))
                items[item] = [test]
            } catch { 
                // Don't warn me, I know what I'm doing
            }
        }
    })
}

console.log(items["root"][0])