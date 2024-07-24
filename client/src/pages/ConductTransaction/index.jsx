import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, FormControl, FormGroup } from 'react-bootstrap'
import history from './../../history'

const ConductTransaction = () => {
    const [recipient, setRecipient] = useState('')
    const [amount, setAmount] = useState(0)
    const [knownAddresses, setKnownAddresses] = useState([])

    useEffect(() => {
        fetch(`http://127.0.0.1:3001/api/known-addresses`)
            .then(response => response.json())
            .then(data => setKnownAddresses(data.knownAddresses))
    }, [])

    const updateRecipient = (e) => {
        e.preventDefault()
        setRecipient(e.target.value)
    }

    const updateAmount = (e) => {
        e.preventDefault()
        setAmount(Number(e.target.value))
    }

    const conductTransaction = () => {
        fetch(`http://127.0.0.1:3001/api/transact`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({recipient, amount})
        }).then(response => response.json())
            .then(data => {
                alert(data.message || data.type)
                history.push('/transaction-pool')
            })
    }

  return (
    <div className='ConductTransaction'>
        <Link to='/'>Home</Link>
        <h3>Conduct a Transaction</h3>

        <br />

    <div className='KnownAddresses'>
        <h4 >Known Addresses</h4>
        {
            knownAddresses?.map(knownAddress => {
                return (
                    <div key={knownAddress}>
                        <div>{knownAddress}</div>
                        <br />
                    </div>
                )
            })
        }
    </div>
        
        <br />
        <FormGroup>
            <FormControl
                input='text'
                placeholder='recipient'
                value={recipient}
                onChange={updateRecipient}
            />
        </FormGroup>
        
        <FormGroup>
            <FormControl
                input='number'
                placeholder='amount'
                value={amount}
                onChange={updateAmount}
            />
        </FormGroup>
        <div>
            <Button
                variant='danger'
                onClick={conductTransaction}
            >
                Submit
            </Button>
        </div>
    </div>
  )
}

export default ConductTransaction
