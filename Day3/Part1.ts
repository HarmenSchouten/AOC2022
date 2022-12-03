const text = await Deno.readTextFile("./Day3/input.txt")
const items = text.split("\r\n")

const isLowerCase = (input:string):boolean => input.toLowerCase() === input;

const getMap = () => {
    const letterMap = new Map<string, number>()

    letterMap.set('a', 1);
    letterMap.set('b', 2);
    letterMap.set('c', 3);
    letterMap.set('d', 4);
    letterMap.set('e', 5);
    letterMap.set('f', 6);
    letterMap.set('g', 7);
    letterMap.set('h', 8);
    letterMap.set('i', 9);
    letterMap.set('j', 10);
    letterMap.set('k', 11);
    letterMap.set('l', 12);
    letterMap.set('m', 13);
    letterMap.set('n', 14);
    letterMap.set('o', 15);
    letterMap.set('p', 16);
    letterMap.set('q', 17);
    letterMap.set('r', 18);
    letterMap.set('s', 19);
    letterMap.set('t', 20);
    letterMap.set('u', 21);
    letterMap.set('v', 22);
    letterMap.set('w', 23);
    letterMap.set('x', 24);
    letterMap.set('y', 25);
    letterMap.set('z', 26);
    return letterMap
}

console.log(items.reduce((acc, line) => {
    const split = [...line].slice(0, line.length / 2)
    const split2 = [...line].slice(line.length / 2)

    let matchingItem = '';
    split.forEach((item) => {
        if (matchingItem === "" && split2.find(i => item == i)) {
            matchingItem = item;
        }
    })

    const map = getMap();
    const score = isLowerCase(matchingItem) ? 0 : 26
    return acc += (score + map.get(matchingItem!.toLowerCase()!)!)
}, 0))