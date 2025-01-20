"use client"
import { useState } from 'react';
import Link from 'next/link';
// import { useRouter } from 'next/navigation';
import { menuOutline, closeOutline, searchOutline, bagHandleOutline, personOutline } from 'ionicons/icons';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useCartContext } from '../context/CartContext';
import Image from 'next/image';
import { Menu, X, Search, ShoppingBag, User } from "lucide-react";


function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const session = useSession();
  // const router = useRouter();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // const navLinkStyle = (path: string) => {
  //   return router.pathname === path
  //     ? 'text-green-600 font-bold border-b-2 border-white duration-300'
  //     : 'text-black hover:text-green-700';
  // };

  const { items, setIsOpen } = useCartContext();

  return (
    <header className="fixed w-full bg-white z-10 shadow-md">
      <div className="flex justify-between px-6 md:px-12 lg:px-32 py-4 items-center">
        <div>
          <Link href="/" className="text-xl font-bold">
            <Image src="/assets/logo.png" alt="Logo" width={48} height={12} className="h-12 w-12" />
          </Link>
        </div>

        <div className="hidden lg:flex gap-8">
          <nav className="flex gap-6 list-none">
            <li>
              <Link href="/">
                HOME
              </Link>
            </li>
            <li>
              <Link href="/salads" >
                SALAD
              </Link>
            </li>
            <li>
              <Link href="/membership" >
                MEMBERSHIP
              </Link>
            </li>
            <li>
              <Link href="/contact" >
                CONTACT
              </Link>
            </li>
            {
              session?.data?.user?.isAdmin && <li>
                <Link href="/admin" >
                  ADMIN
                </Link>
              </li>
            }
          </nav>
        </div>

        <div>
          <ul className="flex gap-6 items-center text-2xl list-none">
            <li className="cursor-pointer">
              <Search className="text-gray-600 hover:text-black" />
            </li>
            <li className="cursor-pointer relative">
              <ShoppingBag className="text-gray-600 hover:text-black" onClick={() => setIsOpen((p) => !p)} />
              <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {items.length}
              </span>
            </li>
            <li className="cursor-pointer">
              {session?.data?.user ?
                <div className='flex gap-2 items-center'>
                  <Link href="/user"><User className='text-gray-600 hover:text-black' /></Link>
                  <button className='text-slate-600 text-xl hover:text-black' onClick={() => signOut()}>logout</button>
                </div>
                :
                <button className='ml-2 text-white text-xl hover:text-green-500 px-6 py-2 bg-black rounded-3xl' onClick={() => signIn('google')}>login</button>
              }
            </li>
            <li>
              {menuOpen ? (
                <X
                  className="lg:hidden text-gray-600 hover:text-black cursor-pointer"
                  onClick={toggleMenu}
                />
              ) : (
                <Menu
                  className="lg:hidden text-gray-600 hover:text-black cursor-pointer"
                  onClick={toggleMenu}
                />)}
            </li>
          </ul>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden px-6 py-4 bg-white shadow-md">
          <nav className="flex flex-col gap-4 list-none">
            <li className="hover:font-bold">
              <Link href="/" onClick={toggleMenu}>
                HOME
              </Link>
            </li>
            <li className="hover:font-bold">
              <Link href="/salads" onClick={toggleMenu}>
                SALAD
              </Link>
            </li>
            <li className="hover:font-bold">
              <Link href="/membership" onClick={toggleMenu}>
                MEMBERSHIP
              </Link>
            </li>
            <li className="hover:font-bold">
              <Link href="/contact" onClick={toggleMenu}>
                CONTACT
              </Link>
            </li>
            {session?.data?.user?.isAdmin && <li className="hover:font-bold">
              <Link href="/admin" onClick={toggleMenu}>
                ADMIN
              </Link>
            </li>}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
