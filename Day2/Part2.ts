const text = await Deno.readTextFile("./Day2/input.txt")
const items = text.split("\r\n")
console.log(items.reduce((acc, item) => {
    const split = item.split(" ")

    if (split[1] === "Y") {
        // DRAW
        switch(split[0]) {
            case "A":
                return acc += 4
            case "B":
                return acc += 5
            default:
                return acc += 6
        }
    } else if ( split[1] === "X") {
        // LOSE
        switch(split[0]) {
            case "A":
                return acc += 3
            case "B":
                return acc += 1
            default:
                return acc += 2
        }
    } else {
        switch(split[0]) {
            case "A":
                return acc += (2 + 6)
            case "B":
                return acc += (3 + 6)
            default:
                return acc += (1 + 6)
        }
    }
}, 0))