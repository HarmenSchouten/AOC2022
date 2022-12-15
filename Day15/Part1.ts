const text = await Deno.readTextFile("./Day15/input.txt")
const items = text.split("\r\n").map(line => line.split(":"))

type Coord = {
    x: number
    y: number
}

const getManhattan = (sensor: Coord, point: Coord) => {
    return Math.abs(point.x - sensor.x) + Math.abs(point.y - sensor.y)
}

const sensors = items
    .map(line => line
        .map(item => item.split(",")))
    .map(line => {
        const sensorX = Number(line[0][0].split("=")[1])
        const sensorY = Number(line[0][1].split("=")[1])
        const beaconX = Number(line[1][0].split("=")[1])
        const beaconY = Number(line[1][1].split("=")[1])
        return {
            sensor: {x: sensorX, y: sensorY},
            beacon: {x: beaconX, y: beaconY},
            manhattan: getManhattan({x: sensorX, y: sensorY}, {x: beaconX, y: beaconY}) 
        }
    })

const row = 2000000
const edges = [] as {left: number, right: number}[]
const bbeacons = [] as {x: number}[]
sensors
    .filter(sensor => (sensor.manhattan - Math.abs(sensor.sensor.y - row) >= 0))
    .forEach(({sensor, beacon, manhattan}) => {
        let left = sensor.x - (manhattan - Math.abs(sensor.y - row))
        let right = sensor.x + (manhattan - Math.abs(sensor.y - row))
        edges.forEach((edge, i) => {
            if (left <= edge.right && right >= edge.left) {
                left = Math.min(edge.left, left)
                right = Math.max(edge.right, right)
                edges.splice(i, 1)
            }
        })
        edges.push({left, right})
        if (beacon.y === row) {
            bbeacons.push({x: beacon.x})
        }
})

let sum = 0;
for (const edge of edges) {
    sum = sum + (edge.right - edge.left + 1)
    for (const beacon of bbeacons) {
        if (beacon.x >= edge.left && beacon.x <= edge.right) {
            sum = sum - 1
        }
    }
}

console.log(sum - 1)

// // Only get sensors that are on line 200000 or have a manhatten that will reach that line
// const validSensors = sensors.filter(sensor => {
//     return sensor.sensor.y == row || 
//             (sensor.sensor.y < row && (sensor.sensor.y + sensor.manhattan >= row)) ||
//             (sensor.sensor.y > row && (sensor.sensor.y - sensor.manhattan <= row))
// })

// console.log(sensors.length, validSensors.length, validSensors)

// const blockedPositions = [] as Coord[]

// for (let x = -(2*row); x <= 2*row; x++) {
//     const point = {x: x, y: row}
//     validSensors.forEach((sensor , i) => {
//         console.log(point, i)
//         if (getManhattan(sensor.sensor, point) <= sensor.manhattan && !blockedPositions.some(item => item.x == point.x && item.y == point.y))
//             blockedPositions.push(point)
//     })
// }

// console.log(blockedPositions.length -1)

// validSensors.forEach((sensor,i) => {
//     // Get all points around the sensor that are smaller than the manhattan distance 
//     // to the beacon
//     for (let x = sensor.sensor.x - sensor.manhattan; x <= sensor.sensor.x + sensor.manhattan; x++) {
//         const point = {x: x, y: number}
//             if (getManhattan(sensor.sensor, point) <= sensor.manhattan && !blockedPositions.some(item => item.x == point.x && item.y == point.y)) {
//                 blockedPositions.push(point)
//             }
//     }
// })

//console.log(blockedPositions.length - 1)

// const minXSensor = Math.min(...sens.map(item => item.x))
// const maxXSensor = Math.max(...sens.map(item => item.x))
// const minYSensor = Math.min(...sens.map(item => item.y))
// const maxYSensor = Math.max(...sens.map(item => item.y))
// const minYBeacon = Math.min(...beacons.map(item => item.y))
// const maxYBeacon = Math.max(...beacons.map(item => item.y))
// const minXBeacon = Math.min(...beacons.map(item => item.x))
// const maxXBeacon = Math.max(...beacons.map(item => item.x))

// const yes = [] as string[]
// let lineCounter = 0
// for (let y = Math.min(minYSensor, minYBeacon, Math.min(...blockedPositions.map(item => item.y))); y <= (Math.max(maxYSensor, maxYBeacon, Math.max(...blockedPositions.map(item => item.y)))); y++) {
//     yes.push(y.toString())
//     for (let x = Math.min(minXSensor, minXBeacon, Math.min(...blockedPositions.map(item => item.x))); x <= (Math.max(maxXSensor, maxXBeacon, Math.max(...blockedPositions.map(item => item.x)))); x++) {
//         if (sens.some(item => item.x === x && item.y === y)) {
//             yes.push("S")
//             continue
//         } else if (beacons.some(item => item.x === x && item.y === y)) {
//             yes.push("B")
//             continue
//         } else if (blockedPositions.some(item => item.x === x && item.y === y)) {
//             if (y === 10) {
//                 lineCounter++
//             }
//             yes.push("#")
//         } else {
//             yes.push(".")
//         }
//     }
//     yes.push("\r\n")	
// }

// console.log(lineCounter)