"use client"
import { useSession } from 'next-auth/react'
import HeroCard from './HeroCard'
import { useCartContext } from '../context/CartContext';

function HeroSection() {
  const session = useSession();
  const { features } = useCartContext();

  return (
    <div className="h-full w-full relative">
      <img
        src={features?.heroImage || '/assets/salad.jpg'}
        alt="Delicious Salad"
        className="h-full w-full object-cover md:object-center max-sm:min-h-[65vh]"
      />
      {/* <HeroCard /> */}
    </div>
  )
}

export default HeroSection