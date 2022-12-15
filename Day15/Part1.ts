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
const beaconless = new Set()
sensors.forEach(({sensor, beacon:_beacon, manhattan}) => {
    for (let y = row; y <= row; y++) {
        for (let x = (sensor.x - (manhattan - Math.abs(y - sensor.y))); x <= sensor.x + (manhattan - Math.abs(y - sensor.y)); x++) {
            beaconless.add(x + "," + y)
        }
    }
})

sensors.forEach(sensor => {
    beaconless.delete(sensor.beacon.x + "," + sensor.beacon.y)
})

console.log(beaconless.size)