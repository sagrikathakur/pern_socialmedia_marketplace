import React, { useState } from 'react';
import { 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Key, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { dummyOrders, platformIcons, getProfileLink } from '../assets/assets';
import toast from 'react-hot-toast';

const MyOrders = () => {
  const currency = import.meta.env.VITE_CURRENCY || '$';
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [showPasswordMap, setShowPasswordMap] = useState({});
  const [copiedField, setCopiedField] = useState(null);

  // Stats
  const totalOrders = dummyOrders.length;
  const totalSpent = dummyOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
  const completedTransfers = dummyOrders.filter(order => order.listing?.isCredentialChanged).length;
  const pendingTransfers = totalOrders - completedTransfers;

  const handleCopy = (text, fieldId) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const togglePasswordVisibility = (index) => {
    setShowPasswordMap(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const openCredentials = (order) => {
    setSelectedOrder(order);
    setShowCredentialsModal(true);
  };

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 pt-8 pb-16 bg-gray-50/50 min-h-screen'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800 '>My Purchases</h1>
        <p className='text-gray-600 mt-1 '>Track your bought accounts and access your credentials</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
        <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between'>
          <div>
            <p className='text-sm font-medium text-gray-500'>Total Orders</p>
            <h3 className='text-2xl font-bold text-gray-800 mt-1'>{totalOrders}</h3>
          </div>
          <div className='bg-indigo-50 p-3 rounded-lg'>
            <ShoppingBag className='size-6 text-indigo-600' />
          </div>
        </div>

        <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between'>
          <div>
            <p className='text-sm font-medium text-gray-500'>Total Spent</p>
            <h3 className='text-2xl font-bold text-gray-800 mt-1'>{currency}{totalSpent.toLocaleString()}</h3>
          </div>
          <div className='bg-green-50 p-3 rounded-lg'>
            <DollarSign className='size-6 text-green-600' />
          </div>
        </div>

        <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between'>
          <div>
            <p className='text-sm font-medium text-gray-500'>Secured Accounts</p>
            <h3 className='text-2xl font-bold text-gray-800 mt-1'>{completedTransfers}</h3>
          </div>
          <div className='bg-blue-50 p-3 rounded-lg'>
            <CheckCircle2 className='size-6 text-blue-600' />
          </div>
        </div>

        <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between'>
          <div>
            <p className='text-sm font-medium text-gray-500'>In Progress</p>
            <h3 className='text-2xl font-bold text-gray-800 mt-1'>{pendingTransfers}</h3>
          </div>
          <div className='bg-amber-50 p-3 rounded-lg'>
            <Clock className='size-6 text-amber-600' />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-100 bg-gray-50/50'>
          <h2 className='font-semibold text-gray-800'>Recent Purchases</h2>
        </div>

        {dummyOrders.length === 0 ? (
          <div className='p-12 text-center'>
            <ShoppingBag className='size-12 text-gray-300 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-800 mb-1'>No purchases found</h3>
            <p className='text-gray-500 text-sm'>Accounts you buy will appear here.</p>
          </div>
        ) : (
          <div className='divide-y divide-gray-100'>
            {dummyOrders.map((order) => {
              const listing = order.listing || {};
              const isSecured = listing.isCredentialChanged;
              
              return (
                <div key={order.id} className='p-6 hover:bg-gray-50/50 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
                  <div className='flex items-start gap-4 flex-1 min-w-0'>
                    <div className='mt-1 shrink-0'>
                      {platformIcons[listing.platform] || <ShoppingBag className='size-10 p-2 bg-gray-100 rounded text-gray-500' />}
                    </div>

                    <div className='min-w-0 flex-1'>
                      <div className='flex flex-wrap items-center gap-2 mb-1'>
                        <h3 className='font-semibold text-gray-800 text-base truncate max-w-md'>
                          {listing.title || 'Social Account'}
                        </h3>
                        <span className='text-xs text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded'>
                          ID: {order.id.slice(0, 8)}...
                        </span>
                      </div>

                      <p className='text-sm text-gray-500 flex items-center gap-1 mb-3'>
                        <span>@{listing.username}</span>
                        {listing.platform && listing.username && (
                          <a 
                            href={getProfileLink(listing.platform, listing.username)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 ml-1 hover:underline"
                          >
                            <ExternalLink className="size-3" />
                          </a>
                        )}
                      </p>

                      <div className='flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-gray-500'>
                        <div className='flex items-center gap-1.5'>
                          <span className='font-medium text-gray-700'>Ordered:</span>
                          <span>{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className='h-3 w-px bg-gray-200 hidden sm:block'></div>
                        <div className='flex items-center gap-1.5'>
                          <span className='font-medium text-gray-700'>Price:</span>
                          <span className='font-semibold text-gray-900'>{currency}{(order.amount || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transfer Status and Action */}
                  <div className='flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 shrink-0'>
                    <div className='flex flex-col lg:items-end gap-1.5'>
                      <div className='text-xs text-gray-400 uppercase tracking-wider font-semibold'>Status</div>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        isSecured 
                          ? 'bg-green-50 text-green-700 border border-green-200/50' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200/50'
                      }`}>
                        {isSecured ? (
                          <>
                            <ShieldCheck className='size-3.5' />
                            <span>Transfer Secured</span>
                          </>
                        ) : (
                          <>
                            <Clock className='size-3.5 animate-pulse' />
                            <span>Securing Account</span>
                          </>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={() => openCredentials(order)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-1.5 shadow-sm ${
                        isSecured 
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100 hover:shadow-indigo-200' 
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Key className='size-4' />
                      <span>View Credentials</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Credentials Modal */}
      {showCredentialsModal && selectedOrder && (
        <div className='fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200'>
            {/* Modal Header */}
            <div className='bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-5 flex items-center justify-between'>
              <div>
                <h3 className='font-bold text-lg flex items-center gap-2'>
                  <Key className='size-5' />
                  Account Credentials
                </h3>
                <p className='text-indigo-100 text-xs mt-1 truncate max-w-sm'>
                  {selectedOrder.listing?.title || 'Social Account'}
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowCredentialsModal(false);
                  setShowPasswordMap({});
                }} 
                className='text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors'
              >
                <X className='size-5' />
              </button>
            </div>

            {/* Modal Body */}
            <div className='p-6'>
              {selectedOrder.listing?.isCredentialChanged ? (
                <div className='space-y-6'>
                  <div className='bg-green-50 border border-green-200/50 p-4 rounded-xl flex gap-3 text-green-800 text-sm'>
                    <ShieldCheck className='size-5 text-green-600 shrink-0 mt-0.5' />
                    <div>
                      <span className='font-semibold'>Secure Handover Complete!</span>
                      <p className='text-xs text-green-700 mt-1 leading-relaxed'>
                        Our admin team has successfully verified and updated the login details. Use the details below to access your new account. Please change the password immediately.
                      </p>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    {selectedOrder.credential?.updatedCredential?.map((cred, index) => {
                      const isPassword = cred.type === 'password';
                      const isVisible = showPasswordMap[index];
                      const displayValue = isPassword && !isVisible ? '••••••••••••' : cred.value;

                      return (
                        <div key={index} className='bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-4'>
                          <div className='min-w-0 flex-1'>
                            <span className='text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1'>
                              {cred.name}
                            </span>
                            <span className={`text-sm font-medium text-gray-800 font-mono truncate block ${isPassword && !isVisible ? 'tracking-widest' : ''}`}>
                              {displayValue}
                            </span>
                          </div>
                          
                          <div className='flex items-center gap-2 shrink-0'>
                            {isPassword && (
                              <button 
                                onClick={() => togglePasswordVisibility(index)}
                                className='p-2 hover:bg-gray-200/50 rounded-lg text-gray-500 hover:text-gray-700 transition-colors'
                                title={isVisible ? 'Hide Password' : 'Show Password'}
                              >
                                {isVisible ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
                              </button>
                            )}
                            <button 
                              onClick={() => handleCopy(cred.value, `field-${index}`)}
                              className='p-2 hover:bg-gray-200/50 rounded-lg text-gray-500 hover:text-gray-700 transition-colors'
                              title='Copy to clipboard'
                            >
                              {copiedField === `field-${index}` ? (
                                <Check className='size-4 text-green-600' />
                              ) : (
                                <Copy className='size-4' />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className='py-8 px-4 text-center'>
                  <div className='bg-amber-50 border border-amber-200/50 p-4 rounded-xl flex gap-3 text-amber-800 text-sm text-left mb-6'>
                    <AlertCircle className='size-5 text-amber-600 shrink-0 mt-0.5' />
                    <div>
                      <span className='font-semibold'>Verification in Progress</span>
                      <p className='text-xs text-amber-700 mt-1 leading-relaxed'>
                        The seller has submitted the account credentials, and our verification team is actively changing and securing them.
                      </p>
                    </div>
                  </div>
                  
                  <div className='flex flex-col items-center justify-center p-6 bg-gray-50 border border-dashed border-gray-200 rounded-xl'>
                    <Clock className='size-12 text-amber-500 animate-spin duration-3000 mb-3' />
                    <h4 className='font-semibold text-gray-800 text-sm'>Securing Credentials</h4>
                    <p className='text-gray-500 text-xs mt-1.5 max-w-xs'>
                      Credentials will be displayed here as soon as the admin secures the account. This process typically takes 1–4 hours.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className='px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end'>
              <button 
                onClick={() => {
                  setShowCredentialsModal(false);
                  setShowPasswordMap({});
                }} 
                className='px-5 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;