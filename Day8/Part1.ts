const text = await Deno.readTextFile("./Day8/input.txt")
const items = text.split("\r\n")

const visibleTrees = [] as string[]
for(let i = 0; i < items.length; i++) {
    for (let j = 0; j < items[0].length; j++) {
        const tree = items[i][j]
        
        // Cycle back to edge of the grid
        let leftVisible = true
        for (let x = j - 1; x >= 0; x--){
            const leftTree = items[i]?.[x]
            if (leftTree === undefined) {
                break;
            } else {
                if (Number(leftTree) >= Number(tree)) {
                    leftVisible = false
                    break;
                }
            }
        }

        // Cycle forward to edge of the grid
        let rightVisible = true
        for (let x = j + 1; x <= items[0].length; x++){
            const rightTree = items[i]?.[x]
                if (rightTree === undefined) {
                    break;
                } else {
                    if (Number(rightTree) >= Number(tree)) {
                        rightVisible = false
                        break;
                    }
                }
        }

        // Cycle up to edge of the grid
        let topVisible = true
        for (let t = i - 1; t >= 0; t--){
            const topTree = items[t]?.[j]
                if (topTree === undefined) {
                    break;
                } else {
                    if (Number(topTree) >= Number(tree)) {
                        topVisible = false
                        break;
                    }
                }
        }

        // Cycle down to edge of the grid
        let bottomVisible = true;
        for (let g = i + 1; g <= items.length; g++){
            const bottomTree = items[g]?.[j]
                if (bottomTree === undefined) {
                    break;
                } else {
                    if (Number(bottomTree) >= Number(tree)) {
                        bottomVisible = false
                        break;
                    }
                }
        }

        if (leftVisible || topVisible || rightVisible || bottomVisible) {
            visibleTrees.push(tree)
        }
    }
}

console.log(visibleTrees, visibleTrees.length)