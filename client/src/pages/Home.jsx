import React from 'react'
import Hero from '../Components/Hero'
import LatestListings from '../Components/LatestListings'
import Plans from '../Components/Plans'
import CTA from '../Components/CTA'
import Footer from '../Components/Footer'

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestListings />
      <Plans />
      <CTA />
      <Footer />
    </div>
  )
}

export default Home