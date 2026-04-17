import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import ListingDetails from './pages/ListingDetails'
import ManageListing from './pages/ManageListing'
import Messages from './pages/Messages'
import MyListings from './pages/MyListings'
import MyOrders from './pages/MyOrders'
import { Toaster } from 'react-hot-toast'
import Loading from './pages/Loading'

const App = () => {
  return (
    <div className='min-h-screen bg-slate-50 text-slate-900 font-sans'>
      {/* Toast notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Navigation Bar */}

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/listing/:listingId" element={<ListingDetails />} />
          <Route path="/create-listing" element={<ManageListing />} />
          <Route path="/edit-listing/:id" element={<ManageListing />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/loading" element={<Loading />} />
        </Routes>
      </main>
    </div>
  )
}

export default App