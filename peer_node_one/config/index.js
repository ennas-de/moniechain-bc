const MINE_RATE = 600000
const INITIAL_DIFFICULTY = 3

const BLOCKCHAIN_METADATA = {
    name: "MonieChain",
    symbol: 'MCN',
    logo: {
        // svg: "../assets/logo.svg",
        // png: "../assets/logo.png"
    },
    description: "A decentralized finance to remove transaction barriers."
}

const GENESIS_DATA = {
    timestamp:  1,
    lastHash: "---------",
    hash: "MonieChain-genesis-hash",
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: [],
    metadata: BLOCKCHAIN_METADATA
}

const STARTING_BALANCE = 100

const MINING_REWARD = 10

const REWARD_INPUT = {address: "*moniechain-authorized-reward*"}

module.exports = {
    GENESIS_DATA,
    MINE_RATE,
    STARTING_BALANCE,
    REWARD_INPUT,
    MINING_REWARD,
    BLOCKCHAIN_METADATA
}
