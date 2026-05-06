import React, { useState } from 'react'

const WithdrawModel = ({ onClose }) => {
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState([
    { type: 'text', name: 'Account Holder Name', value: '' },
    { type: 'text', name: 'Account Number', value: '' },
    { type: 'text', name: 'Bank Name', value: '' },
    { type: 'text', name: 'Bank Address', value: '' },
    { type: 'text', name: 'Swift Code', value: '' },
  ])
  const handlerSubmission = (e) => {
    e.preventDefault();


  }

  return (
    <div>


    </div>
  )
}

export default WithdrawModel