const text = await Deno.readTextFile("./Day21/input.txt")
const itemsCopy = text
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

itemsCopy["root"].splice(1,1, "=")
let counter = 0;

// This is a very naive slow solution, but it works :) for the sample input only ;(
// Gotta find a smarter approach, but not doing it today
while(true) {
    const items = JSON.parse(JSON.stringify(itemsCopy))
    items["humn"] = [counter]
    while(typeof items["root"][0] !== "number" && typeof items["root"][1] !== "number") {	
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
    
    if (items["root"][0] === items["root"][2]) {
        break;
    } else {
        counter++
    }
}

console.log(counter)