const text = await Deno.readTextFile("./Day20/input.txt")
const numbers = text.split("\r\n").map(Number)

const mixing = (numbers: number[]) => {
    const linkedArr = numbers.map((val, index) => [val * 811589153, index])
    for (let j = 0; j < 10; j++) {
        for (let i = 0; i < linkedArr.length; i++) {
            const indice = linkedArr.findIndex((val) => val[1] === i)
            const val = linkedArr[indice][0]
            linkedArr.splice(indice, 1)
            linkedArr.splice((indice + val) % linkedArr.length, 0, [val, i])    
        }
    }

    return linkedArr.map(item => item[0])
}

const mixed = mixing(numbers)
const zeroIndex = mixed.findIndex(val => val === 0)
console.log(
    mixed[(zeroIndex + 1000) % mixed.length] + 
    mixed[(zeroIndex + 2000) % mixed.length] + 
    mixed[(zeroIndex + 3000) % mixed.length]
)