const {createClient} = require("redis")

const CHANNELS = {
    CONNECTION: "CONNECTION",
    BLOCKCHAIN: "BLOCKCHAIN",
    TRANSACTION: "TRANSACTION"
}

class PubSub {
    constructor({blockchain, transactionPool, redisUrl}) {
        this.blockchain = blockchain
        this.transactionPool = transactionPool

        this.publisher = createClient(redisUrl)
        // this.subscriber = createClient(redisUrl)
        const client = createClient(redisUrl)
        this.subscriber = client.duplicate()

        // For debugging redis
        this.publisher.on("ready", () => {
            console.error("Publisher ready")
        })
        this.subscriber.on("ready", () => {
            console.error("Subscriber ready")
        })
        this.publisher.on("error", (err) => {
            console.error("Publisher error:", err)
        })
        this.subscriber.on("error", (err) => {
            console.error("Subscriber error:", err)
        });

        (async () => {
            try {
                await this.publisher.connect()
                await this.subscriber.connect()
                console.error("Redis connected on:", redisUrl)
            } catch (error) {
                console.error("Error while connecting to redis:", error)
            }
        })()

        this.subscribeToChannels();

        this.subscriber.on(
            "message",
            (channel, message) => this.handleMessage(channel, message)
        );

    }

    async handleMessage(channel, message) {
        console.log(`Message received on channel (${channel}): (${message})`)
        const parsedMessage = JSON.parse(message)

        switch (channel) {
            case CHANNELS.BLOCKCHAIN:
                await this.blockchain.replaceChain(parsedMessage, true, () => {
                    this.transactionPool.clearBlockchainTransactions({
                        chain: parsedMessage
                    })
                })
                break
            case CHANNELS.TRANSACTION:
                    this.transactionPool.setTransaction(parsedMessage)
                    break
            default:
                console.log(`Unhandled message on ${channel}`)
                break
        }
    }

    // subscribeToChannels() {
    //     Object.values(CHANNELS).forEach(async channel => {
    //         await this.subscriber.subscribe(channel)
    //     })
    // }
    subscribeToChannels() {
        Object.values(CHANNELS).forEach(async channel => {
            await this.subscriber.subscribe(channel, (msg) => {
                this.handleMessage(channel, msg)
            })
        })
    }

    publish({channel, message}) {
        // console.log("new message for publish()")
        try {
            // this.subscriber.unsubscribe(channel, () => {
            //     this.publisher.publish(channel, message, () => {
            //         this.subscriber.subscribe(channel);
            //     })
            // })
            this.publisher.publish(channel, message)
            console.log("Message published!")
        } catch (error) {
            console.error("Error publishing message:", error)
        }
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        })
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        })
    }


}

module.exports = PubSub