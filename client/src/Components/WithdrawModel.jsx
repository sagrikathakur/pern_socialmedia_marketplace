import React, { useState } from 'react';
import { XIcon, Loader2Icon } from 'lucide-react';
import toast from 'react-hot-toast';

const WithdrawModel = ({ onClose }) => {
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState([
    { type: 'text', name: 'Account Holder Name', value: '' },
    { type: 'text', name: 'Account Number', value: '' },
    { type: 'text', name: 'Bank Name', value: '' },
    { type: 'text', name: 'Bank Address', value: '' },
    { type: 'text', name: 'Swift Code', value: '' },
  ]);
  const [loading, setLoading] = useState(false);

  const handleFieldChange = (index, value) => {
    setAccount(prev => prev.map((field, i) => i === index ? { ...field, value } : field));
  };

  const handlerSubmission = async (e) => {
    if (e) e.preventDefault();

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error('Please enter a valid withdrawal amount.');
      return;
    }

    const isValid = account.every(field => field.value.trim() !== '');
    if (!isValid) {
      toast.error('Please fill out all bank details completely.');
      return;
    }

    setLoading(true);
    try {
      // Simulated API call or actual function
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Withdrawal request submitted successfully!');
      if (onClose) onClose();
    } catch (error) {
      toast.error('Failed to submit withdrawal request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-50 flex items-center justify-center sm:p-4'>
        <div className='bg-white sm:rounded-lg shadow-2xl w-full max-w-xl h-screen sm:h-auto max-h-[90vh] flex flex-col'>
            {/* Header */}
            <div className='bg-gradient-to-r from-emerald-600 to-emerald-400 text-white p-4 sm:rounded-t-lg flex items-center justify-between'>
                <div className='flex-1 min-w-0'>
                    <h3 className='font-semibold text-lg truncate'>Withdraw Funds</h3>
                    <p className='text-sm text-emerald-100 truncate'>
                        Enter your withdrawal amount and bank details
                    </p>
                </div>
                {onClose && (
                    <button onClick={onClose} className='ml-4 p-1 hover:bg-white/20 hover:bg-opacity-20 rounded-lg transition-colors'>
                        <XIcon className='w-5 h-5' />
                    </button>
                )}
            </div>

            <div className='flex flex-col items-start gap-4 p-4 overflow-y-auto text-gray-700 flex-1'>
                <div className='w-full bg-emerald-50 text-emerald-700 p-3 rounded-md text-sm mb-2'>
                    Please ensure your bank details are correct. Withdrawals typically take 3-5 business days to process.
                </div>

                <div className='w-full space-y-4'>
                    <div className='flex flex-col gap-1'>
                        <label className='text-sm font-medium text-gray-700'>Amount to Withdraw ($)</label>
                        <input 
                            type='number' 
                            placeholder='0.00'
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)}
                            className='w-full bg-gray-50 outline-emerald-400 border border-gray-200 rounded-md p-2 text-sm'
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div className='h-px bg-gray-200 w-full my-2'></div>

                    <h4 className='font-medium text-gray-800 text-sm'>Bank Details</h4>
                    
                    {account.map((field, index) => (
                        <div key={index} className='flex flex-col gap-1'>
                            <label className='text-sm text-gray-600'>{field.name}</label>
                            <input 
                                type={field.type} 
                                placeholder={`Enter ${field.name}`}
                                value={field.value} 
                                onChange={(e) => handleFieldChange(index, e.target.value)}
                                className='w-full bg-gray-50 outline-emerald-400 border border-gray-200 rounded-md p-2 text-sm'
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className='p-4 border-t border-gray-100 bg-gray-50 sm:rounded-b-lg flex justify-end gap-3'>
                {onClose && (
                    <button onClick={onClose} className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'>
                        Cancel
                    </button>
                )}
                <button 
                    onClick={handlerSubmission} 
                    disabled={loading || !amount} 
                    className='px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px]'
                >
                    {loading ? <Loader2Icon className='w-4 h-4 animate-spin' /> : 'Submit Request'}
                </button>
            </div>
        </div>
    </div>
  );
};

export default WithdrawModel;