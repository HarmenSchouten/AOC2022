const text = await Deno.readTextFile("./Day6/input.txt")
const items = text.split("\r\n")[0]

let marker = 0;
const tracker = [] as string[]

[...items].forEach((item, index) => {
    if (marker === 0) {
        tracker.push(item)
        if (tracker.length === 14) {
            if (tracker.filter((i, index) => tracker.indexOf(i) === index).length === 14) {
                marker = index;
            } else {
                tracker.shift()
            }
        }
    }
})

console.log(tracker, marker + 1)