const text = await Deno.readTextFile("./Day17/input.txt")
const jets = [...text.split("\r\n")[0]]

const width = 7;
const margin = 3;
const startX = 2;

const rocks = [
    ["####"],                       // MINUS        
    [".#.", "###",".#."],           // PLUS
    ["###", "..#", "..#"],          // L
    ["#","#","#","#"],              // I
    ["##", "##"],                   // SQUARE
]

let jetIndex = 0;

const checkOverlap = (chamber: string[][], rock:string[], x:number, y:number) => {
    return (x < 0) 
    || (x + rock[0].length > 7)
    || (y < 0)
    || rock.some((row, rowIndex) => (rowIndex + y) < chamber.length && [...row].some((cell, cellIndex) => cell === "#" && chamber[y + rowIndex][cellIndex + x] === "#"))
}

const dropRock = (chamber:string[][], rock:string[], x:number, y:number) => {

    while (!checkOverlap(chamber, rock, x, y)) {
        // Get the current jetblast
        const jetBlast = jets[jetIndex % jets.length]
                
        x += jetBlast === ">" ? 1 : -1

        if(checkOverlap(chamber, rock, x, y)) x += jetBlast === ">" ? -1 : 1

        // Increase the jetIndex
        jetIndex++

        y--
    }

    y++

    // Fill el chamber
    while (rock.length + y > chamber.length) {
        chamber.push(new Array(width).fill("."))
    }

    rock.forEach((row, rowIndex) => {
        [...row].forEach((cell, cellIndex) => {
            if (cell === "#") {
                chamber[y + rowIndex][x + cellIndex] = "#"
            }
        })
    })

    return chamber
}


let chamber = [] as string[][]
for (let i = 0; i < 2022; i++) {
    const rock = rocks[i % 5];
    
    const x = startX;
    const y = chamber.length + margin
    chamber = dropRock(chamber, rock, x, y)
}

console.log(chamber.reverse().map(line => line.join("")).join("\r\n"))
console.log(chamber.length)