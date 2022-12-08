const text = await Deno.readTextFile("./Day8/input.txt")
const items = text.split("\r\n")

let score = 0;
for(let i = 0; i < items.length; i++) {
    for (let j = 0; j < items[0].length; j++) {
        const tree = items[i][j]
        
        // Cycle back to edge of the grid
        let leftVisible = 0
        for (let x = j - 1; x >= 0; x--){
            const leftTree = items[i]?.[x]
            if (leftTree === undefined) {
                break;
            } else {
                if (Number(leftTree) < Number(tree)) {
                    leftVisible++
                } else if (Number(leftTree) >= Number(tree)) {
                    leftVisible++
                    break;
                }
            }
        }

        // Cycle forward to edge of the grid
        let rightVisible = 0
        for (let x = j + 1; x <= items[0].length; x++){
            const rightTree = items[i]?.[x]
                if (rightTree === undefined) {
                    break;
                } else {
                    if (Number(rightTree) < Number(tree)) {
                        rightVisible++
                    } else if (Number(rightTree) >= Number(tree)) {
                        rightVisible++
                        break;
                    }
                }
        }

        // Cycle up to edge of the grid
        let topVisible = 0
        for (let t = i - 1; t >= 0; t--){
            const topTree = items[t]?.[j]
                if (topTree === undefined) {
                    break;
                } else {
                    if (Number(topTree) < Number(tree)) {
                        topVisible++
                    } else if (Number(topTree) >= Number(tree)) {
                        topVisible++
                        break;
                    }
                }
        }

        // Cycle down to edge of the grid
        let bottomVisible = 0;
        for (let g = i + 1; g <= items.length; g++){
            const bottomTree = items[g]?.[j]
                if (bottomTree === undefined) {
                    break;
                } else {
                    if (Number(bottomTree) < Number(tree)) {
                        bottomVisible++
                    } else if (Number(bottomTree) >= Number(tree)) {
                        bottomVisible++
                        break;
                    }
                }
        }

        const subScore = leftVisible * rightVisible * topVisible * bottomVisible
        if (subScore > score) {
            score = subScore
        }
    }
}

console.log(score)