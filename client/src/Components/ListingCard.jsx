import React from 'react'
import { platformIcons } from '../assets/assets';
import { BadgeCheck, LineChart, MapPin, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ListingCard = ({ listing }) => {

  const currency = import.meta.env.VITE_CURRENCY;

  const navigator = useNavigate()
  return (
    <div className='relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition'>
      {/* FEATURED BANNER */}

      {
        listing.featured && (
          <>
            <p className='py-1' />
            <div className='absolute top-0 left-0 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-center text-xs font-semibold tracking-wide uppercase py-1'>Featured
            </div>
          </>
        )
      }

      <div className='p-5 pt-8 px-6'>
        {/* header */}
        <div className='flex items-center gap-4 mb-4'>
          <div className='p-2 bg-gray-50 rounded-xl'>
            {platformIcons[listing.platform]}
          </div>

          <div className='flex flex-col'>
            <h2 className='font-bold text-lg text-gray-900 leading-tight'>{listing.title}</h2>
            <p className='text-sm text-gray-500 font-medium'>
              @{listing.username} • <span className='capitalize text-indigo-600'>{listing.platform}</span>
            </p>
          </div>

          {listing.verified && (
            <div className='ml-auto bg-blue-50 p-1.5 rounded-full'>
              <BadgeCheck className='text-blue-600 w-5 h-5' />
            </div>
          )}
        </div>

        {/* metrics and tags row */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mt-6 pt-6 border-t border-gray-50'>
          {/* stats */}
          <div className='flex flex-wrap items-center gap-8'>
            <div className='flex items-center group'>
              <div className='p-2 bg-slate-50 rounded-lg mr-3 group-hover:bg-slate-100 transition-colors'>
                <User className='size-5 text-slate-500' />
              </div>
              <div>
                <p className='text-xs text-gray-400 font-semibold uppercase tracking-wider'>Followers</p>
                <p className='text-lg font-bold text-gray-900'>{listing.followers_count.toLocaleString()}</p>
              </div>
            </div>

            {listing.engagement_rate && (
              <div className='flex items-center group'>
                <div className='p-2 bg-slate-50 rounded-lg mr-3 group-hover:bg-slate-100 transition-colors'>
                  <LineChart className='size-5 text-slate-500' />
                </div>
                <div>
                  <p className='text-xs text-gray-400 font-semibold uppercase tracking-wider'>Engagement</p>
                  <p className='text-lg font-bold text-gray-900'>{listing.engagement_rate.toLocaleString()}%</p>
                </div>
              </div>
            )}
          </div>

          {/* tags and location */}
          <div className='flex items-center gap-4'>
            <span className='text-xs font-bold bg-pink-50 text-pink-600 px-3 py-1.5 rounded-full capitalize border border-pink-100/50'>
              {listing.niche}
            </span>
            {listing.country && (
              <div className='flex items-center text-gray-500 text-sm font-medium'>
                <MapPin className='size-4 mr-1.5 text-gray-400' />
                {listing.country}
              </div>
            )}
          </div>
        </div>

        {/* description */}
        <div className='mt-5'>
          <p className='text-sm text-gray-500 leading-relaxed line-clamp-2'>{listing.description}</p>
        </div>

        <hr className='my-6 border-gray-100' />

        {/* footer */}
        <div className='flex items-center justify-between'>
          <div className='flex flex-col'>
            <p className='text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1'>Asking Price</p>
            <p className='text-2xl font-bold text-slate-900'>
              <span className='text-indigo-600 mr-0.5'>{currency}</span>
              {listing.price.toLocaleString()}
            </p>
          </div>
          
          <button
            onClick={() => { navigator(`/listing/${listing.id}`); scrollTo(0, 0) }}
            className='px-8 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95'
          >
            More Details
          </button>
        </div>
      </div>
    </div>
  )
}

export default ListingCard
