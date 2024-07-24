import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// import Logo from "../../../../assets/logo.png"

const Dashboard = () => {
    const [address, setAddress] = useState()
    const [balance, setBalance] = useState()

    useEffect(() => {
        console.log(document.location.origin)
        fetch(`http://127.0.0.1:3001/api/wallet-info`)
          .then(response => response.json())
          .then(data => {
            setAddress(data.address)
            setBalance(data.balance)
          })
                
    }, [])

    console.log({address, balance})

  return (
    <div>
      {/* <img className='logo' src={Logo} /> */}

      <br />

      <div>
        Welcome to the Pebl.
      </div>

      <br />

      <div className='navBar'>
            <div className='navItem'><Link to='/blocks'>Blocks</Link></div>
            <div className='navItem'><Link to='/conduct-transaction'>Conduct a Transaction</Link></div>
            <div className='navItem'><Link to='/transaction-pool'>Transaction Pool</Link></div>
      </div>
      
      <br />

      <div className='WalletInfo'>
        <div>Address: {address}</div>
        <div>Balance: {balance}</div>
      </div>


    </div>
  )
}

export default Dashboard
