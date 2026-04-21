import React from 'react'
import { ArrowLeftIcon, Filter, FilterIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import ListingCard from '../Components/ListingCard'
import FilteredSidebar from '../Components/FilteredSidebar'

const Marketplace = () => {
  const navigate = useNavigate()
  const [showFilterPhone, setShowFilterPhone] = useState(false)
  const [filter, setFilters] = useState({
    platform: null,
    maxPrice: 1000000,
    minFollowers: 0,
    niche: null,
    verified: false,
    monetized: false,

  })
  const { listings } = useSelector(state => state.listing)
  const filteredListings = listings.filter((listings) => {
    return true
  })



  return (
    <div className='px-6  md:px-16 lg:px-24 xl:px-32'>

      <div className='flex items-center justify-between text-slate-500'>

        <button onClick={() => { navigate('/'); scrollTo(0, 0) }} className='flex items-center gap-2 py-5'>

          <ArrowLeftIcon className='size-4 ' />
          Back to home</button>



        <button onClick={() => setShowFilterPhone(true)} className='flex sm:hidden items-center gap-2 py-5'>
          <FilterIcon className='size-4' />

          Filters


        </button>

      </div>


      {/* sidebar */}


      <div className='relative flex items-start justify-between gap-8 pb-8'>

        <FilteredSidebar setFilters={setFilters} filters={filter} showFilterPhone={showFilterPhone} setshowFilterPhone={setShowFilterPhone} />


        <div className='flex-1 grid xl:grid-cols-2 gap-4'>
          {
            filteredListings.sort((a, b) => a.featured ? -1 : b.featured ? 1 : 0).map((listing, index) => (
              <ListingCard listing={listing} key={index} />
            ))}
        </div>



      </div>

    </div>


  )
}

export default Marketplace