import React from 'react'

const Transaction = ({transaction}) => {
  // console.log({transaction})
    const {input, outputMap} = transaction 
    const recipients = Object.keys(outputMap)

  return (
    <div className='Transaction'>
        <div>From: {`${input.address.substring(0,20)}...`} | Balance: {input.amount}</div>
        {
            // recipients.map(recipient => (
            //     <div key={recipient}>
            //         To: {`${recipient.substring(0, 20)}...`} | Sent: {outputMap[recipient]}
            //     </div>
            // ))
            <div>
                To: {`${recipients[0].substring(0,20)}...`} | 
                Sent: {outputMap[recipients[0]]}
            </div>
        }
        
    </div>
  )
}

export default Transaction
