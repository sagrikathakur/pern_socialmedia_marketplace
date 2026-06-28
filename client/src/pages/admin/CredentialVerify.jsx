import AdminTitle from '../../Components/admin/AdminTitle';
import { useEffect } from 'react';
import { useState } from 'react';
import CredentialVerifyModal from '../../Components/admin/CredentialVerifyModal';
import { Loader2Icon } from 'lucide-react';
import { useAuth } from '@clerk/react';

const CredentialVerify = () => {
    const { getToken } = useAuth();

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(null);

    const fetchAllUnverifiedListings = async () => {
        try {
            const token = await getToken();
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
            const response = await fetch(`${BACKEND_URL}/api/listings/admin/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                const unverified = data.listings.filter(l => l.isCredentialSubmitted && !l.isCredentialVerified);
                setListings(unverified);
            }
        } catch (error) {
            console.error("Error fetching listings for verification:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllUnverifiedListings();
    }, []);

    return loading ? (
        <div className='flex items-center justify-center h-full'>
            <Loader2Icon className='animate-spin text-indigo-600 size-7' />
        </div>
    ) : (
        <div className='h-full'>
            {/* Table */}
            {listings.length === 0 ? (
                <div className='flex flex-col items-center justify-center text-center text-gray-600 h-full'>
                    <h3 className='text-2xl font-bold'>All Credentials Verified</h3>
                    <p>No listings with unverified credentials found</p>
                </div>
            ) : (
                <>
                    <AdminTitle text1='Verify' text2=' Credentials' />
                    <div className='mt-10 overflow-x-auto bg-white border border-gray-200 w-full max-w-5xl rounded-xl'>
                        <table className='w-full text-sm text-left  text-gray-700  '>
                            <thead className='text-xs uppercase border-b border-gray-200'>
                                <tr>
                                    <th className='pl-4 py-3'> # </th>
                                    <th className='px-4 py-3'>Title</th>
                                    <th className='px-4 py-3'>Niche</th>
                                    <th className='px-4 py-3'>Platform</th>
                                    <th className='px-4 py-3'>Username</th>
                                    <th className='px-4 py-3'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listings.map((listing, index) => (
                                    <tr key={index} className='border-t border-gray-200 hover:bg-indigo-50/50'>
                                        <td className='pl-4 py-3'>{index + 1}.</td>
                                        <td className='px-4 py-3'>{listing.title}</td>
                                        <td className='px-4 py-3'>{listing.niche}</td>
                                        <td className='px-4 py-3'>{listing.platform}</td>
                                        <td className='px-4 py-3'>{listing.username}</td>
                                        <td className='px-4 py-3'>
                                            <button onClick={() => setShowModal(listing)} className='text-indigo-600 font-medium'>
                                                Verify
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {showModal && (
                            <CredentialVerifyModal
                                listing={showModal}
                                onClose={() => {
                                    fetchAllUnverifiedListings();
                                    setShowModal(null);
                                }}
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default CredentialVerify;
