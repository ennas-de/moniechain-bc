import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import Transaction from '../../pages/Transaction'

const Block = ({block}) => {
    const [displayTransaction, setDisplayTransaction] = useState(false)    
    const {timestamp, hash} = block
    const hashDisplay = `${hash.substring(0, 15)}...`

    const toggleTransaction = () => {
        setDisplayTransaction(prev => !prev)
    }

    const getDisplayTransaction = () => {
        const {data} = block
        const stringifiedData = JSON.stringify(data)
    
        const dataDisplay = stringifiedData.length > 35 ?
            `${stringifiedData.substring(0, 35)}...` : 
            stringifiedData
    
        if (displayTransaction) {
            return (
                <div>
                    {/* {
                        data.map(transaction => (
                            <div key={transaction.id}>
                                <hr />
                                {console.log("transaction id:", transaction.id)}
                                <Transaction transaction={transaction} />
                            </div>
                        ))
                    } */}
                    {
                        <div>
                           <Transaction transaction={data[0]} />
                        </div>
                    }
                    <br />
                    <Button
                        variant="danger"
                        size="small"
                        onClick={toggleTransaction}
                    >
                        Show Less
                    </Button>
                </div>
            )
        }

        return (
            <div>
                <div>Data: {dataDisplay}</div>
                <Button
                    variant="danger"
                    size="sm"
                    onClick={toggleTransaction}
                >
                    Show More
                </Button> 
            </div>
        )

    }

  return (
    <div className='Block'>
      <div>Hash: ${hashDisplay}</div>
      <div>Timestamp: {new Date(timestamp).toLocaleString()}</div>
      {getDisplayTransaction()}
    </div>
  )
}

export default Block
