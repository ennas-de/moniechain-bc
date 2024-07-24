import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import history from './../../history'
import Transaction from '../Transaction'

const POLL_INTERVAL_MS = 10000

const TransactionPool = () => {
    const [transactionPoolMap, setTransactionPoolMap] = useState({})

    const fetchTransactionPoolMap = () => {
        fetch(`http://127.0.0.1:3001/api/transaction-pool-map`)
        .then(response => response.json())
        .then(data =>setTransactionPoolMap(data.transactionPool))
    }

    const fetchMineTransactions = () => {
        fetch(`http://127.0.0.1:3001/api/mine-transactions`)
            .then(response => {
                if (response.status === 200) {
                    alert('success')
                    history.push('/blocks')
                } else {
                    alert('The mine-transactions block request did not complete')
                }
            })
    }

    useEffect(() => {
        fetchTransactionPoolMap()

        const fetchPoolMapInterval = setInterval(() => fetchTransactionPoolMap(), POLL_INTERVAL_MS
        )

        return clearInterval(fetchPoolMapInterval)
    }, [])


  return (
    <div className='TransactionPool'>
        <div><Link to='/'>Home</Link></div>

        <h3>Transaction Pool</h3>
        {
            Object.values(transactionPoolMap).map(transaction => {
                return (
                    <div key={transaction.id}>
                        <hr />
                        <Transaction transaction={transaction} key={transaction.id}/>
                    </div>
                )
            })
        }

        <hr />
        <Button 
            variant='danger'
            onClick={fetchMineTransactions}
        >
            Mine the Transactions
        </Button>
    </div>
  )
}

export default TransactionPool
