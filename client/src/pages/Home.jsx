import React from 'react'
import Hero from '../Components/Hero'
import LatestListings from '../Components/LatestListings'
import Plans from '../Components/Plans'
import CTA from '../Components/CTA'

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestListings />
      <Plans />
      <CTA />
    </div>
  )
}

export default Home