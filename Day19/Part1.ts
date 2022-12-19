type Resource = 'ore' | 'clay' | 'obsidian' | 'geode'
type BotRequirements = Record<Resource, number>

const text = await Deno.readTextFile("./Day19/input.txt")
const blueprints = text
    .toLowerCase()
    .split('\r\n')
    .map(line => line
        .split('each ')
        .slice(1)
        .reduce((bots, item) => {
            const [robot, requirements] = item.split('.')[0].split(' robot costs ')
            bots[robot as Resource] = requirements.split(' and ').reduce((requirements, text) => {
                const [count, resource] = text.split(' ')
                requirements[resource as Resource] = parseInt(count)
                return requirements
            }, {} as BotRequirements)
            return bots
        }, {} as Record<Resource, BotRequirements>)
    )

const search = (
    oreBotReq: BotRequirements, 
    clayBotReq: BotRequirements, 
    obsidianBotReq: BotRequirements, 
    geodeBotReq: BotRequirements, 
    remainingMinutes:number) => {

        let bestScore = -Number.MAX_SAFE_INTEGER;
        const seen = new Set();

        const stack = [[0, 0, 0, 0, 1, 0, 0, 0, remainingMinutes]]
        while (stack.length) {
            const next = stack.pop()!;
            let [ore, clay, obsidian, geode, oreRobots, clayRobots, obsidianRobots, geodeRobots, minutes] = next;

            bestScore = Math.max(bestScore, geode)

            if (remainingMinutes === 0) continue;

            const maxOreCost = Math.max(oreBotReq.ore, clayBotReq.ore, obsidianBotReq.ore, geodeBotReq.ore)

            oreRobots = Math.min(oreRobots, maxOreCost)
            ore = Math.min(ore, remainingMinutes * maxOreCost - oreRobots * (minutes - 1))

            clayRobots = Math.min(clayRobots, obsidianBotReq.clay)
            clay = Math.min(clay, remainingMinutes * obsidianBotReq.clay - clayRobots * (minutes - 1))

            geodeRobots = Math.min(geodeRobots, geodeBotReq.geode)
            geode = Math.min(geode, remainingMinutes * geodeBotReq.geode - geodeRobots * (minutes - 1))

            // Assemble a key
            const key = [ore, clay, obsidian, geode, oreRobots, clayRobots, obsidianRobots, geodeRobots, minutes].join(',')
        }
    
    return 0;
}

const answer = blueprints.reduce((acc, blueprint, i) => {
    // Get the max geode count
    return acc + search(blueprint.ore, blueprint.clay, blueprint.obsidian, blueprint.geode, 24) * (i + 1)
}, 0)

console.log(answer)