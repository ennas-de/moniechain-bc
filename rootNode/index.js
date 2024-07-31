const express = require("express")
const dotEnv = require("dotenv")
const cors = require("cors")
const Blockchain = require("./blockchain")
const PubSub = require("./app/pubsub")
const TransactionPool = require("./wallet/transaction-pool")
const Wallet = require("./wallet")
const TransactionMiner = require("./app/transaction-miner")


dotEnv.config()

const DEFAULT_PORT = 3000;
const isDevelopment = process.env.ENV === 'development'
const REDIS_URL = isDevelopment ? 'localhost' : "redis://default:d2JDknzPFVd3MC41iGnitB5hIkW9lHSv@redis-15494.c293.eu-central-1-1.ec2.redns.redis-cloud.com:15494"

const app = express()

const blockchain = new Blockchain()
const transactionPool = new TransactionPool()
const wallet = new Wallet()
const pubsub = new PubSub({blockchain, transactionPool, redisUrl: REDIS_URL})
const transactionMiner = new TransactionMiner({blockchain, transactionPool, wallet, pubsub})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get("/api/blocks", (req, res) => {
    res.status(200).json({
        type: "success",
        message: "Blockchain data fetched",
        blockchain: blockchain.chain
    })
})

app.get("/api/blocks/length", (req, res) => {
    res.status(200).json({
        type: "success",
        message: "Blockchain length fetched",
        blockchain: blockchain.chain.length
    })
})

app.get("/api/blocks/:id", (req, res) => {
    const {id} = req.params 
    const {length} = blockchain.chain 

    const blocksReversed = blockchain.chain.slice().reverse()

    let startIndex = (id-1) * 5
    let endIndex = id * 5

    startIndex = startIndex < length ? startIndex : length 
    endIndex = endIndex < length ? endIndex : length

    res.status(200).json({
        type: "success",
        message: "Blockchain paginated data fetched",
        blockchain: blocksReversed.slice(startIndex, endIndex)
    })
})

app.post("/api/mine", (req, res) => {
    const {data} = req.body 

    blockchain.addBlock({data})

    pubsub.broadcastChain()

    // res.status(201).json({
    //     type: "success",
    //     message: "Blockchain transaction successfully mined",
    // })

    res.redirect("/api/blocks")
})

app.post("/api/transact", (req, res) => {
    const {amount, recipient} = req.body 

    let transaction = transactionPool.existingTransaction({inputAddress: wallet.publicKey})

    try {
        if (transaction) {
            transaction.update({senderWallet: wallet, recipient, amount})
        } else {
            transaction = wallet.createTransaction({
                recipient,
                amount,
                client: blockchain.chain
            })
        }
    } catch (error) {
        return res.status(400).json({
            type: 'error',
            message: error.message
        })
    }

    transactionPool.setTransaction(transaction)

    pubsub.broadcastTransaction(transaction)

    res.status(201).json({
        type: "success",
        message: "Blockchain transaction successful",
        transaction
    })
})

app.get("/api/transaction-pool-map", (req, res) => {
    res.status(200).json({
        type: "success",
        message: "Blockchain transaction pool records fetched",
        transactionPool: transactionPool.transactionMap
    })
})

app.get("/api/mine-transactions", (req, res) => {
    transactionMiner.mineTransactions()

    res.redirect("/api/blocks")
})

app.get("/api/wallet-info", (req, res) => {
    const address = wallet.publicKey

    res.json({
        type: "success",
        message: "Wallet balance fetched",
        address,
        balance: Wallet.calculateBalance({
            chain: blockchain.chain,
            address
        })
    })
})

app.get("/api/known-addresses", (req, res) => {
    const addressMap = {}
    try {      
        for (let block of blockchain.chain) {
            for (let transaction of block.data) {
                const recipients = Object.keys(transaction.outputMap)

                recipients.forEach(recipient => addressMap[recipient] = recipient)
            }
        }

        res.status(200).json({
            type: "success",
            message: "Accounts interacted with.",
            knownAddresses: Object.keys(addressMap)
        })
    } catch (error) {
        res.status(400).json({
            type: "error",
            message: "No record found",
        })
    }

})

app.get("/api/blocks/scan/:id", (req, res) => {
    const { id } = req.params;
    const { chain } = blockchain;
    let foundTransaction = null;
    let foundTransactions = [];

    for (let block of chain) {
        for (let transaction of block.data) {
            if (transaction.id === id) {
                foundTransaction = transaction;
                break;
            }

            if (transaction.input.address === id || transaction.outputMap[id] !== undefined) {
                foundTransactions.push(transaction);
            }
        }
        if (foundTransaction) break;
    }

    if (foundTransaction) {
        res.status(200).json({
            type: "success",
            message: "Transaction found",
            transaction: foundTransaction
        });
    } else if (foundTransactions.length > 0) {
        res.status(200).json({
            type: "success",
            message: "Transactions found",
            transaction: foundTransactions
        });
    } else {
        res.status(404).json({
            type: "error",
            message: "No record found."
        });
    }
});

if (isDevelopment) {
    const walletFoo = new Wallet();
    const walletBar = new Wallet();
  
    const generateWalletTransaction = ({ wallet, recipient, amount }) => {
      const transaction = wallet.createTransaction({
        recipient, amount, chain: blockchain.chain
      });
  
      transactionPool.setTransaction(transaction);
    };
  
    const walletAction = () => generateWalletTransaction({
      wallet, recipient: walletFoo.publicKey, amount: 5
    });
  
    const walletFooAction = () => generateWalletTransaction({
      wallet: walletFoo, recipient: walletBar.publicKey, amount: 10
    });
  
    const walletBarAction = () => generateWalletTransaction({
      wallet: walletBar, recipient: wallet.publicKey, amount: 15
    });
  
    for (let i=0; i<2; i++) {
      if (i%3 === 0) {
        walletAction();
        walletFooAction();
      } else if (i%3 === 1) {
        walletAction();
        walletBarAction();
      } else {
        walletFooAction();
        walletBarAction();
      }
  
      transactionMiner.mineTransactions();
    }
  }

app.listen(DEFAULT_PORT, () => {
    console.log(`app running on ${process.env.ENV} mode at 'https://pebl.onrender.com/${DEFAULT_PORT}'`)
})


