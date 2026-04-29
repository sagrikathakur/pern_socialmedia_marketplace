import { ArrowDownCircleIcon, CheckCircle, CoinsIcon, DollarSign, Eye, Plus, PlusIcon, StarIcon, TrendingUp, WalletIcon, Search } from 'lucide-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import StatsCard from '../Components/StatsCard'
import { platformIcons } from '../assets/assets'

const MyListings = () => {

  const { userListings, balance } = useSelector((state) => state.listing)
  const currency = import.meta.env.VITE_CURRENCY || '$'
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const totalValue = userListings.reduce((sum, listing) => sum + (listing.price || 0), 0);
  const activeListings = userListings.filter((listing) => listing.status === 'active').length;
  const soldListings = userListings.filter((listing) => listing.status === 'sold').length;

  const filteredListings = userListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          listing.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });





















  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 pt-8'>
      {/* header */}

      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-gray-800 '>My Listings</h1>

          <p className='text-gray-600 mt-1 '> Manage your social media account listings</p>
        </div>
        <button onClick={() => navigate('/create-listing')}
          className='bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-medium flex items-center space-x-2 mt-4 md:mt-0'>
          <Plus className='size-4' />
          <span> New Listing</span>
        </button>
      </div>


      {/* stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
        <StatsCard
          title='Total Listings'
          value={userListings.length}
          icon={<Eye className='size-6 text-indigo-500' />}
          color='indigo'

        />
        <StatsCard
          title='Active Listing'
          value={activeListings}
          icon={<CheckCircle className='size-6 text-green-500' />}
          color='green'

        />
        <StatsCard
          title='Sold'
          value={soldListings}
          icon={<TrendingUp className='size-6 text-indigo-600' />}
          color='indigo'

        />
        <StatsCard
          title='Total Value'
          value={`${currency} ${totalValue.toLocaleString()}`}
          icon={<DollarSign className='size-6 text-yellow-500' />}
          color='yellow'

        />
      </div>

      {/* balance section */}
      <div className='flex flex-col sm:flex-col sm:flex-row justify-between gap-4 xl:gap-20 p-6 mb-10 bg-white rounded-xl border border-gray-200'>
        {
          [
            { label: 'Earned', value: balance.earned, icon: WalletIcon },
            { label: 'Withdrawn', value: balance.withdrawn, icon: ArrowDownCircleIcon },
            { label: 'Available', value: balance.available, icon: CoinsIcon }










          ].map((item, index) => (
            <div key={index} className='flex flex-1 items-center justify-between p-4 rounded-lg border border-gray-100 cursor-pointer'>
              <div className='flex items-center gap-3'>
                <item.icon className='text-gray-500 w-6 h-6' />
                <span className='font-medium text-gray-500 '>{item.label}</span>

              </div>
              <span className='text-xl font-medium text-gray-700'>{currency}
                {item.value.toFixed(2)}</span>
            </div>
          ))
        }






      </div>


      {/* listings */}

      <div className='flex flex-col sm:flex-row justify-between items-center mb-6 gap-4'>
        <div className='flex items-center gap-1 bg-gray-100 p-1 rounded-lg w-full sm:w-auto overflow-x-auto'>
          {['all', 'active', 'sold', 'pending'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors whitespace-nowrap flex-1 sm:flex-none ${
                statusFilter === status 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className='relative w-full sm:w-72'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4' />
          <input
            type="text"
            placeholder="Search by title or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
          />
        </div>
      </div>

      {
        filteredListings.length === 0 ? (
          <div className='bg-white rounded-lg border border-gray-200 p-16 text-center'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Search className='w-8 h-8 text-gray-400' />
            </div>
            <h3 className='text-xl font-medium text-gray-800 mb-2'> No listings found</h3>
            <p className='text-gray-600 mb-6'>
              {userListings.length === 0 ? "Start by creating your first listing" : "Try adjusting your search or filters"}
            </p>
            {userListings.length === 0 ? (
              <button onClick={() => navigate('/create-listing')}
                className='bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium'>Create First Listing</button>
            ) : (
              <button onClick={() => {setSearchTerm(''); setStatusFilter('all')}}
                className='bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium'>Clear Filters</button>
            )}
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg-grid-cols-3 gap-6 '>
            {filteredListings.map((listing) => (
              <div key={listing.id} className='bg-white rounded-lg border border-gray-200 hover:shadow-lg shadow-gray-200/70 transition-shadow flex flex-col'>
                <div className='p-6 flex-1 flex flex-col'>
                  <div className='flex items-start gap-4 justify-between mb-4'>
                    {platformIcons[listing.platform]}

                    <div className='flex-1'>
                      <div className='flex justify-between items-start'>
                        <h3 className='text-lg font-semibold text-gray-800 line-clamp-1'>{listing.title}</h3>

                        <div className='flex items-center gap-2'>
                          {listing.verified && <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Verified</span>}
                          {listing.monetized && <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Monetized</span>}
                          {listing.status === 'active' && (
                            <StarIcon size={18} className={`text-yellow-500 cursor-pointer ${listing.featured && 'fill-yellow-500'}`} />
                          )}
                        </div>
                      </div>
                      <p className='text-sm text-gray-600'><span>@{listing.username}</span></p>

                      <div className='grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4'>
                        <div className='bg-gray-50 rounded p-2 text-center'>
                          <p className='text-[10px] text-gray-500 mb-0.5 uppercase tracking-wider'>Followers</p>
                          <p className='font-semibold text-gray-800 text-sm'>{listing.followers_count >= 1000 ? (listing.followers_count / 1000).toFixed(1) + 'k' : listing.followers_count}</p>
                        </div>
                        <div className='bg-gray-50 rounded p-2 text-center'>
                          <p className='text-[10px] text-gray-500 mb-0.5 uppercase tracking-wider'>Niche</p>
                          <p className='font-semibold text-gray-800 text-sm capitalize'>{listing.niche}</p>
                        </div>
                        <div className='bg-gray-50 rounded p-2 text-center'>
                          <p className='text-[10px] text-gray-500 mb-0.5 uppercase tracking-wider'>Views/Mo</p>
                          <p className='font-semibold text-gray-800 text-sm'>
                            {listing.monthly_views >= 1000000 
                              ? (listing.monthly_views / 1000000).toFixed(1) + 'M' 
                              : listing.monthly_views >= 1000 
                                ? (listing.monthly_views / 1000).toFixed(1) + 'k' 
                                : listing.monthly_views}
                          </p>
                        </div>
                        <div className='bg-gray-50 rounded p-2 text-center'>
                          <p className='text-[10px] text-gray-500 mb-0.5 uppercase tracking-wider'>Engage</p>
                          <p className='font-semibold text-gray-800 text-sm'>{listing.engagement_rate}%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='border-t border-gray-100 pt-4 mt-auto flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${listing.status === 'active' ? 'bg-green-100 text-green-700' : listing.status === 'sold' ? 'bg-indigo-100 text-indigo-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {listing.status}
                      </span>
                    </div>
                    <div className='flex items-center gap-4'>
                      <span className='font-bold text-gray-800 text-lg'>
                        {currency}{(listing.price || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>
        )
      }








    </div>












  )
}

export default MyListings