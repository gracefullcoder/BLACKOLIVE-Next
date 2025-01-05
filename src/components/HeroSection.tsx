"use client"
import { useSession } from 'next-auth/react'
import HeroCard from './HeroCard'

function HeroSection() {
  const session = useSession();

  console.log(session);
  
  return (
    <div className="h-full w-full relative">
      <img
        src='/assets/salad.jpg'
        alt="Delicious Salad"
        className="h-full w-full object-cover md:object-center"
      />
      <HeroCard />
    </div>
  )
}

export default HeroSection