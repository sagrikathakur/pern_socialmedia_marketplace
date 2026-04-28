import { ArrowDownCircleIcon, CheckCircle, CoinsIcon, DollarSign, Eye, Plus, PlusIcon, StarIcon, TrendingUp, WalletIcon } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import StatsCard from '../Components/StatsCard'
import { platformIcons } from '../assets/assets'

const MyListings = () => {

  const { userListings, balance } = useSelector((state) => state.listing)
  const currency = import.meta.env.VITE_CURRENCY || '$'
  const navigate = useNavigate()

  const totalValue = userListings.reduce((sum, listing) => sum + (listing.price || 0), 0);
  const activeListings = userListings.filter((listing) => listing.status === 'active').length;
  const soldListings = userListings.filter((listing) => listing.status === 'sold').length;





















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


      {
        userListings.length === 0 ? (

          <div className='bg-white rounded-lg border border-gray-200 p-16 text-center'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <PlusIcon className='w-8 h-8 text-gray-400' />

            </div>
            <h3 className='text-xl font-medium text-gray-800 mb-2'> No listings yet</h3>
            <p className='text-gray-600 mb-6'>start by creating your first listing</p>
            <button onClick={() => navigate('/create-listing')}
              className='bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium'>Create First Listing</button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg-grid-cols-3 gap-6 '>
            {userListings.map((listing) => (
              <div key={listing.id} className='bg-white rounded-lg border border-gray-200 hover:shadow-lg shadow-gray-200/70 transition-shadow'>
                <div className='p-6'>
                  <div className='flex items-start gap-4 justify-between mb-4 '>
                    {platformIcons[listing.platform]}

                    <div className='flex-1'>
                      <div className='flex justify-between items-start'>
                        <h3 className='text-lg font-semibold text-gray-800'>{listing.title}</h3>

                        <div className='flex items-center gap-2'>
                          {/*  featureed*/}
                          <div>















                          </div>
                          {
                            listing.status === 'active' && (
                              <StarIcon size={18}
                                className={`text-yellow-500 cursor-pointer ${listing.featured && 'fill-yellow-500'}`} />
                            )
                          }


                        </div>
                      </div>

                      <p className='text-sm text-gray-600'><span>@{listing.username}</span></p>









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