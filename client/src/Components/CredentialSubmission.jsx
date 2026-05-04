import React, { useState } from 'react';
import { XIcon, PlusIcon, TrashIcon, Loader2Icon } from 'lucide-react';
import toast from 'react-hot-toast';

const CredentialSubmission = ({ listing, onClose, onSubmit }) => {
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState([
        { name: 'Email', type: 'text', value: '' },
        { name: 'Password', type: 'password', value: '' }
    ]);
    const [agreement, setAgreement] = useState(false);

    const handleFieldChange = (index, field, value) => {
        setCredentials(prev => prev.map((cred, i) => i === index ? { ...cred, [field]: value } : cred));
    };

    const addField = () => {
        setCredentials(prev => [...prev, { name: '', type: 'text', value: '' }]);
    };

    const removeField = (index) => {
        setCredentials(prev => prev.filter((_, i) => i !== index));
    };

    const submitCredentials = async () => {
        // Validation
        const isValid = credentials.every(cred => cred.name.trim() !== '' && cred.value.trim() !== '');
        if (!isValid) {
            toast.error('Please fill out all fields completely.');
            return;
        }

        setLoading(true);
        try {
            // Simulated API call or actual function
            if (onSubmit) {
                await onSubmit(credentials);
            } else {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            toast.success('Credentials submitted successfully!');
            if (onClose) onClose();
        } catch (error) {
            toast.error('Failed to submit credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-50 flex items-center justify-center sm:p-4'>
            <div className='bg-white sm:rounded-lg shadow-2xl w-full max-w-xl h-screen sm:h-auto max-h-[90vh] flex flex-col'>
                {/* Header */}
                <div className='bg-gradient-to-r from-indigo-600 to-indigo-400 text-white p-4 sm:rounded-t-lg flex items-center justify-between'>
                    <div className='flex-1 min-w-0'>
                        <h3 className='font-semibold text-lg truncate'>Submit Credentials</h3>
                        <p className='text-sm text-indigo-100 truncate'>
                            Provide credentials for <span className='font-medium text-white'>{listing?.title || 'this listing'}</span>
                        </p>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className='ml-4 p-1 hover:bg-white/20 hover:bg-opacity-20 rounded-lg transition-colors'>
                            <XIcon className='w-5 h-5' />
                        </button>
                    )}
                </div>

                <div className='flex flex-col items-start gap-4 p-4 overflow-y-auto text-gray-700 flex-1'>
                    <div className='w-full bg-indigo-50 text-indigo-700 p-3 rounded-md text-sm mb-2'>
                        Please enter the account login details. Our admin team will verify and change them before handing the account over to the buyer.
                    </div>

                    <div className='w-full space-y-4'>
                        {credentials.map((cred, index) => (
                            <div key={index} className='flex gap-2 items-center'>
                                <div className='flex-1 grid grid-cols-2 gap-2'>
                                    <input 
                                        type='text' 
                                        placeholder='Field Name (e.g., Email)'
                                        value={cred.name} 
                                        onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                                        className='w-full bg-gray-50 outline-indigo-400 border border-gray-200 rounded-md p-2 text-sm'
                                    />
                                    <input 
                                        type={cred.type} 
                                        placeholder='Value'
                                        value={cred.value} 
                                        onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                                        className='w-full bg-gray-50 outline-indigo-400 border border-gray-200 rounded-md p-2 text-sm'
                                    />
                                </div>
                                <button onClick={() => removeField(index)} className='p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors'>
                                    <TrashIcon className='w-4 h-4' />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button onClick={addField} className='flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium'>
                        <PlusIcon className='w-4 h-4' /> Add Another Field
                    </button>

                    <div className='flex gap-2 items-start mt-4'>
                        <input type='checkbox' id='agreement' checked={agreement} onChange={() => setAgreement(prev => !prev)} className='size-4 mt-0.5 text-indigo-500 bg-gray-100 rounded border-gray-300' />
                        <label htmlFor='agreement' className='text-gray-500 text-sm cursor-pointer select-none'>
                            I confirm that the credentials provided above are correct and belong to the specified listing.
                        </label>
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
                        onClick={submitCredentials} 
                        disabled={!agreement || loading || credentials.length === 0} 
                        className='px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px]'
                    >
                        {loading ? <Loader2Icon className='w-4 h-4 animate-spin' /> : 'Submit Credentials'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CredentialSubmission;