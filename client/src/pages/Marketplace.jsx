import React from 'react'
import { ArrowLeftIcon, Filter, FilterIcon } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import ListingCard from '../Components/ListingCard'
import FilteredSidebar from '../Components/FilteredSidebar'

const Marketplace = () => {


  const [searchParams] = useSearchParams()

  const search = searchParams.get("search")





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
  const filteredListings = listings.filter((item) => {
    if (filter.platform && filter.platform.length > 0) {
      if (!filter.platform.includes(item.platform)) return false
    }

    if (filter.maxPrice) {
      if (item.price > filter.maxPrice) return false
    }

    if (filter.minFollowers) {
      if ((item.followers_count || 0) < filter.minFollowers) return false
    }

    if (filter.niche && filter.niche.length > 0) {
      if (!filter.niche.includes(item.niche)) return false
    }

    if (filter.verified && item.verified !== filter.verified) return false
    if (filter.monetized && item.monetized !== filter.monetized) return false

    if (search) {
      const trimmedSearch = search.trim().toLowerCase();
      if (
        !item.title?.toLowerCase().includes(trimmedSearch) &&
        !item.username?.toLowerCase().includes(trimmedSearch) &&
        !item.platform?.toLowerCase().includes(trimmedSearch) &&
        !item.niche?.toLowerCase().includes(trimmedSearch) &&
        !item.description?.toLowerCase().includes(trimmedSearch)
      )
        return false
    }

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