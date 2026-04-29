import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import ListingDetails from './pages/ListingDetails'
import ManageListing from './pages/ManageListing'
import Messages from './pages/Messages'
import MyListings from './pages/MyListings'
import MyOrders from './pages/MyOrders'
import { Toaster } from 'react-hot-toast'
import Loading from './pages/Loading'
import Navbar from './Components/Navbar'
import ChatBox from './Components/ChatBox'
import Footer from './Components/Footer'

const App = () => {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Toaster position="top-center" />

      {!pathname.includes('/admin') && <Navbar />}

      <div className={`flex-grow ${!pathname.includes('/admin') && pathname !== '/' ? 'pt-24' : ''}`}>
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
        <ChatBox />
      </div>
      
      {!pathname.includes('/admin') && <Footer />}
    </div>
  )
}

export default App