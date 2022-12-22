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
let counter = 1;
let increment = 100000000000;

// I like this solution. With the logging of the final root values, it's fun
// to see how the code progresses
while(true) {

    // Increase the counter
    counter += increment;

    // Get a copy of the items
    const items = JSON.parse(JSON.stringify(itemsCopy))
    
    // Update the human field
    items["humn"] = [counter]

    const visitedKeys = new Set<string>()
    while(typeof items["root"][0] !== "number") {	
        Object.keys(items).filter(item => !visitedKeys.has(item)).forEach((item) => {
            if (items[item].length === 1) {
                const keyVal = Object.keys(items).find(key => Array.isArray(items[key]) && items[key].includes(item))
                if (keyVal && items[keyVal]) {
                    items[keyVal].splice(items[keyVal].indexOf(item), 1, items[item][0])!
                    visitedKeys.add(item)
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

    const n1 = items["root"][0]
    const n2 = items["root"][2]

    console.log(`%cLeft: ${n1} %cRight: ${n2}`, "color:yellow", "color:purple")

    if (n1 == n2) {
        break;
    } else if (n1 < n2) {
        counter -= increment;
        increment /= 10;
        console.log(`Overshot. Reducing increment to ${increment}`);
    }
}

console.log(`%cNumber to yell: ${counter}`, "color:green")