import React from 'react'
import Dashboard from './pages/Dashboard'
import { Route, Routes } from 'react-router'
import Blocks from './pages/Blocks'
import ConductTransaction from './pages/ConductTransaction'
import TransactionPool from './pages/TransactionPool'

const App = () => {
  return (
    <div className='App'>
      <Routes>
        {/* <Route path='/dashboard' element={<Dashboard />} /> */}
        <Route path='/' element={<Dashboard />} />
        <Route path='/blocks' element={<Blocks />} />
        <Route path='/conduct-transaction' element={<ConductTransaction/>} />
        <Route path='/transaction-pool' element={<TransactionPool/>} />
      </Routes>
    </div>
  )
}

export default App
