// deno-lint-ignore-file no-explicit-any
const text = await Deno.readTextFile("./Day13/input.txt")
const items = text.split("\r\n")

const compare = (left: any, right: any):any => {
    console.log("Compare " + JSON.stringify(left) + " to " + JSON.stringify(right));
    if ((left == -1) && (right != -1)) {
        return 1
    }
    if ((right == -1) && (left != -1)) {
        return 0
    }

    if (Array.isArray(left)) {
        if (Array.isArray(right)) {
            const maxLen = Math.max(left.length, right.length)
            let result = -1
            for (let i = 0; (i < maxLen && result == -1); i++) {
                result = compare(left[i] ?? -1, right[i] ?? -1)
            }
            return result
        } else {
            return compare(left, [right])
        }
    } else {
        if (Array.isArray(right)) {
            return compare([left], right)
        } else {
            return (left === right) ? -1 : (left < right) ? 1 : 0
        }
    }
}

const compared = items
    .filter(e => e.length)
    .map(e => JSON.parse(e)).sort((a,b) => (compare(a,b) ? -1 : 1)).map(e => JSON.stringify(e));

console.log((compared.indexOf("[[2]]") + 1) * (compared.indexOf("[[6]]") + 1))