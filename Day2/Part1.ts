const text = await Deno.readTextFile("./Day2/input.txt")
const items = text.split("\r\n")
console.log(items.reduce((acc, item) => {
    const split = item.split(" ")
   if (split[0] === "A" && split[1] === 'X' ||
        split[0] === "B" && split[1] === 'Y' ||
        split[0] === "C" && split[1] === 'Z') {
        // DRAW
        switch(split[1]) {
            case "X":
                return acc += 4
            case "Y":
                return acc += 5
           default:
                return acc += 6
        }
    } else if (split[0] === "A" && split[1] === 'Y' ||
                split[0] === "B" && split[1] === 'Z' || 
                split[0] === "C" && split[1] === 'X') {
        // WIN
        switch(split[1]) {
            case "X":
                return acc += (1 + 6)
            case "Y":
                return acc += (2 + 6)
            default:
                return acc += (3 + 6)
        }
    } else {
        // LOSE
        switch(split[1]) {
            case "X":
                return acc += 1
            case "Y":
                return acc += 2
            default:
                return acc += 3
        }
   }
}, 0))