import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '@clerk/react';
import { 
  Save, 
  X, 
  Hash, 
  Users, 
  BarChart, 
  Eye, 
  DollarSign, 
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2Icon
} from 'lucide-react';
import toast from 'react-hot-toast';

const platforms = [
  'youtube', 'instagram', 'tiktok', 'facebook', 'twitter', 
  'linkedin', 'pinterest', 'snapchat', 'twitch', 'discord'
];

const niches = [
  'tech', 'travel', 'fashion', 'fitness', 'music', 
  'gaming', 'finance', 'lifestyle', 'education', 'other'
];

const ManageListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const { getToken, isLoaded, isSignedIn } = useAuth();
  
  const { userListings } = useSelector((state) => state.listing);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: '',
    platform: platforms[0],
    username: '',
    followers_count: '',
    engagement_rate: '',
    monthly_views: '',
    niche: niches[0],
    price: '',
    description: '',
    verified: false,
    monetized: false,
  });

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      toast.error("Please log in to manage listings.");
      navigate('/');
    }
  }, [isLoaded, isSignedIn, navigate]);

  useEffect(() => {
    if (!isLoaded) return;
    if (isEditMode) {
      const listingToEdit = userListings.find(list => list.id === id);
      if (listingToEdit) {
        setFormData({
          title: listingToEdit.title || '',
          platform: listingToEdit.platform || platforms[0],
          username: listingToEdit.username || '',
          followers_count: listingToEdit.followers_count || '',
          engagement_rate: listingToEdit.engagement_rate || '',
          monthly_views: listingToEdit.monthly_views || '',
          niche: listingToEdit.niche || niches[0],
          price: listingToEdit.price || '',
          description: listingToEdit.description || '',
          verified: listingToEdit.verified || false,
          monetized: listingToEdit.monetized || false,
        });
      } else {
        toast.error('Listing not found');
        navigate('/my-listings');
      }
    }
  }, [id, isEditMode, userListings, navigate, isLoaded]);

  if (!isLoaded) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <Loader2Icon className='size-7 animate-spin text-indigo-600' />
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.username || !formData.price || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const token = await getToken();
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const url = isEditMode 
        ? `${BACKEND_URL}/api/listings/${id}` 
        : `${BACKEND_URL}/api/listings`;
        
      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          followers_count: parseFloat(formData.followers_count) || 0,
          engagement_rate: parseFloat(formData.engagement_rate) || 0,
          monthly_views: parseFloat(formData.monthly_views) || 0,
          price: parseFloat(formData.price) || 0
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to save listing');
      }

      toast.success(isEditMode ? 'Listing updated successfully!' : 'Listing created successfully!');
      navigate('/my-listings');
    } catch (error) {
      toast.error(error.message || 'Failed to save listing');
    }
  };

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 pt-8 pb-16 bg-gray-50/50 min-h-screen'>
      {/* Header */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-800'>
            {isEditMode ? 'Edit Listing' : 'Create New Listing'}
          </h1>
          <p className='text-gray-600 mt-1'>
            {isEditMode 
              ? 'Update the details of your social media account listing' 
              : 'Add a new social media account to sell on the marketplace'}
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <button 
            type="button"
            onClick={() => navigate('/my-listings')}
            className='px-6 py-2 rounded-lg font-medium border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors flex items-center gap-2'
          >
            <X className='size-4' />
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className='bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm shadow-indigo-200'
          >
            <Save className='size-4' />
            {isEditMode ? 'Save Changes' : 'Create Listing'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Main Form Column */}
        <div className='lg:col-span-2 space-y-8'>
          {/* Basic Details Section */}
          <div className='bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm'>
            <div className='flex items-center gap-2 mb-6 border-b border-gray-100 pb-4'>
              <div className='bg-indigo-50 p-2 rounded-lg'>
                <FileText className='size-5 text-indigo-600' />
              </div>
              <h2 className='text-xl font-semibold text-gray-800'>Basic Details</h2>
            </div>

            <div className='space-y-5'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                  Listing Title <span className="text-red-500">*</span>
                </label>
                <input
                  type='text'
                  name='title'
                  value={formData.title}
                  onChange={handleChange}
                  placeholder='e.g., Tech YouTube Channel with 120k Subscribers'
                  className='w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all'
                  required
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                    Platform <span className="text-red-500">*</span>
                  </label>
                  <select
                    name='platform'
                    value={formData.platform}
                    onChange={handleChange}
                    className='w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all capitalize'
                  >
                    {platforms.map(platform => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                    Username/Handle <span className="text-red-500">*</span>
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <span className='text-gray-500'>@</span>
                    </div>
                    <input
                      type='text'
                      name='username'
                      value={formData.username}
                      onChange={handleChange}
                      placeholder='username'
                      className='w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all'
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder='Describe your account. Include history, audience demographics, monetization details, and why you are selling it.'
                  className='w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y'
                  required
                />
              </div>
            </div>
          </div>

          {/* Metrics Section */}
          <div className='bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm'>
            <div className='flex items-center gap-2 mb-6 border-b border-gray-100 pb-4'>
              <div className='bg-blue-50 p-2 rounded-lg'>
                <BarChart className='size-5 text-blue-600' />
              </div>
              <h2 className='text-xl font-semibold text-gray-800'>Account Metrics</h2>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5'>
                  <Users className='size-3.5 text-gray-500' /> Followers
                </label>
                <input
                  type='number'
                  name='followers_count'
                  value={formData.followers_count}
                  onChange={handleChange}
                  placeholder='e.g., 50000'
                  min="0"
                  className='w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5'>
                  <Eye className='size-3.5 text-gray-500' /> Monthly Views
                </label>
                <input
                  type='number'
                  name='monthly_views'
                  value={formData.monthly_views}
                  onChange={handleChange}
                  placeholder='e.g., 250000'
                  min="0"
                  className='w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5'>
                  <Hash className='size-3.5 text-gray-500' /> Engagement Rate %
                </label>
                <input
                  type='number'
                  name='engagement_rate'
                  value={formData.engagement_rate}
                  onChange={handleChange}
                  placeholder='e.g., 4.5'
                  min="0"
                  step="0.1"
                  className='w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className='space-y-8'>
          {/* Pricing & Category */}
          <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
            <div className='flex items-center gap-2 mb-6 border-b border-gray-100 pb-4'>
              <div className='bg-green-50 p-2 rounded-lg'>
                <DollarSign className='size-5 text-green-600' />
              </div>
              <h2 className='text-xl font-semibold text-gray-800'>Pricing & Category</h2>
            </div>

            <div className='space-y-5'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                  Asking Price (USD) <span className="text-red-500">*</span>
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <span className='text-gray-500'>$</span>
                  </div>
                  <input
                    type='number'
                    name='price'
                    value={formData.price}
                    onChange={handleChange}
                    placeholder='0.00'
                    min="0"
                    className='w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all'
                    required
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                  Niche / Category
                </label>
                <select
                  name='niche'
                  value={formData.niche}
                  onChange={handleChange}
                  className='w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all capitalize'
                >
                  {niches.map(niche => (
                    <option key={niche} value={niche}>{niche}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
            <div className='flex items-center gap-2 mb-6 border-b border-gray-100 pb-4'>
              <div className='bg-amber-50 p-2 rounded-lg'>
                <AlertCircle className='size-5 text-amber-600' />
              </div>
              <h2 className='text-xl font-semibold text-gray-800'>Account Status</h2>
            </div>

            <div className='space-y-4'>
              <label className='flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors'>
                <div className='flex items-center h-5 mt-0.5'>
                  <input
                    type='checkbox'
                    name='verified'
                    checked={formData.verified}
                    onChange={handleChange}
                    className='size-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
                  />
                </div>
                <div>
                  <div className='text-sm font-medium text-gray-800 flex items-center gap-1.5'>
                    Verified Account
                    {formData.verified && <CheckCircle className='size-3.5 text-blue-500' />}
                  </div>
                  <div className='text-xs text-gray-500 mt-0.5'>Check if the account has a verified badge.</div>
                </div>
              </label>

              <label className='flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors'>
                <div className='flex items-center h-5 mt-0.5'>
                  <input
                    type='checkbox'
                    name='monetized'
                    checked={formData.monetized}
                    onChange={handleChange}
                    className='size-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
                  />
                </div>
                <div>
                  <div className='text-sm font-medium text-gray-800 flex items-center gap-1.5'>
                    Monetized
                    {formData.monetized && <DollarSign className='size-3.5 text-green-500' />}
                  </div>
                  <div className='text-xs text-gray-500 mt-0.5'>Check if the account is currently generating ad revenue.</div>
                </div>
              </label>
            </div>
          </div>
          
          <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
            <h3 className="text-sm font-semibold text-indigo-800 mb-2">Important Note</h3>
            <p className="text-xs text-indigo-700 leading-relaxed">
              Ensure all information provided is accurate. Any false claims regarding metrics, monetization status, or account ownership may result in your listing being removed and your account banned.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ManageListing;